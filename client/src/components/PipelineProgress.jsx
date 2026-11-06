import React from 'react';
import { Search, BookMarked, ShieldCheck, Award, Loader2, Check, AlertCircle, RotateCcw } from 'lucide-react';

export default function PipelineProgress({ steps, onRetryStep }) {
  const stepDefinitions = [
    { id: 'research', label: '1. Research', icon: Search, desc: 'Books, RFCs & Videos' },
    { id: 'synthesis', label: '2. 45-Min Lesson', icon: BookMarked, desc: 'Pedagogical Synthesis' },
    { id: 'qc1', label: '3. QC1 Accuracy', icon: ShieldCheck, desc: 'Factual Correctness' },
    { id: 'qc2', label: '4. QC2 Quality', icon: Award, desc: 'Instructional Flow' }
  ];

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      padding: '16px 20px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        {stepDefinitions.map((stepDef) => {
          const status = steps[stepDef.id] || 'pending';
          const Icon = stepDef.icon;

          let badgeBg = '#f1f5f9';
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
                padding: '10px 14px',
                borderRadius: '6px',
                background: badgeBg,
                border: borderStyle,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: badgeColor,
                flexShrink: 0,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                {status === 'running' ? (
                  <Loader2 size={15} className="spin" />
                ) : status === 'completed' ? (
                  <Check size={15} color="#059669" />
                ) : status === 'error' ? (
                  <AlertCircle size={15} color="#dc2626" />
                ) : (
                  <Icon size={14} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>
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
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
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
