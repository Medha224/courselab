const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { researchService } = require('./services/researchService');
const { synthesisService } = require('./services/synthesisService');
const { qcLayer1Service } = require('./services/qcLayer1Service');
const { qcLayer2Service } = require('./services/qcLayer2Service');
const { exportService } = require('./services/exportService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Storage directory for persistent lessons and instructor drafts
const STORAGE_DIR = path.join(__dirname, 'storage');
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Helper to get lesson file path
function getLessonPath(id) {
  return path.join(STORAGE_DIR, `${id}.json`);
}

// Helper to save lesson
function saveLessonData(id, data) {
  const filePath = getLessonPath(id);
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}

// Helper to load lesson
function loadLessonData(id) {
  const filePath = getLessonPath(id);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// ---------------------- API ROUTES ----------------------

// Health check and system configuration
app.get('/api/health', (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);
  res.json({
    status: 'ok',
    version: '1.0.0',
    providers: {
      gemini: hasGeminiKey,
      openai: hasOpenAIKey,
      intelligentEngine: true // Always active zero-config engine
    },
    activeProvider: hasGeminiKey ? 'Gemini 2.5 Flash' : (hasOpenAIKey ? 'OpenAI GPT-4o' : 'Intelligent Engine (Autonomous)')
  });
});

// Configure API keys dynamically from instructor settings modal
app.post('/api/config', (req, res) => {
  const { geminiApiKey, openaiApiKey } = req.body;
  if (geminiApiKey !== undefined) process.env.GEMINI_API_KEY = geminiApiKey;
  if (openaiApiKey !== undefined) process.env.OPENAI_API_KEY = openaiApiKey;
  res.json({
    success: true,
    message: 'Configuration updated successfully',
    providers: {
      gemini: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
      intelligentEngine: true
    }
  });
});

// Step 1: Research only
app.post('/api/lesson/research', async (req, res) => {
  try {
    const { lessonTitle, learningObjective, apiKey } = req.body;
    if (!lessonTitle || !lessonTitle.trim()) {
      return res.status(400).json({ error: 'Lesson Title is required.' });
    }
    if (!learningObjective || !learningObjective.trim()) {
      return res.status(400).json({ error: 'Learning Objective is required.' });
    }

    console.log(`[API] Researching: "${lessonTitle}"...`);
    const researchBundle = await researchService.conductResearch({
      lessonTitle: lessonTitle.trim(),
      learningObjective: learningObjective.trim(),
      apiKey: apiKey || process.env.GEMINI_API_KEY
    });

    res.json({ success: true, researchBundle });
  } catch (err) {
    console.error('[API] Research error:', err);
    res.status(500).json({ error: err.message || 'Failed to conduct research.' });
  }
});

// Step 2: Generate Lesson Content (Uses research or runs research automatically)
app.post('/api/lesson/generate', async (req, res) => {
  try {
    const { lessonTitle, learningObjective, researchBundle, apiKey, id } = req.body;
    if (!lessonTitle || !lessonTitle.trim()) {
      return res.status(400).json({ error: 'Lesson Title is required.' });
    }
    if (!learningObjective || !learningObjective.trim()) {
      return res.status(400).json({ error: 'Learning Objective is required.' });
    }

    const lessonId = id || `lesson_${Date.now()}`;
    console.log(`[API] Generating lesson [${lessonId}]: "${lessonTitle}"...`);

    // 1. Research phase (if not provided)
    let research = researchBundle;
    if (!research || !research.books || research.books.length === 0) {
      research = await researchService.conductResearch({
        lessonTitle: lessonTitle.trim(),
        learningObjective: learningObjective.trim(),
        apiKey: apiKey || process.env.GEMINI_API_KEY
      });
    }

    // 2. Synthesize structured 45-minute lesson
    const lessonContent = await synthesisService.synthesizeLesson({
      lessonTitle: lessonTitle.trim(),
      learningObjective: learningObjective.trim(),
      researchBundle: research,
      targetDurationMinutes: 45,
      apiKey: apiKey || process.env.GEMINI_API_KEY
    });

    const lessonRecord = {
      id: lessonId,
      lessonTitle: lessonTitle.trim(),
      learningObjective: learningObjective.trim(),
      researchBundle: research,
      lessonContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveLessonData(lessonId, lessonRecord);

    res.json({ success: true, lesson: lessonRecord });
  } catch (err) {
    console.error('[API] Lesson generation error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate lesson content.' });
  }
});

// Step 3: Run Quality Control Layer 1 (Research & Factual Accuracy)
app.post('/api/lesson/qc1', async (req, res) => {
  try {
    const { lessonId, lessonTitle, learningObjective, lessonContent, researchBundle, apiKey } = req.body;
    if (!lessonContent) {
      return res.status(400).json({ error: 'Lesson content is required for QC Layer 1 audit.' });
    }

    console.log(`[API] Running QC Layer 1 (Factual Accuracy) for "${lessonTitle || lessonId}"...`);
    const qc1Report = await qcLayer1Service.auditFactualAccuracy({
      lessonTitle,
      learningObjective,
      lessonContent,
      researchBundle,
      apiKey: apiKey || process.env.GEMINI_API_KEY
    });

    // If lessonId exists in storage, update record
    if (lessonId) {
      const existing = loadLessonData(lessonId);
      if (existing) {
        existing.qc1Report = qc1Report;
        saveLessonData(lessonId, existing);
      }
    }

    res.json({ success: true, qc1Report });
  } catch (err) {
    console.error('[API] QC1 audit error:', err);
    res.status(500).json({ error: err.message || 'QC Layer 1 audit failed.' });
  }
});

// Step 4: Run Quality Control Layer 2 (Instructional Quality)
app.post('/api/lesson/qc2', async (req, res) => {
  try {
    const { lessonId, lessonTitle, learningObjective, lessonContent, apiKey } = req.body;
    if (!lessonContent) {
      return res.status(400).json({ error: 'Lesson content is required for QC Layer 2 audit.' });
    }

    console.log(`[API] Running QC Layer 2 (Instructional Quality) for "${lessonTitle || lessonId}"...`);
    const qc2Report = await qcLayer2Service.auditInstructionalQuality({
      lessonTitle,
      learningObjective,
      lessonContent,
      targetDurationMinutes: 45,
      apiKey: apiKey || process.env.GEMINI_API_KEY
    });

    // If lessonId exists in storage, update record
    if (lessonId) {
      const existing = loadLessonData(lessonId);
      if (existing) {
        existing.qc2Report = qc2Report;
        saveLessonData(lessonId, existing);
      }
    }

    res.json({ success: true, qc2Report });
  } catch (err) {
    console.error('[API] QC2 audit error:', err);
    res.status(500).json({ error: err.message || 'QC Layer 2 audit failed.' });
  }
});

// Full automated pipeline: Research -> Synthesize -> QC1 -> QC2
app.post('/api/lesson/full-pipeline', async (req, res) => {
  try {
    const { lessonTitle, learningObjective, apiKey } = req.body;
    if (!lessonTitle || !lessonTitle.trim()) {
      return res.status(400).json({ error: 'Lesson Title is required.' });
    }
    if (!learningObjective || !learningObjective.trim()) {
      return res.status(400).json({ error: 'Learning Objective is required.' });
    }

    const lessonId = `lesson_${Date.now()}`;
    console.log(`[API] Running full end-to-end pipeline for: "${lessonTitle}"`);

    // 1. Research
    const researchBundle = await researchService.conductResearch({
      lessonTitle: lessonTitle.trim(),
      learningObjective: learningObjective.trim(),
      apiKey: apiKey || process.env.GEMINI_API_KEY
    });

    // 2. Synthesize
    const lessonContent = await synthesisService.synthesizeLesson({
      lessonTitle: lessonTitle.trim(),
      learningObjective: learningObjective.trim(),
      researchBundle,
      targetDurationMinutes: 45,
      apiKey: apiKey || process.env.GEMINI_API_KEY
    });

    // 3. QC Layer 1 (Factual Accuracy)
    const qc1Report = await qcLayer1Service.auditFactualAccuracy({
      lessonTitle: lessonTitle.trim(),
      learningObjective: learningObjective.trim(),
      lessonContent,
      researchBundle,
      apiKey: apiKey || process.env.GEMINI_API_KEY
    });

    // 4. QC Layer 2 (Instructional Quality)
    const qc2Report = await qcLayer2Service.auditInstructionalQuality({
      lessonTitle: lessonTitle.trim(),
      learningObjective: learningObjective.trim(),
      lessonContent,
      targetDurationMinutes: 45,
      apiKey: apiKey || process.env.GEMINI_API_KEY
    });

    const fullRecord = {
      id: lessonId,
      lessonTitle: lessonTitle.trim(),
      learningObjective: learningObjective.trim(),
      researchBundle,
      lessonContent,
      qc1Report,
      qc2Report,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveLessonData(lessonId, fullRecord);

    res.json({ success: true, lesson: fullRecord });
  } catch (err) {
    console.error('[API] Full pipeline error:', err);
    res.status(500).json({ error: err.message || 'Pipeline execution failed.' });
  }
});

// Apply QC Recommendations into the lesson content
app.post('/api/lesson/apply-qc', async (req, res) => {
  try {
    const { lessonId, lessonContent, appliedFixes, layer } = req.body;
    if (!lessonContent) {
      return res.status(400).json({ error: 'Lesson content is required.' });
    }
    if (!appliedFixes || !Array.isArray(appliedFixes) || appliedFixes.length === 0) {
      return res.status(400).json({ error: 'No fixes provided to apply.' });
    }

    console.log(`[API] Applying ${appliedFixes.length} QC fix(es) from layer ${layer || 'combined'}...`);
    const updatedContent = synthesisService.applyQCFixes(lessonContent, appliedFixes);

    if (lessonId) {
      const existing = loadLessonData(lessonId);
      if (existing) {
        existing.lessonContent = updatedContent;
        // Mark applied fixes in the reports
        if (existing.qc1Report && existing.qc1Report.issues) {
          existing.qc1Report.issues.forEach(issue => {
            if (appliedFixes.some(f => f.id === issue.id)) issue.applied = true;
          });
        }
        if (existing.qc2Report && existing.qc2Report.issues) {
          existing.qc2Report.issues.forEach(issue => {
            if (appliedFixes.some(f => f.id === issue.id)) issue.applied = true;
          });
        }
        saveLessonData(lessonId, existing);
      }
    }

    res.json({ success: true, updatedContent });
  } catch (err) {
    console.error('[API] Apply QC error:', err);
    res.status(500).json({ error: err.message || 'Failed to apply QC improvements.' });
  }
});

// Save instructor edits manually
app.post('/api/lesson/save', (req, res) => {
  try {
    const { id, lessonTitle, learningObjective, lessonContent, researchBundle, qc1Report, qc2Report } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Lesson ID is required to save.' });
    }

    const lessonData = {
      id,
      lessonTitle,
      learningObjective,
      lessonContent,
      researchBundle,
      qc1Report,
      qc2Report
    };

    saveLessonData(id, lessonData);
    res.json({ success: true, message: 'Lesson saved successfully.', lesson: lessonData });
  } catch (err) {
    console.error('[API] Save error:', err);
    res.status(500).json({ error: err.message || 'Failed to save lesson.' });
  }
});

// Load a saved lesson by ID
app.get('/api/lesson/:id', (req, res) => {
  const lesson = loadLessonData(req.params.id);
  if (!lesson) {
    return res.status(400).json({ error: 'Lesson not found.' });
  }
  res.json({ success: true, lesson });
});

// Delete a saved lesson by ID (supports /api/lesson/:id and /api/lessons/:id)
const deleteLessonHandler = (req, res) => {
  try {
    const { id } = req.params;
    let filePath = path.join(STORAGE_DIR, `${id}.json`);

    // Check direct path or find file where data.id matches
    if (!fs.existsSync(filePath)) {
      const files = fs.readdirSync(STORAGE_DIR).filter(f => f.endsWith('.json'));
      const matchingFile = files.find(f => {
        try {
          const d = JSON.parse(fs.readFileSync(path.join(STORAGE_DIR, f), 'utf-8'));
          return d.id === id;
        } catch (e) {
          return false;
        }
      });
      if (matchingFile) {
        filePath = path.join(STORAGE_DIR, matchingFile);
      }
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[API] Deleted saved lesson: ${id} (${path.basename(filePath)})`);
      return res.json({ success: true, message: 'Lesson deleted successfully.' });
    }
    return res.status(404).json({ error: 'Lesson not found.' });
  } catch (err) {
    console.error('[API] Delete error:', err);
    res.status(500).json({ error: 'Failed to delete lesson.' });
  }
};

app.delete('/api/lesson/:id', deleteLessonHandler);
app.delete('/api/lessons/:id', deleteLessonHandler);

// List all saved lessons
app.get('/api/lessons', (req, res) => {
  try {
    const files = fs.readdirSync(STORAGE_DIR).filter(f => f.endsWith('.json'));
    const lessons = files.map(f => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(STORAGE_DIR, f), 'utf-8'));
        return {
          id: data.id,
          lessonTitle: data.lessonTitle,
          learningObjective: data.learningObjective,
          updatedAt: data.updatedAt,
          createdAt: data.createdAt,
          hasQC1: Boolean(data.qc1Report),
          hasQC2: Boolean(data.qc2Report),
          qc1Score: data.qc1Report ? data.qc1Report.overallScore : null,
          qc2Score: data.qc2Report ? data.qc2Report.overallScore : null
        };
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    res.json({ success: true, lessons });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list saved lessons.' });
  }
});

// Export endpoints (exclusively provides complete lesson)
app.post('/api/lesson/export/:format', (req, res) => {
  try {
    const { format } = req.params;
    const { lesson } = req.body;

    if (!lesson) {
      return res.status(400).json({ error: 'Lesson data required for export.' });
    }

    if (format === 'markdown') {
      const markdown = exportService.toMarkdown(lesson);
      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', `attachment; filename="${lesson.lessonTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_lesson.md"`);
      return res.send(markdown);
    } else if (format === 'html') {
      const html = exportService.toHTML(lesson);
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="${lesson.lessonTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_lesson.html"`);
      return res.send(html);
    } else if (format === 'json') {
      const lessonJson = exportService.toJSON(lesson);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${lesson.lessonTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_lesson.json"`);
      return res.json(lessonJson);
    } else {
      return res.status(400).json({ error: `Unsupported export format: ${format}` });
    }
  } catch (err) {
    console.error('[API] Export error:', err);
    res.status(500).json({ error: err.message || 'Export failed.' });
  }
});

// Always return JSON for unmatched /api routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.originalUrl} not found.` });
});

// Serve frontend in production or when client is built
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
  });
}

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AI Lesson Creation Server is running on port ${PORT}`);
  console.log(`   API Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

// Ensure process stays active indefinitely for background daemon execution
setInterval(() => {}, 60000);
