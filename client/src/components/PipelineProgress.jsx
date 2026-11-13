import React, { useState } from 'react';
import { Search, BookMarked, ShieldCheck, Award, Loader2, Check, AlertCircle, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

export default function PipelineProgress({ steps, onRetryStep }) {
  const allCompleted =
    steps.research === 'completed' &&
    steps.synthesis === 'completed' &&
    steps.qc1 === 'completed' &&
    steps.qc2 === 'completed';

  // If all completed, collapse by default to avoid cluttering the screen
  const [isExpanded, setIsExpanded] = useState(!allCompleted);

  const stepDefinitions = [
    { id: 'research', label: '1. Research', icon: Search, desc: 'Books, RFCs & Videos' },
    { id: 'synthesis', label: '2. 45-Min Lesson', icon: BookMarked, desc: 'Pedagogical Synthesis' },
    { id: 'qc1', label: '3. QC1 Accuracy', icon: ShieldCheck, desc: 'Factual Correctness' },
    { id: 'qc2', label: '4. QC2 Quality', icon: Award, desc: 'Instructional Flow' }
  ];

  // If completed and collapsed, render a sleek 1-line verification pill
  if (allCompleted && !isExpanded) {
    return (
      <div style={{
        background: '#ecfdf5',
        border: '1px solid #a7f3d0',
        borderRadius: '6px',
        padding: '10px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Check size={12} strokeWidth={3} />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#065f46' }}>
            Pipeline Verified: Research, 45-Min Synthesis, QC1 Accuracy, and QC2 Quality completed.
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#047857',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 6px'
          }}
        >
          <span>View Pipeline Stages ▾</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      padding: '14px 18px',
      marginBottom: '20px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {allCompleted && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Hide Pipeline Stages ▴</span>
          </button>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px'
      }}>
        {stepDefinitions.map((stepDef) => {
          const status = steps[stepDef.id] || 'pending';
          const Icon = stepDef.icon;

          let badgeBg = '#f8fafc';
          let badgeColor = '#64748b';
          let borderStyle = '1px solid var(--border-light)';

          if (status === 'running') {
            badgeBg = '#fff8e6';
            badgeColor = '#d97706';
            borderStyle = '1.5px solid #ffb606';
          } else if (status === 'completed') {
            badgeBg = '#ecfdf5';
            badgeColor = '#059669';
            borderStyle = '1px solid #a7f3d0';
          } else if (status === 'error') {
            badgeBg = '#fef2f2';
            badgeColor = '#dc2626';
            borderStyle = '1px solid #fecaca';
          }

          return (
            <div
              key={stepDef.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '6px',
                background: badgeBg,
                border: borderStyle,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: badgeColor,
                flexShrink: 0,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                {status === 'running' ? (
                  <Loader2 size={14} className="spin" />
                ) : status === 'completed' ? (
                  <Check size={14} color="#059669" />
                ) : status === 'error' ? (
                  <AlertCircle size={14} color="#dc2626" />
                ) : (
                  <Icon size={13} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>
                    {stepDef.label}
                  </span>
                  {status === 'error' && onRetryStep && (
                    <button
                      onClick={() => onRetryStep(stepDef.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      title="Retry step"
                    >
                      <RotateCcw size={12} />
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                  {stepDef.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
