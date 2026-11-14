import React, { useState } from 'react';
import { X, FileText, Code, FileCode, Check, Copy, Download, BookOpen } from 'lucide-react';

export default function ExportModal({ lesson, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!lesson) return null;

  const handleDownload = async (format) => {
    try {
      const res = await fetch(`/api/lesson/export/${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson })
      });

      if (!res.ok) throw new Error('Export download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeTitle = (lesson.lessonTitle || 'lesson').replace(/[^a-zA-Z0-9_-]/g, '_');
      a.download = `${safeTitle}_lesson.${format === 'markdown' ? 'md' : format === 'html' ? 'html' : 'json'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  };

  const handleCopyMarkdown = async () => {
    try {
      const res = await fetch('/api/lesson/export/markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson })
      });
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      alert('Failed to copy: ' + err.message);
    }
  };

  return (
    <div className="edu-modal-overlay" onClick={onClose}>
      <div className="edu-modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
              Export Complete Lesson
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Exports exclusively the finalized 45-minute educational lesson plan ready for students and instructors
            </p>
          </div>
          <button
            type="button"
            className="edu-btn edu-btn-outline"
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Informative Scope Card */}
        <div style={{
          background: 'var(--amber-light)',
          border: '1px solid var(--amber-border)',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <BookOpen size={18} color="#925f00" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.82rem', color: '#784d00', fontWeight: 600 }}>
            Includes: Title, 45-min timing plan, all lesson sections, code walkthroughs, practical lab, active recall quiz, video masterclasses, and references.
          </span>
        </div>

        {/* Formats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {/* Markdown */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: 'var(--amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#925f00' }}>
                <FileText size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                  Complete Lesson Markdown (.md)
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Clean GFM formatted document ready for LMS, GitHub, or Notion
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="edu-btn edu-btn-outline"
                onClick={handleCopyMarkdown}
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                {copied ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                className="edu-btn edu-btn-amber"
                onClick={() => handleDownload('markdown')}
                style={{ padding: '6px 14px', fontSize: '0.75rem' }}
              >
                <Download size={13} />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* HTML */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                <FileCode size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                  Complete Lesson Web Page (.html)
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Printable standalone webpage styled for direct viewing or Print-to-PDF
                </p>
              </div>
            </div>

            <button
              type="button"
              className="edu-btn edu-btn-dark"
              onClick={() => handleDownload('html')}
              style={{ padding: '6px 14px', fontSize: '0.75rem' }}
            >
              <Download size={13} />
              <span>Download</span>
            </button>
          </div>

          {/* JSON */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dark)' }}>
                <Code size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                  Complete Lesson JSON (.json)
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Structured lesson content payload (timing, sections, lab, quiz, references)
                </p>
              </div>
            </div>

            <button
              type="button"
              className="edu-btn edu-btn-outline"
              onClick={() => handleDownload('json')}
              style={{ padding: '6px 14px', fontSize: '0.75rem' }}
            >
              <Download size={13} />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
