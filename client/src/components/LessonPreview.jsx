import React, { useState } from 'react';
import {
  Clock,
  Target,
  Users,
  Code2,
  Check,
  HelpCircle,
  Video,
  Book,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  ChevronsUpDown,
  ListOrdered
} from 'lucide-react';

export default function LessonPreview({ lesson }) {
  // Track open/collapsed state for sections (Section 0 open by default for immediate preview)
  const [openSections, setOpenSections] = useState({ 0: true });
  const [showPacing, setShowPacing] = useState(false);
  const [showLab, setShowLab] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [showLabHint, setShowLabHint] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  if (!lesson || !lesson.lessonContent) {
    return null;
  }

  const { lessonTitle, learningObjective, lessonContent } = lesson;
  const content = lessonContent;
  const sections = content.sections || [];

  const toggleSection = (idx) => {
    setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleExpandAll = () => {
    const allOpen = {};
    sections.forEach((_, idx) => { allOpen[idx] = true; });
    setOpenSections(allOpen);
    setShowPacing(true);
    setShowLab(true);
    setShowQuiz(true);
    setShowVideos(true);
    setShowReferences(true);
  };

  const handleCollapseAll = () => {
    setOpenSections({});
    setShowPacing(false);
    setShowLab(false);
    setShowQuiz(false);
    setShowVideos(false);
    setShowReferences(false);
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Lesson Header Banner */}
      <div className="edu-card" style={{ borderLeft: '5px solid #ffb606', padding: '28px 32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          <span className="edu-badge edu-badge-amber">
            <Clock size={12} /> {content.targetDurationMinutes || 45} Minutes Total
          </span>
          <span className="edu-badge edu-badge-dark">
            <Award size={12} /> {content.level || 'Intermediate'}
          </span>
          <span className="edu-badge edu-badge-blue">
            <Users size={12} /> Self-Learning & Teaching
          </span>
        </div>

        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '14px', lineHeight: 1.25 }}>
          {lessonTitle}
        </h1>

        <div style={{
          background: 'var(--amber-light)',
          border: '1px solid var(--amber-border)',
          padding: '14px 18px',
          borderRadius: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Target size={15} color="#925f00" />
            <strong style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#925f00', letterSpacing: '0.05em' }}>
              Target Learning Objective
            </strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.92rem', color: '#452b00', lineHeight: 1.5, fontWeight: 500 }}>
            {learningObjective}
          </p>
        </div>
      </div>

      {/* Control Bar: Expand/Collapse All & Section Navigator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: '8px',
        padding: '12px 20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Lesson Outline:
          </span>
          <span className="edu-badge edu-badge-amber" style={{ fontSize: '0.7rem' }}>
            {sections.length} Core Sections
          </span>
          <span className="edu-badge edu-badge-dark" style={{ fontSize: '0.7rem' }}>
            1 Hands-on Lab
          </span>
          <span className="edu-badge edu-badge-blue" style={{ fontSize: '0.7rem' }}>
            {content.knowledgeChecks?.length || 3} Quizzes
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="edu-btn edu-btn-outline"
            onClick={handleExpandAll}
            style={{ fontSize: '0.75rem', padding: '6px 14px' }}
          >
            <ChevronsUpDown size={13} />
            <span>Expand All</span>
          </button>
          <button
            type="button"
            className="edu-btn edu-btn-outline"
            onClick={handleCollapseAll}
            style={{ fontSize: '0.75rem', padding: '6px 14px' }}
          >
            <span>Collapse All</span>
          </button>
        </div>
      </div>

      {/* 45-Minute Lesson Pacing Agenda (Collapsible) */}
      {content.pacingBreakdown && content.pacingBreakdown.length > 0 && (
        <div className="edu-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: 'var(--amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#925f00' }}>
                <Clock size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                  45-Minute Pedagogical Timing Plan
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Pacing breakdown across 6 instructional phases
                </span>
              </div>
            </div>

            <button
              type="button"
              className="edu-btn edu-btn-outline"
              onClick={() => setShowPacing(!showPacing)}
              style={{ fontSize: '0.75rem', padding: '6px 14px' }}
            >
              <span>{showPacing ? 'Hide Timing Plan ▴' : 'View Timing Plan ▾'}</span>
            </button>
          </div>

          {showPacing && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              {content.pacingBreakdown.map((phase, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '6px',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#925f00', fontFamily: 'var(--font-heading)' }}>
                      {phase.timeWindow || `Phase ${idx + 1}`}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {phase.durationMinutes} min
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-dark)' }}>
                    {phase.phase}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {phase.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Structured Lesson Sections (Accordion Cards with Buttons) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {sections.map((section, idx) => {
          const isOpen = Boolean(openSections[idx]);
          // Short snippet for preview when collapsed
          const previewSnippet = section.content
            ? section.content.replace(/[#*`>]/g, '').slice(0, 110).trim() + '...'
            : '';

          return (
            <div
              key={section.id || idx}
              className="edu-card"
              style={{
                padding: '20px 24px',
                borderLeft: isOpen ? '4px solid #ffb606' : '1px solid var(--border-light)',
                transition: 'border 0.2s ease'
              }}
            >
              {/* Collapsible Section Header with Action Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    background: isOpen ? '#18191d' : 'var(--bg-subtle)',
                    color: isOpen ? '#ffb606' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: '0 0 2px', color: 'var(--text-dark)' }}>
                      {section.title}
                    </h3>
                    {!isOpen && (
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {previewSnippet}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {section.duration && (
                    <span className="edu-badge edu-badge-amber">
                      <Clock size={11} /> {section.duration}
                    </span>
                  )}
                  <button
                    type="button"
                    className="edu-btn edu-btn-outline"
                    onClick={() => toggleSection(idx)}
                    style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                  >
                    <span>{isOpen ? 'Close ▴' : 'Read Section ▾'}</span>
                  </button>
                </div>
              </div>

              {/* Expanded Section Body */}
              {isOpen && (
                <div style={{
                  marginTop: '18px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-light)',
                  fontSize: '0.94rem',
                  lineHeight: 1.7,
                  color: 'var(--text-body)'
                }}>
                  {renderMarkdownContent(section.content)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hands-on Practical Lab (Collapsible) */}
      {content.handsOnActivity && (
        <div className="edu-card" style={{ border: '1.5px solid #ffb606', background: '#fffdfa', padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '4px', background: '#ffb606', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--charcoal-dark)' }}>
                <Code2 size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                    Hands-on Lab: {content.handsOnActivity.title}
                  </h3>
                  <span className="edu-badge edu-badge-dark" style={{ fontSize: '0.65rem' }}>
                    {content.handsOnActivity.estimatedMinutes || 10} Min
                  </span>
                </div>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Interactive scenario problem solving
                </p>
              </div>
            </div>

            <button
              type="button"
              className="edu-btn edu-btn-outline"
              onClick={() => setShowLab(!showLab)}
              style={{ fontSize: '0.75rem', padding: '6px 14px' }}
            >
              <span>{showLab ? 'Hide Lab ▴' : 'Open Lab ▾'}</span>
            </button>
          </div>

          {showLab && (
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', marginBottom: '14px', fontWeight: 500 }}>
                <strong>Scenario:</strong> {content.handsOnActivity.scenario}
              </p>

              <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '6px', marginBottom: '14px', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                  Your Guided Tasks:
                </span>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(content.handsOnActivity.tasks || []).map((task, i) => (
                    <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-body)' }}>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '0.84rem', color: '#065f46', fontWeight: 600 }}>
                  Expected Outcome: {content.handsOnActivity.expectedOutcome}
                </span>
                {content.handsOnActivity.solutionHints && (
                  <button
                    type="button"
                    className="edu-btn edu-btn-outline"
                    style={{ fontSize: '0.72rem', padding: '5px 12px' }}
                    onClick={() => setShowLabHint(!showLabHint)}
                  >
                    <span>{showLabHint ? 'Hide Instructor Notes ▴' : 'Reveal Instructor Notes ▾'}</span>
                  </button>
                )}
              </div>

              {showLabHint && content.handsOnActivity.solutionHints && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px 16px',
                  background: 'var(--amber-light)',
                  border: '1px solid var(--amber-border)',
                  borderRadius: '6px',
                  fontSize: '0.84rem',
                  color: '#8a5a00'
                }}>
                  <strong>Instructor Solution Notes:</strong> {content.handsOnActivity.solutionHints}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Formative Knowledge Checks (Collapsible) */}
      {content.knowledgeChecks && content.knowledgeChecks.length > 0 && (
        <div className="edu-card" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '4px', background: 'var(--amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#925f00' }}>
                <HelpCircle size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                  Knowledge Checks ({content.knowledgeChecks.length} Active Recall Quizzes)
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Interactive scenario evaluations with instant reasoning feedback
                </span>
              </div>
            </div>

            <button
              type="button"
              className="edu-btn edu-btn-outline"
              onClick={() => setShowQuiz(!showQuiz)}
              style={{ fontSize: '0.75rem', padding: '6px 14px' }}
            >
              <span>{showQuiz ? 'Hide Quizzes ▴' : 'Open Quizzes ▾'}</span>
            </button>
          </div>

          {showQuiz && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
              {content.knowledgeChecks.map((qc, qIdx) => {
                const selected = selectedAnswers[qc.id];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === qc.correctIndex;

                return (
                  <div
                    key={qc.id || qIdx}
                    style={{
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '6px',
                      padding: '16px'
                    }}
                  >
                    <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '10px' }}>
                      Question {qIdx + 1}: {qc.question}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {qc.options.map((opt, optIdx) => {
                        let btnBg = '#ffffff';
                        let btnBorder = '1px solid var(--border-light)';
                        let btnColor = 'var(--text-dark)';

                        if (isAnswered) {
                          if (optIdx === qc.correctIndex) {
                            btnBg = '#ecfdf5';
                            btnBorder = '1.5px solid #10b981';
                            btnColor = '#065f46';
                          } else if (optIdx === selected) {
                            btnBg = '#fef2f2';
                            btnBorder = '1.5px solid #ef4444';
                            btnColor = '#991b1b';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(qc.id, optIdx)}
                            style={{
                              textAlign: 'left',
                              padding: '9px 12px',
                              background: btnBg,
                              border: btnBorder,
                              color: btnColor,
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span><strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}</span>
                            {isAnswered && optIdx === qc.correctIndex && (
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>✓ Correct</span>
                            )}
                            {isAnswered && optIdx === selected && optIdx !== qc.correctIndex && (
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#dc2626' }}>✗ Incorrect</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div style={{
                        marginTop: '10px',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        background: isCorrect ? '#ecfdf5' : '#eff6ff',
                        border: `1px solid ${isCorrect ? '#a7f3d0' : '#bfdbfe'}`,
                        fontSize: '0.82rem',
                        color: isCorrect ? '#065f46' : '#1e40af',
                        lineHeight: 1.45
                      }}>
                        <strong>Explanation:</strong> {qc.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Supplementary YouTube Videos (Collapsible) */}
      {content.videoResources && content.videoResources.length > 0 && (
        <div className="edu-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '4px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                <Video size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                  Curated Video Masterclasses ({content.videoResources.length})
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Supplementary YouTube video lessons with timestamped chapter guides
                </span>
              </div>
            </div>

            <button
              type="button"
              className="edu-btn edu-btn-outline"
              onClick={() => setShowVideos(!showVideos)}
              style={{ fontSize: '0.75rem', padding: '6px 14px' }}
            >
              <span>{showVideos ? 'Hide Videos ▴' : 'View Videos ▾'}</span>
            </button>
          </div>

          {showVideos && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
              {content.videoResources.map((video, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '6px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="edu-badge edu-badge-amber" style={{ fontSize: '0.65rem' }}>
                        {video.channel}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        ⏱️ {video.duration}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-dark)' }}>
                      {video.title}
                    </h4>
                    <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: 1.4 }}>
                      {video.description}
                    </p>

                    {video.timestamps && video.timestamps.length > 0 && (
                      <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '4px', marginBottom: '12px', border: '1px solid var(--border-light)' }}>
                        <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                          Timestamps:
                        </span>
                        {video.timestamps.map((ts, tIdx) => (
                          <div key={tIdx} style={{ fontSize: '0.72rem', color: 'var(--text-body)', display: 'flex', gap: '6px' }}>
                            <code style={{ color: '#925f00' }}>{ts.time}</code>
                            <span>{ts.topic}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="edu-btn edu-btn-outline"
                    style={{ fontSize: '0.75rem', padding: '8px 12px', width: '100%' }}
                  >
                    <ExternalLink size={13} />
                    <span>Watch Video</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Authoritative References (Collapsible) */}
      {content.references && content.references.length > 0 && (
        <div className="edu-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '4px', background: 'var(--amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#925f00' }}>
                <Book size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                  Authoritative References & Academic Citations ({content.references.length})
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Canonical specifications and peer-reviewed textbooks
                </span>
              </div>
            </div>

            <button
              type="button"
              className="edu-btn edu-btn-outline"
              onClick={() => setShowReferences(!showReferences)}
              style={{ fontSize: '0.75rem', padding: '6px 14px' }}
            >
              <span>{showReferences ? 'Hide Citations ▴' : 'View Citations ▾'}</span>
            </button>
          </div>

          {showReferences && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
              {content.references.map((ref, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span className="edu-badge edu-badge-dark" style={{ fontSize: '0.62rem' }}>
                        {ref.type || 'Source'}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-dark)' }}>
                        {ref.title}
                      </strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {ref.authors && `By ${Array.isArray(ref.authors) ? ref.authors.join(', ') : ref.authors} • `}
                      {ref.publisher} {ref.year ? `(${ref.year})` : ''}
                      {ref.isbn && ` • ISBN: ${ref.isbn}`}
                    </p>
                  </div>

                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="edu-btn edu-btn-outline"
                      style={{ padding: '6px 10px', fontSize: '0.72rem', flexShrink: 0 }}
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Markdown parser
function renderMarkdownContent(text) {
  if (!text) return null;
  const blocks = text.split('\n\n');

  return blocks.map((block, i) => {
    block = block.trim();
    if (!block) return null;

    if (block.startsWith('### ')) {
      return <h4 key={i} style={{ fontSize: '1.02rem', fontWeight: 800, margin: '16px 0 6px', color: 'var(--text-dark)' }}>{block.replace('### ', '')}</h4>;
    }
    if (block.startsWith('#### ')) {
      return <h5 key={i} style={{ fontSize: '0.92rem', fontWeight: 700, margin: '12px 0 4px', color: 'var(--text-dark)' }}>{block.replace('#### ', '')}</h5>;
    }

    if (block.startsWith('```')) {
      const lines = block.split('\n');
      const code = lines.slice(1, -1).join('\n');
      return (
        <pre key={i}>
          <code>{code}</code>
        </pre>
      );
    }

    if (block.startsWith('> ')) {
      return (
        <blockquote key={i} style={{
          background: 'var(--amber-light)',
          borderLeft: '4px solid #ffb606',
          padding: '10px 16px',
          borderRadius: '0 6px 6px 0',
          margin: '12px 0',
          color: '#8a5a00',
          fontStyle: 'italic',
          fontSize: '0.88rem'
        }}>
          {block.replace(/^>\s*/gm, '')}
        </blockquote>
      );
    }

    if (block.includes('|') && block.includes('\n|')) {
      const rows = block.split('\n').filter(r => r.trim().startsWith('|'));
      if (rows.length >= 2) {
        const headers = rows[0].split('|').map(c => c.trim()).filter(Boolean);
        const dataRows = rows.slice(2);
        return (
          <div key={i} style={{ overflowX: 'auto', margin: '14px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} style={{ padding: '8px 12px', border: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-dark)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((r, rIdx) => {
                  const cells = r.split('|').map(c => c.trim()).filter(Boolean);
                  return (
                    <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      {cells.map((c, cIdx) => (
                        <td key={cIdx} style={{ padding: '8px 12px', border: '1px solid var(--border-light)' }}>
                          {c}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    }

    return (
      <p key={i} style={{ margin: '8px 0', color: 'var(--text-body)' }}>
        {block}
      </p>
    );
  });
}
