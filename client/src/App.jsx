import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import InputSection from './components/InputSection';
import PipelineProgress from './components/PipelineProgress';
import LessonPreview from './components/LessonPreview';
import LessonEditor from './components/LessonEditor';
import QCAuditPanel from './components/QCAuditPanel';
import ExportModal from './components/ExportModal';
import SettingsModal from './components/SettingsModal';
import SavedLessonsModal from './components/SavedLessonsModal';
import { Eye, Edit3, ShieldCheck, AlertCircle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'ai_lesson_creation_current_state';

export default function App() {
  const [lessonTitle, setLessonTitle] = useState('HTTP Requests and Responses');
  const [learningObjective, setLearningObjective] = useState(
    'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.'
  );

  const [lesson, setLesson] = useState(null);
  const [pipelineSteps, setPipelineSteps] = useState({
    research: 'pending',
    synthesis: 'pending',
    qc1: 'pending',
    qc2: 'pending'
  });

  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'editor' | 'qc'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [providerInfo, setProviderInfo] = useState(null);

  useEffect(() => {
    fetchProviderHealth();

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lesson) setLesson(parsed.lesson);
        if (parsed.lessonTitle) setLessonTitle(parsed.lessonTitle);
        if (parsed.learningObjective) setLearningObjective(parsed.learningObjective);
      }
    } catch (e) {
      console.warn('Could not restore local draft:', e);
    }
  }, []);

  useEffect(() => {
    try {
      if (lesson) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
          lesson,
          lessonTitle,
          learningObjective,
          updatedAt: new Date().toISOString()
        }));
      }
    } catch (e) {
      console.warn('Failed to auto-save to localStorage:', e);
    }
  }, [lesson, lessonTitle, learningObjective]);

  const fetchProviderHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setProviderInfo(data);
    } catch (e) {
      console.error('Failed to fetch health info:', e);
    }
  };

  const handleGenerateFull = async () => {
    if (!lessonTitle.trim() || !learningObjective.trim()) {
      setError('Please provide both a Lesson Title and a Learning Objective.');
      return;
    }

    setLoading(true);
    setError(null);
    setPipelineSteps({
      research: 'running',
      synthesis: 'pending',
      qc1: 'pending',
      qc2: 'pending'
    });

    try {
      // 1. Research Phase
      const resResearch = await fetch('/api/lesson/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonTitle, learningObjective })
      });
      const dataResearch = await resResearch.json();
      if (!resResearch.ok) throw new Error(dataResearch.error || 'Research failed');

      setPipelineSteps(prev => ({ ...prev, research: 'completed', synthesis: 'running' }));

      // 2. Synthesis Phase
      const resSynthesis = await fetch('/api/lesson/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle,
          learningObjective,
          researchBundle: dataResearch.researchBundle
        })
      });
      const dataSynthesis = await resSynthesis.json();
      if (!resSynthesis.ok) throw new Error(dataSynthesis.error || 'Synthesis failed');

      const generatedLesson = dataSynthesis.lesson;
      setLesson(generatedLesson);
      setPipelineSteps(prev => ({ ...prev, synthesis: 'completed', qc1: 'running' }));

      // 3. QC Layer 1 (Factual Accuracy)
      const resQC1 = await fetch('/api/lesson/qc1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: generatedLesson.id,
          lessonTitle,
          learningObjective,
          lessonContent: generatedLesson.lessonContent,
          researchBundle: generatedLesson.researchBundle
        })
      });
      const dataQC1 = await resQC1.json();
      if (!resQC1.ok) throw new Error(dataQC1.error || 'QC Layer 1 failed');

      setLesson(prev => ({ ...prev, qc1Report: dataQC1.qc1Report }));
      setPipelineSteps(prev => ({ ...prev, qc1: 'completed', qc2: 'running' }));

      // 4. QC Layer 2 (Instructional Quality)
      const resQC2 = await fetch('/api/lesson/qc2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: generatedLesson.id,
          lessonTitle,
          learningObjective,
          lessonContent: generatedLesson.lessonContent
        })
      });
      const dataQC2 = await resQC2.json();
      if (!resQC2.ok) throw new Error(dataQC2.error || 'QC Layer 2 failed');

      setLesson(prev => ({ ...prev, qc2Report: dataQC2.qc2Report }));
      setPipelineSteps(prev => ({ ...prev, qc2: 'completed' }));
      setActiveTab('preview');

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

    } catch (err) {
      console.error('Pipeline error:', err);
      setError(err.message || 'An error occurred during generation.');
      setPipelineSteps(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(k => {
          if (updated[k] === 'running') updated[k] = 'error';
        });
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResearchOnly = async () => {
    if (!lessonTitle.trim() || !learningObjective.trim()) {
      setError('Please provide both a Lesson Title and a Learning Objective.');
      return;
    }

    setLoading(true);
    setError(null);
    setPipelineSteps({
      research: 'running',
      synthesis: 'pending',
      qc1: 'pending',
      qc2: 'pending'
    });

    try {
      const res = await fetch('/api/lesson/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonTitle, learningObjective })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Research failed');

      setPipelineSteps(prev => ({ ...prev, research: 'completed' }));
      setLesson(prev => ({
        id: prev?.id || `lesson_${Date.now()}`,
        lessonTitle,
        learningObjective,
        researchBundle: data.researchBundle,
        lessonContent: {
          title: lessonTitle,
          learningObjective,
          targetDurationMinutes: 45,
          sections: [
            {
              id: 'sec_research_summary',
              title: 'Multi-Source Research Summary',
              duration: '5 min',
              content: data.researchBundle.summary + '\n\n**Key Facts Discovered**:\n' +
                (data.researchBundle.keyFacts || []).map(f => `- ${f}`).join('\n')
            }
          ],
          references: [...(data.researchBundle.books || []), ...(data.researchBundle.webSources || [])],
          videoResources: data.researchBundle.videos || []
        }
      }));
      setActiveTab('preview');
    } catch (err) {
      setError(err.message);
      setPipelineSteps(prev => ({ ...prev, research: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const handleRerunQC1 = async () => {
    if (!lesson?.lessonContent) return;
    setLoading(true);
    setError(null);
    setPipelineSteps(prev => ({ ...prev, qc1: 'running' }));

    try {
      const res = await fetch('/api/lesson/qc1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          lessonTitle,
          learningObjective,
          lessonContent: lesson.lessonContent,
          researchBundle: lesson.researchBundle
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'QC Layer 1 failed');

      setLesson(prev => ({ ...prev, qc1Report: data.qc1Report }));
      setPipelineSteps(prev => ({ ...prev, qc1: 'completed' }));
    } catch (err) {
      setError(err.message);
      setPipelineSteps(prev => ({ ...prev, qc1: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const handleRerunQC2 = async () => {
    if (!lesson?.lessonContent) return;
    setLoading(true);
    setError(null);
    setPipelineSteps(prev => ({ ...prev, qc2: 'running' }));

    try {
      const res = await fetch('/api/lesson/qc2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          lessonTitle,
          learningObjective,
          lessonContent: lesson.lessonContent
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'QC Layer 2 failed');

      setLesson(prev => ({ ...prev, qc2Report: data.qc2Report }));
      setPipelineSteps(prev => ({ ...prev, qc2: 'completed' }));
    } catch (err) {
      setError(err.message);
      setPipelineSteps(prev => ({ ...prev, qc2: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFix = async (fix, layer) => {
    if (!lesson?.lessonContent) return;
    setLoading(true);

    try {
      const res = await fetch('/api/lesson/apply-qc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          lessonContent: lesson.lessonContent,
          appliedFixes: [fix],
          layer
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply QC recommendation');

      setLesson(prev => {
        const updated = { ...prev, lessonContent: data.updatedContent };
        if (layer === 'layer1' && updated.qc1Report?.issues) {
          updated.qc1Report.issues = updated.qc1Report.issues.map(i =>
            i.id === fix.id ? { ...i, applied: true } : i
          );
        } else if (layer === 'layer2' && updated.qc2Report?.issues) {
          updated.qc2Report.issues = updated.qc2Report.issues.map(i =>
            i.id === fix.id ? { ...i, applied: true } : i
          );
        }
        return updated;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAllFixes = async () => {
    if (!lesson?.lessonContent) return;
    const allFixes = [
      ...(lesson.qc1Report?.issues || []).filter(i => !i.applied && (i.severity === 'HIGH' || i.severity === 'MEDIUM')),
      ...(lesson.qc2Report?.issues || []).filter(i => !i.applied && (i.severity === 'HIGH' || i.severity === 'MEDIUM'))
    ];

    if (allFixes.length === 0) {
      const remaining = [
        ...(lesson.qc1Report?.issues || []).filter(i => !i.applied),
        ...(lesson.qc2Report?.issues || []).filter(i => !i.applied)
      ];
      allFixes.push(...remaining);
    }

    if (allFixes.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/lesson/apply-qc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          lessonContent: lesson.lessonContent,
          appliedFixes: allFixes
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply fixes');

      setLesson(prev => {
        const updated = { ...prev, lessonContent: data.updatedContent };
        if (updated.qc1Report?.issues) {
          updated.qc1Report.issues = updated.qc1Report.issues.map(i => ({ ...i, applied: true }));
        }
        if (updated.qc2Report?.issues) {
          updated.qc2Report.issues = updated.qc2Report.issues.map(i => ({ ...i, applied: true }));
        }
        return updated;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdits = async (editedLesson) => {
    setLesson(editedLesson);
    try {
      await fetch('/api/lesson/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedLesson)
      });
    } catch (e) {
      console.warn('Failed to save to server:', e);
    }
  };

  const handleLoadLesson = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lesson/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load lesson');

      setLesson(data.lesson);
      setLessonTitle(data.lesson.lessonTitle);
      setLearningObjective(data.lesson.learningObjective);
      setPipelineSteps({
        research: 'completed',
        synthesis: 'completed',
        qc1: data.lesson.qc1Report ? 'completed' : 'pending',
        qc2: data.lesson.qc2Report ? 'completed' : 'pending'
      });
      setActiveTab('preview');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setLessonTitle('');
    setLearningObjective('');
    setLesson(null);
    setError(null);
    setPipelineSteps({
      research: 'pending',
      synthesis: 'pending',
      qc1: 'pending',
      qc2: 'pending'
    });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div className="edu-container">
      {/* Top Academic Header */}
      <Header
        providerInfo={providerInfo}
        onOpenSettings={() => setShowSettings(true)}
        onOpenExport={() => setShowExport(true)}
        onOpenLibrary={() => setShowLibrary(true)}
        hasLesson={Boolean(lesson?.lessonContent)}
      />

      {/* Main Creation Card */}
      <InputSection
        lessonTitle={lessonTitle}
        setLessonTitle={setLessonTitle}
        learningObjective={learningObjective}
        setLearningObjective={setLearningObjective}
        onGenerateFull={handleGenerateFull}
        onResearchOnly={handleResearchOnly}
        onClear={handleClear}
        loading={loading}
        hasLesson={Boolean(lesson?.lessonContent)}
      />

      {/* Error Message */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fef2f2',
          border: '1.5px solid #fecaca',
          borderRadius: '6px',
          padding: '12px 18px',
          marginBottom: '20px',
          color: '#991b1b',
          fontSize: '0.88rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} color="#dc2626" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            className="edu-btn edu-btn-outline"
            onClick={() => setError(null)}
            style={{ padding: '4px 10px', fontSize: '0.72rem' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Pipeline Progress Indicator */}
      {(loading || (lesson && pipelineSteps.research !== 'pending')) && (
        <PipelineProgress
          steps={pipelineSteps}
          onRetryStep={(stepId) => {
            if (stepId === 'qc1') handleRerunQC1();
            else if (stepId === 'qc2') handleRerunQC2();
            else handleGenerateFull();
          }}
        />
      )}

      {/* Lesson Content & Workspace Tabs */}
      {lesson && (
        <div style={{ marginTop: '24px' }}>
          {/* Clean Segmented Tab Control */}
          <div className="edu-tabs">
            <button
              type="button"
              className={`edu-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              <Eye size={16} />
              <span>Lesson Plan (45 Min)</span>
            </button>

            <button
              type="button"
              className={`edu-tab-btn ${activeTab === 'qc' ? 'active' : ''}`}
              onClick={() => setActiveTab('qc')}
            >
              <ShieldCheck size={16} />
              <span>Quality Control Audits</span>
              {lesson.qc1Report && lesson.qc2Report && (
                <span className="edu-tab-badge">
                  QC Verified
                </span>
              )}
            </button>

            <button
              type="button"
              className={`edu-tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
              onClick={() => setActiveTab('editor')}
            >
              <Edit3 size={16} />
              <span>Instructor Editor</span>
            </button>
          </div>

          {/* Active View */}
          {activeTab === 'preview' && <LessonPreview lesson={lesson} />}
          {activeTab === 'qc' && (
            <QCAuditPanel
              qc1Report={lesson.qc1Report}
              qc2Report={lesson.qc2Report}
              onApplyFix={handleApplyFix}
              onApplyAllFixes={handleApplyAllFixes}
              onRerunQC1={handleRerunQC1}
              onRerunQC2={handleRerunQC2}
              loading={loading}
            />
          )}
          {activeTab === 'editor' && <LessonEditor lesson={lesson} onSaveEdits={handleSaveEdits} />}
        </div>
      )}

      {/* Modals */}
      {showExport && lesson && (
        <ExportModal lesson={lesson} onClose={() => setShowExport(false)} />
      )}

      {showSettings && (
        <SettingsModal
          providerInfo={providerInfo}
          onClose={() => setShowSettings(false)}
          onRefreshConfig={fetchProviderHealth}
        />
      )}

      {showLibrary && (
        <SavedLessonsModal
          onClose={() => setShowLibrary(false)}
          onLoadLesson={handleLoadLesson}
        />
      )}
    </div>
  );
}
