/**
 * Export Service
 * Formats the finalized, complete lesson into:
 * 1. Clean Complete Lesson Markdown (.md)
 * 2. Self-Contained Beautiful Complete Lesson HTML (.html) with print/PDF styling
 * 3. Structured Complete Lesson JSON (.json)
 *
 * Exclusively exports the complete educational lesson (timing, sections, lab activities,
 * knowledge checks, supplementary video masterclasses, and authoritative citations).
 */

class ExportService {
  toMarkdown(lesson) {
    const { lessonTitle, learningObjective, lessonContent, updatedAt } = lesson;
    const content = lessonContent || {};

    let md = `# ${lessonTitle}\n\n`;
    md += `**Target Duration**: ${content.targetDurationMinutes || 45} Minutes | **Level**: ${content.level || 'Intermediate'}\n`;
    md += `**Exported**: ${new Date(updatedAt || Date.now()).toLocaleDateString()}\n\n`;
    md += `## 🎯 Learning Objective\n> ${learningObjective}\n\n`;

    // Pacing Breakdown Table
    if (content.pacingBreakdown && content.pacingBreakdown.length > 0) {
      md += `## ⏱️ 45-Minute Lesson Pacing Breakdown\n\n`;
      md += `| Phase / Activity | Time Window | Duration | Description |\n`;
      md += `| :--- | :--- | :--- | :--- |\n`;
      content.pacingBreakdown.forEach(p => {
        md += `| **${p.phase}** | \`${p.timeWindow || '-'}\` | ${p.durationMinutes} min | ${p.description} |\n`;
      });
      md += `\n`;
    }

    // Sections
    if (content.sections && content.sections.length > 0) {
      md += `## 📚 Lesson Content\n\n`;
      content.sections.forEach(sec => {
        md += `### ${sec.title}\n\n`;
        md += `${sec.content}\n\n`;
        md += `---\n\n`;
      });
    }

    // Hands-on Activity
    if (content.handsOnActivity) {
      const act = content.handsOnActivity;
      md += `## 🛠️ Hands-on Practical Lab: ${act.title} (${act.estimatedMinutes || 10} Min)\n\n`;
      md += `**Scenario**: ${act.scenario}\n\n`;
      md += `**Tasks**:\n`;
      (act.tasks || []).forEach((t, i) => {
        md += `${i + 1}. ${t}\n`;
      });
      md += `\n**Expected Outcome**: ${act.expectedOutcome}\n\n`;
      if (act.solutionHints) {
        md += `*Instructor Solution Guidance*: ${act.solutionHints}\n\n`;
      }
      md += `---\n\n`;
    }

    // Knowledge Checks
    if (content.knowledgeChecks && content.knowledgeChecks.length > 0) {
      md += `## 🧠 Knowledge Checks & Formative Assessment\n\n`;
      content.knowledgeChecks.forEach((qc, i) => {
        md += `**Question ${i + 1}**: ${qc.question}\n\n`;
        qc.options.forEach((opt, idx) => {
          const isCorrect = idx === qc.correctIndex;
          md += `- [${isCorrect ? 'x' : ' '}] **Option ${String.fromCharCode(65 + idx)}**: ${opt}${isCorrect ? ' *(Correct Answer)*' : ''}\n`;
        });
        md += `\n*Explanation*: ${qc.explanation}\n\n`;
      });
      md += `---\n\n`;
    }

    // Supplementary YouTube Videos
    if (content.videoResources && content.videoResources.length > 0) {
      md += `## 📺 Supplementary Video Masterclasses\n\n`;
      content.videoResources.forEach(v => {
        md += `### [${v.title}](${v.url})\n`;
        md += `- **Channel**: ${v.channel} | **Duration**: ${v.duration}\n`;
        md += `- **Overview**: ${v.description}\n`;
        if (v.timestamps && v.timestamps.length > 0) {
          md += `- **Key Timestamps**:\n`;
          v.timestamps.forEach(ts => {
            md += `  - \`${ts.time}\`: ${ts.topic}\n`;
          });
        }
        md += `\n`;
      });
      md += `---\n\n`;
    }

    // References
    if (content.references && content.references.length > 0) {
      md += `## 📖 Authoritative References & Academic Citations\n\n`;
      content.references.forEach((ref, idx) => {
        const typeLabel = ref.type ? `[${ref.type}] ` : '';
        const authorStr = ref.authors ? ` by ${Array.isArray(ref.authors) ? ref.authors.join(', ') : ref.authors}` : '';
        const pubStr = ref.publisher ? ` (${ref.publisher}${ref.year ? `, ${ref.year}` : ''})` : '';
        md += `${idx + 1}. **${typeLabel}${ref.title}**${authorStr}${pubStr}\n`;
        if (ref.url) md += `   - URL: [${ref.url}](${ref.url})\n`;
        if (ref.relevantChapters) md += `   - Relevant Chapters: ${ref.relevantChapters}\n`;
        if (ref.keyInsight) md += `   - Key Insight: *${ref.keyInsight}*\n`;
        md += `\n`;
      });
    }

    return md;
  }

  toHTML(lesson) {
    const mdContent = this.toMarkdown(lesson);
    const escapedTitle = (lesson.lessonTitle || 'Lesson').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTitle} - Complete 45-Minute Lesson</title>
  <style>
    :root {
      --primary: #ffb606;
      --primary-dark: #d97706;
      --text: #1a1e28;
      --text-muted: #64748b;
      --bg: #f8fafc;
      --surface: #ffffff;
      --border: #e2e8f0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.65;
      color: var(--text);
      background-color: var(--bg);
      margin: 0;
      padding: 40px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: var(--surface);
      padding: 48px;
      border-radius: 8px;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--border);
    }
    h1 { font-size: 2.2rem; font-weight: 800; color: #111827; margin-top: 0; border-bottom: 4px solid var(--primary); padding-bottom: 16px; }
    h2 { font-size: 1.45rem; font-weight: 800; color: #1f2937; margin-top: 36px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
    h3 { font-size: 1.2rem; font-weight: 700; color: #374151; margin-top: 24px; }
    h4 { font-size: 1rem; font-weight: 700; color: #4b5563; }
    blockquote {
      background: #fff8e6;
      border-left: 4px solid var(--primary);
      margin: 16px 0;
      padding: 12px 20px;
      border-radius: 0 6px 6px 0;
      font-style: italic;
      color: #8a5a00;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 0.92rem;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 10px 14px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #334155;
    }
    pre {
      background: #18191d;
      color: #f8fafc;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.88rem;
    }
    code {
      background: #f1f5f9;
      color: #925f00;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.88em;
    }
    pre code { background: none; color: inherit; padding: 0; }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 0.78rem;
      font-weight: 700;
      border-radius: 4px;
      background: #fff8e6;
      color: #8a5a00;
      border: 1px solid #fed56b;
      margin-right: 8px;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; padding: 0; border: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div style="margin-bottom: 20px;">
      <span class="badge">45-Minute Lesson Plan</span>
      <span class="badge" style="background:#18191d; color:#ffffff; border:none;">Complete Lesson</span>
    </div>
    <div id="content">
      <pre style="white-space: pre-wrap; font-family: inherit; background: transparent; color: inherit; padding: 0; border: none;">${mdContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')}</pre>
    </div>
  </div>
</body>
</html>`;
  }

  toJSON(lesson) {
    // Only return the complete lesson without internal QC reports
    return {
      id: lesson.id,
      lessonTitle: lesson.lessonTitle,
      learningObjective: lesson.learningObjective,
      targetDurationMinutes: lesson.lessonContent?.targetDurationMinutes || 45,
      level: lesson.lessonContent?.level || 'Intermediate',
      pacingBreakdown: lesson.lessonContent?.pacingBreakdown || [],
      sections: lesson.lessonContent?.sections || [],
      handsOnActivity: lesson.lessonContent?.handsOnActivity || null,
      knowledgeChecks: lesson.lessonContent?.knowledgeChecks || [],
      videoResources: lesson.lessonContent?.videoResources || [],
      references: lesson.lessonContent?.references || [],
      exportedAt: new Date().toISOString()
    };
  }
}

const exportService = new ExportService();
module.exports = { exportService };
