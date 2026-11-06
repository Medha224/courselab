import React, { useState, useEffect } from 'react';
import { X, FolderArchive, ArrowRight, ShieldCheck, Award, Clock } from 'lucide-react';

export default function SavedLessonsModal({ onClose, onLoadLesson }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/lessons')
      .then(r => r.json())
      .then(d => {
        setLessons(d.lessons || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load lessons:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="edu-modal-overlay" onClick={onClose}>
      <div className="edu-modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderArchive size={20} color="#ffb606" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
              Saved Lessons Library
            </h3>
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading saved lessons...
          </div>
        ) : lessons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p>No saved lessons found. Generate and save your first lesson!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '60vh', overflowY: 'auto' }}>
            {lessons.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 3px', color: 'var(--text-dark)' }}>
                    {item.lessonTitle}
                  </h4>
                  <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.learningObjective}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                    </span>
                    {item.qc1Score && (
                      <span className="edu-badge edu-badge-green" style={{ fontSize: '0.65rem' }}>
                        <ShieldCheck size={10} /> QC1: {item.qc1Score}%
                      </span>
                    )}
                    {item.qc2Score && (
                      <span className="edu-badge edu-badge-amber" style={{ fontSize: '0.65rem' }}>
                        <Award size={10} /> QC2: {item.qc2Score}%
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="edu-btn edu-btn-dark"
                  onClick={() => {
                    onLoadLesson(item.id);
                    onClose();
                  }}
                  style={{ padding: '7px 14px', fontSize: '0.75rem' }}
                >
                  <span>Load</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
