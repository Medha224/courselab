import React, { useState } from 'react';
import { Sparkles, Search, RotateCcw, Check, BookOpen, Layers, Award, PenTool, ChevronDown, ChevronUp, Edit3, PlusCircle } from 'lucide-react';

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
  loading,
  hasLesson
}) {
  // When a lesson already exists, collapse the input form by default to prevent visual clutter
  const [isExpanded, setIsExpanded] = useState(!hasLesson);

  const isSample1 = lessonTitle === PRESETS[0].title;
  const isSample2 = lessonTitle === PRESETS[1].title;
  const isCustom = !isSample1 && !isSample2;

  const handleCustomMode = () => {
    setLessonTitle('');
    setLearningObjective('');
    setIsExpanded(true);
  };

  const handleNewLesson = () => {
    onClear();
    setIsExpanded(true);
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* If a lesson is active and inputs are collapsed, show a sleek compact control bar */}
      {hasLesson && !isExpanded && (
        <div className="edu-card" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '14px 22px',
          background: '#ffffff',
          borderLeft: '4px solid #ffb606'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
            <span className="edu-badge edu-badge-amber" style={{ fontSize: '0.72rem' }}>
              📚 Active Lesson
            </span>
            <div>
              <strong style={{ fontSize: '0.96rem', color: 'var(--text-dark)', display: 'block' }}>
                {lessonTitle || 'Untitled Lesson'}
              </strong>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '520px' }}>
                {learningObjective}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="edu-btn edu-btn-outline"
              onClick={() => setIsExpanded(true)}
              style={{ fontSize: '0.78rem', padding: '7px 14px' }}
            >
              <Edit3 size={13} />
              <span>Edit Topic & Inputs ▾</span>
            </button>
            <button
              type="button"
              className="edu-btn edu-btn-dark"
              onClick={handleNewLesson}
              style={{ fontSize: '0.78rem', padding: '7px 14px' }}
            >
              <PlusCircle size={13} />
              <span>New Lesson</span>
            </button>
          </div>
        </div>
      )}

      {/* Full Input Form (Shown when expanded or when no lesson exists yet) */}
      {(!hasLesson || isExpanded) && (
        <div>
          {/* Academic Banner (Inspired by Colorlib Course Template) */}
          <div style={{
            background: 'linear-gradient(180deg, #18191d 0%, #22232a 100%)',
            borderRadius: '8px',
            padding: '30px 32px 24px',
            color: '#ffffff',
            marginBottom: '16px',
            boxShadow: 'var(--shadow-md)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ maxWidth: '720px' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#ffb606',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  AI-Powered Curriculum Engineering
                </span>
                <h2 style={{
                  fontSize: '1.9rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: '0 0 8px',
                  lineHeight: 1.2
                }}>
                  Create your <span className="edu-highlight">Lesson</span> today!
                </h2>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Synthesize structured 45-minute educational lessons for <strong>any custom topic</strong>, backed by live literature research and dual Quality Control layers.
                </p>
              </div>

              {hasLesson && (
                <button
                  type="button"
                  className="edu-btn edu-btn-outline"
                  onClick={() => setIsExpanded(false)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    padding: '6px 14px'
                  }}
                >
                  <ChevronUp size={14} />
                  <span>Hide Inputs ▴</span>
                </button>
              )}
            </div>

            {/* 3 Academic Feature Pills */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginTop: '18px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '4px', background: 'rgba(255, 182, 6, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb606' }}>
                  <BookOpen size={15} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.8rem', display: 'block', color: '#ffffff' }}>Academic Literature</strong>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Open Library & RFC Standards</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '4px', background: 'rgba(255, 182, 6, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb606' }}>
                  <Layers size={15} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.8rem', display: 'block', color: '#ffffff' }}>45-Minute Lesson</strong>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Optimal Cognitive Pacing</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '4px', background: 'rgba(255, 182, 6, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb606' }}>
                  <Award size={15} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.8rem', display: 'block', color: '#ffffff' }}>Dual QC Layers</strong>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Factual & Instructional Audit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Creation Card */}
          <div className="edu-card">
            {/* Topic Mode Selector: Custom vs Sample Presets */}
            <div style={{
              marginBottom: '18px',
              paddingBottom: '14px',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
                  ? '💡 Custom topic mode active. You can type any subject or topic below (e.g. Docker, Python Generators, Git, Machine Learning).'
                  : '💡 Sample preset selected. You can modify the text below or click "Enter Custom Topic" to start from scratch.'}
              </p>
            </div>

            {/* Input Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-dark)' }}>
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
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-dark)' }}>
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
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="edu-btn edu-btn-outline"
                  onClick={onClear}
                  disabled={loading || (!lessonTitle && !learningObjective)}
                  style={{ fontSize: '0.78rem', padding: '8px 14px' }}
                >
                  <RotateCcw size={13} />
                  <span>Clear</span>
                </button>

                {hasLesson && (
                  <button
                    type="button"
                    className="edu-btn edu-btn-outline"
                    onClick={() => setIsExpanded(false)}
                    style={{ fontSize: '0.78rem', padding: '8px 14px' }}
                  >
                    <ChevronUp size={13} />
                    <span>Hide Inputs</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="edu-btn edu-btn-outline"
                  onClick={onResearchOnly}
                  disabled={loading || !lessonTitle.trim() || !learningObjective.trim()}
                  style={{ fontSize: '0.8rem', padding: '10px 18px' }}
                >
                  <Search size={14} />
                  <span>Research Sources Only</span>
                </button>

                <button
                  type="button"
                  className="edu-btn edu-btn-amber"
                  onClick={() => {
                    onGenerateFull();
                    setIsExpanded(false);
                  }}
                  disabled={loading || !lessonTitle.trim() || !learningObjective.trim()}
                  style={{ padding: '11px 26px', fontSize: '0.86rem' }}
                >
                  <Sparkles size={15} />
                  <span>{loading ? 'Synthesizing Lesson...' : 'Synthesize 45-Min Lesson'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
