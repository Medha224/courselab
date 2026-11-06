import React from 'react';
import { Download, FolderArchive, Settings, Cpu, Sparkles, BookOpen } from 'lucide-react';

export default function Header({ providerInfo, onOpenSettings, onOpenExport, onOpenLibrary, hasLesson }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Top Thin Charcoal Bar (as in image) */}
      <div style={{
        background: 'var(--charcoal-dark)',
        color: '#94a3b8',
        fontSize: '0.75rem',
        padding: '7px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span><strong>AI CURRICULUM WORKFLOWS</strong> • 45-MINUTE LESSON SYNTHESIS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
            <span style={{ color: '#cbd5e1' }}>
              Engine: <strong style={{ color: '#ffb606' }}>{providerInfo?.activeProvider || 'Autonomous Intelligent Engine'}</strong>
            </span>
          </div>
          <button
            onClick={onOpenSettings}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem'
            }}
            title="Configure AI API Keys"
          >
            <Settings size={12} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Crisp White Navbar with Yellow Accent Block (Directly from Image) */}
      <nav style={{
        background: '#ffffff',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
        overflow: 'hidden'
      }}>
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 28px' }}>
          {/* Dual-tone arrow / course logo mark as in image */}
          <div style={{
            width: '38px',
            height: '38px',
            background: 'var(--charcoal-dark)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '0',
              height: '0',
              borderTop: '9px solid transparent',
              borderBottom: '9px solid transparent',
              borderLeft: '14px solid #ffb606',
              marginLeft: '2px'
            }}></div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: 'var(--text-dark)'
              }}>
                COURSE<span style={{ color: '#ffb606' }}>LAB</span>
              </span>
              <span className="edu-badge edu-badge-amber" style={{ fontSize: '0.65rem' }}>
                AI Research
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              AI-Powered Lesson Creation & Quality Control System
            </p>
          </div>
        </div>

        {/* Center / Right Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={onOpenLibrary}
            className="edu-btn edu-btn-outline"
            style={{
              border: 'none',
              padding: '12px 18px',
              fontSize: '0.8rem',
              color: 'var(--text-body)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FolderArchive size={16} />
            <span>Saved Lessons</span>
          </button>

          {/* Golden Yellow Callout Block (Signature Feature from Screenshot) */}
          <button
            onClick={onOpenExport}
            disabled={!hasLesson}
            style={{
              background: hasLesson ? '#ffb606' : '#f1f5f9',
              color: hasLesson ? 'var(--charcoal-dark)' : '#94a3b8',
              border: 'none',
              padding: '0 28px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: hasLesson ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              height: '100%',
              transition: 'background 0.2s ease'
            }}
            title={hasLesson ? 'Export finalized lesson & QC reports' : 'Generate a lesson first to export'}
          >
            <Download size={18} />
            <span>Export Package</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
