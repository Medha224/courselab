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
  Award
} from 'lucide-react';

export default function LessonPreview({ lesson }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);

  if (!lesson || !lesson.lessonContent) {
    return null;
  }

  const { lessonTitle, learningObjective, lessonContent } = lesson;
  const content = lessonContent;

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Lesson Header Banner - Educational Theme */}
      <div className="edu-card" style={{ borderLeft: '5px solid #ffb606', padding: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
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

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '16px', lineHeight: 1.25 }}>
          {lessonTitle}
        </h1>

        <div style={{
          background: 'var(--amber-light)',
          border: '1px solid var(--amber-border)',
          padding: '16px 20px',
          borderRadius: '6px',
          marginTop: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Target size={15} color="#925f00" />
            <strong style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#925f00', letterSpacing: '0.05em' }}>
              Target Learning Objective
            </strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#452b00', lineHeight: 1.5, fontWeight: 500 }}>
            {learningObjective}
          </p>
        </div>
      </div>

      {/* 45-Minute Lesson Pacing Agenda */}
      {content.pacingBreakdown && content.pacingBreakdown.length > 0 && (
        <div className="edu-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#ffb606" />
              <span>45-Minute Pacing Timeline</span>
            </h3>
            <span className="edu-badge edu-badge-amber">
              45 Min Total
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {content.pacingBreakdown.map((phase, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  padding: '14px 16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#925f00', fontFamily: 'var(--font-heading)' }}>
                    {phase.timeWindow || `Phase ${idx + 1}`}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {phase.durationMinutes} min
                  </span>
                </div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-dark)' }}>
                  {phase.phase}
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lesson Content Sections */}
      {content.sections && content.sections.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {content.sections.map((section, idx) => (
            <div key={section.id || idx} className="edu-card" style={{ padding: '30px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: '12px',
                marginBottom: '18px'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                  {section.title}
                </h2>
                {section.duration && (
                  <span className="edu-badge edu-badge-amber">
                    <Clock size={11} /> {section.duration}
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-body)' }}>
                {renderMarkdownContent(section.content)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hands-on Practical Activity */}
      {content.handsOnActivity && (
        <div className="edu-card" style={{ border: '1.5px solid #ffb606', background: '#fffdfa' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                background: '#ffb606',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--charcoal-dark)'
              }}>
                <Code2 size={18} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                Hands-on Lab: {content.handsOnActivity.title}
              </h3>
            </div>
            <span className="edu-badge edu-badge-dark">
              {content.handsOnActivity.estimatedMinutes || 10} Minutes
            </span>
          </div>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', marginBottom: '14px', fontWeight: 500 }}>
            <strong>Scenario:</strong> {content.handsOnActivity.scenario}
          </p>

          <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '6px', marginBottom: '16px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              Your Guided Tasks:
            </span>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(content.handsOnActivity.tasks || []).map((task, i) => (
                <li key={i} style={{ fontSize: '0.9rem', color: 'var(--text-body)' }}>
                  {task}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: 600 }}>
              Expected Outcome: {content.handsOnActivity.expectedOutcome}
            </span>
            {content.handsOnActivity.solutionHints && (
              <button
                type="button"
                className="edu-btn edu-btn-outline"
                style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                onClick={() => setShowHint(!showHint)}
              >
                {showHint ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                <span>{showHint ? 'Hide Instructor Guidance' : 'Reveal Instructor Guidance'}</span>
              </button>
            )}
          </div>

          {showHint && content.handsOnActivity.solutionHints && (
            <div style={{
              marginTop: '14px',
              padding: '12px 16px',
              background: 'var(--amber-light)',
              border: '1px solid var(--amber-border)',
              borderRadius: '6px',
              fontSize: '0.85rem',
              color: '#8a5a00'
            }}>
              <strong>Instructor Solution Notes:</strong> {content.handsOnActivity.solutionHints}
            </div>
          )}
        </div>
      )}

      {/* Formative Knowledge Checks */}
      {content.knowledgeChecks && content.knowledgeChecks.length > 0 && (
        <div className="edu-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <HelpCircle size={20} color="#ffb606" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
              Knowledge Checks (Active Recall)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    borderRadius: '8px',
                    padding: '18px'
                  }}
                >
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '12px' }}>
                    {qIdx + 1}. {qc.question}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                            padding: '10px 14px',
                            background: btnBg,
                            border: btnBorder,
                            color: btnColor,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.88rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span><strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}</span>
                          {isAnswered && optIdx === qc.correctIndex && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>✓ Correct</span>
                          )}
                          {isAnswered && optIdx === selected && optIdx !== qc.correctIndex && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626' }}>✗ Incorrect</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div style={{
                      marginTop: '12px',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      background: isCorrect ? '#ecfdf5' : '#eff6ff',
                      border: `1px solid ${isCorrect ? '#a7f3d0' : '#bfdbfe'}`,
                      fontSize: '0.85rem',
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
        </div>
      )}

      {/* Supplementary YouTube Videos */}
      {content.videoResources && content.videoResources.length > 0 && (
        <div className="edu-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Video size={20} color="#dc2626" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
              Curated Video Resources
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
            {content.videoResources.map((video, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="edu-badge edu-badge-amber" style={{ fontSize: '0.65rem' }}>
                      {video.channel}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      ⏱️ {video.duration}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-dark)' }}>
                    {video.title}
                  </h4>
                  <p style={{ margin: '0 0 12px', fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: 1.4 }}>
                    {video.description}
                  </p>

                  {video.timestamps && video.timestamps.length > 0 && (
                    <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '4px', marginBottom: '12px', border: '1px solid var(--border-light)' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                        Key Timestamps:
                      </span>
                      {video.timestamps.map((ts, tIdx) => (
                        <div key={tIdx} style={{ fontSize: '0.75rem', color: 'var(--text-body)', display: 'flex', gap: '6px' }}>
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
                  style={{ fontSize: '0.78rem', padding: '8px 14px', width: '100%' }}
                >
                  <ExternalLink size={13} />
                  <span>Watch on YouTube</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Authoritative References */}
      {content.references && content.references.length > 0 && (
        <div className="edu-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Book size={20} color="#ffb606" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
              Authoritative References & Academic Citations
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {content.references.map((ref, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span className="edu-badge edu-badge-dark" style={{ fontSize: '0.65rem' }}>
                      {ref.type || 'Source'}
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                      {ref.title}
                    </strong>
                  </div>
                  <p style={{ margin: '2px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {ref.authors && `By ${Array.isArray(ref.authors) ? ref.authors.join(', ') : ref.authors} • `}
                    {ref.publisher} {ref.year ? `(${ref.year})` : ''}
                    {ref.isbn && ` • ISBN: ${ref.isbn}`}
                  </p>
                  {ref.relevantChapters && (
                    <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#925f00' }}>
                      Chapters: {ref.relevantChapters}
                    </p>
                  )}
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
      return <h4 key={i} style={{ fontSize: '1.05rem', fontWeight: 800, margin: '18px 0 8px', color: 'var(--text-dark)' }}>{block.replace('### ', '')}</h4>;
    }
    if (block.startsWith('#### ')) {
      return <h5 key={i} style={{ fontSize: '0.95rem', fontWeight: 700, margin: '14px 0 6px', color: 'var(--text-dark)' }}>{block.replace('#### ', '')}</h5>;
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
          fontSize: '0.9rem'
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
          <div key={i} style={{ overflowX: 'auto', margin: '16px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
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
      <p key={i} style={{ margin: '10px 0', color: 'var(--text-body)' }}>
        {block}
      </p>
    );
  });
}
