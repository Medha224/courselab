import React from 'react';
import { Sparkles, Search, RotateCcw, Check, BookOpen, Layers, Award, PenTool } from 'lucide-react';

const PRESETS = [
  {
    id: 'sample1',
    label: 'Sample 1: HTTP Requests & Responses',
    title: 'HTTP Requests and Responses',
    objective: 'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.'
  },
  {
    id: 'sample2',
    label: 'Sample 2: Binary Search Algorithms',
    title: 'Binary Search Algorithms: Divide and Conquer',
    objective: 'Explain the divide-and-conquer principle of binary search, implement the iterative and recursive variants, and analyze its O(log n) time complexity against linear search.'
  }
];

export default function InputSection({
  lessonTitle,
  setLessonTitle,
  learningObjective,
  setLearningObjective,
  onGenerateFull,
  onResearchOnly,
  onClear,
  loading
}) {
  const isSample1 = lessonTitle === PRESETS[0].title;
  const isSample2 = lessonTitle === PRESETS[1].title;
  const isCustom = !isSample1 && !isSample2;

  const handleCustomMode = () => {
    setLessonTitle('');
    setLearningObjective('');
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Educational Banner */}
      <div style={{
        background: 'linear-gradient(180deg, #18191d 0%, #22232a 100%)',
        borderRadius: '8px',
        padding: '36px 36px 30px',
        color: '#ffffff',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-md)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#ffb606',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '8px'
          }}>
            AI-Powered Curriculum Engineering
          </span>
          <h2 style={{
            fontSize: '2.1rem',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 10px',
            lineHeight: 1.2
          }}>
            Create your <span className="edu-highlight">Lesson</span> today!
          </h2>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.5 }}>
            Synthesize structured 45-minute educational lessons for <strong>any topic of your choice</strong>, backed by live literature research and validated by dual Quality Control layers.
          </p>
        </div>

        {/* 3 Academic Feature Pills */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: 'rgba(255, 182, 6, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb606' }}>
              <BookOpen size={16} />
            </div>
            <div>
              <strong style={{ fontSize: '0.82rem', display: 'block', color: '#ffffff' }}>Academic Literature</strong>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Open Library & RFC Standards</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: 'rgba(255, 182, 6, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb606' }}>
              <Layers size={16} />
            </div>
            <div>
              <strong style={{ fontSize: '0.82rem', display: 'block', color: '#ffffff' }}>45-Minute Lesson</strong>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Optimal Cognitive Pacing</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: 'rgba(255, 182, 6, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb606' }}>
              <Award size={16} />
            </div>
            <div>
              <strong style={{ fontSize: '0.82rem', display: 'block', color: '#ffffff' }}>Dual QC Layers</strong>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Factual & Instructional Audit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Creation Card */}
      <div className="edu-card">
        {/* Topic Mode Selector: Custom vs Sample Presets */}
        <div style={{
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Choose Input Mode:
            </span>
            {isCustom && (
              <span className="edu-badge edu-badge-amber" style={{ fontSize: '0.7rem' }}>
                ✍️ Custom Input Mode Active
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Custom Input Button */}
            <button
              type="button"
              onClick={handleCustomMode}
              style={{
                background: isCustom ? '#18191d' : 'var(--bg-subtle)',
                border: `1.5px solid ${isCustom ? '#18191d' : 'var(--border-light)'}`,
                color: isCustom ? '#ffffff' : 'var(--text-dark)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <PenTool size={13} color={isCustom ? '#ffb606' : '#64748b'} />
              <span>✍️ Enter Custom Topic</span>
            </button>

            {/* Presets */}
            {PRESETS.map((p) => {
              const isSelected = lessonTitle === p.title;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setLessonTitle(p.title);
                    setLearningObjective(p.objective);
                  }}
                  style={{
                    background: isSelected ? 'var(--amber-light)' : 'var(--bg-subtle)',
                    border: `1.5px solid ${isSelected ? '#ffb606' : 'var(--border-light)'}`,
                    color: isSelected ? '#8a5a00' : 'var(--text-dark)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isSelected && <Check size={13} color="#ffb606" />}
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {isCustom
              ? '💡 You can type any subject or topic below (e.g. Docker, Python Generators, Git, Machine Learning, Database Indexing).'
              : '💡 Sample preset selected. You can modify the text below or click "Enter Custom Topic" to start from scratch.'}
          </p>
        </div>

        {/* Input Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-dark)' }}>
              Lesson Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              className="edu-input"
              placeholder="e.g. Introduction to Docker Containers & Images (or any topic of your choice)"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-dark)' }}>
              Learning Objective <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              className="edu-textarea"
              placeholder="e.g. Explain container virtualization vs virtual machines, build a custom Dockerfile, and manage multi-container apps with Docker Compose."
              value={learningObjective}
              onChange={(e) => setLearningObjective(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            className="edu-btn edu-btn-outline"
            onClick={onClear}
            disabled={loading || (!lessonTitle && !learningObjective)}
            style={{ fontSize: '0.8rem', padding: '9px 16px' }}
          >
            <RotateCcw size={14} />
            <span>Clear Inputs</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="edu-btn edu-btn-outline"
              onClick={onResearchOnly}
              disabled={loading || !lessonTitle.trim() || !learningObjective.trim()}
              style={{ fontSize: '0.82rem' }}
            >
              <Search size={15} />
              <span>Research Sources Only</span>
            </button>

            <button
              type="button"
              className="edu-btn edu-btn-amber"
              onClick={onGenerateFull}
              disabled={loading || !lessonTitle.trim() || !learningObjective.trim()}
              style={{ padding: '12px 28px', fontSize: '0.88rem' }}
            >
              <Sparkles size={16} />
              <span>{loading ? 'Synthesizing Lesson...' : 'Synthesize 45-Min Lesson'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
