import React, { useState } from 'react';
import { Save, Plus, Trash2, Check, FileEdit, ChevronsUpDown, Clock } from 'lucide-react';

export default function LessonEditor({ lesson, onSaveEdits }) {
  const [editedLesson, setEditedLesson] = useState(() => JSON.parse(JSON.stringify(lesson)));
  const [saveStatus, setSaveStatus] = useState(null);
  // Default section 0 open, rest collapsed for clean uncluttered layout
  const [openEditorSections, setOpenEditorSections] = useState({ 0: true });

  if (!editedLesson || !editedLesson.lessonContent) {
    return null;
  }

  const sections = editedLesson.lessonContent.sections || [];

  const toggleEditorSection = (idx) => {
    setOpenEditorSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleExpandAll = () => {
    const all = {};
    sections.forEach((_, idx) => { all[idx] = true; });
    setOpenEditorSections(all);
  };

  const handleCollapseAll = () => {
    setOpenEditorSections({});
  };

  const handleTitleChange = (val) => {
    setEditedLesson(prev => ({
      ...prev,
      lessonTitle: val,
      lessonContent: { ...prev.lessonContent, title: val }
    }));
  };

  const handleObjectiveChange = (val) => {
    setEditedLesson(prev => ({
      ...prev,
      learningObjective: val,
      lessonContent: { ...prev.lessonContent, learningObjective: val }
    }));
  };

  const handleSectionChange = (index, field, value) => {
    setEditedLesson(prev => {
      const updatedSections = [...prev.lessonContent.sections];
      updatedSections[index] = { ...updatedSections[index], [field]: value };
      return {
        ...prev,
        lessonContent: { ...prev.lessonContent, sections: updatedSections }
      };
    });
  };

  const handleAddSection = () => {
    setEditedLesson(prev => {
      const newSec = {
        id: `sec_custom_${Date.now()}`,
        title: 'New Section Title',
        duration: '5 min',
        content: 'Add your custom educational explanations, examples, or code snippets here...'
      };
      const newIdx = (prev.lessonContent.sections || []).length;
      setOpenEditorSections(cur => ({ ...cur, [newIdx]: true }));
      return {
        ...prev,
        lessonContent: {
          ...prev.lessonContent,
          sections: [...(prev.lessonContent.sections || []), newSec]
        }
      };
    });
  };

  const handleDeleteSection = (index) => {
    if (window.confirm('Delete this section?')) {
      setEditedLesson(prev => {
        const updated = prev.lessonContent.sections.filter((_, i) => i !== index);
        return {
          ...prev,
          lessonContent: { ...prev.lessonContent, sections: updated }
        };
      });
    }
  };

  const handleSave = () => {
    onSaveEdits(editedLesson);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const totalWords = sections.reduce((acc, s) => {
    return acc + (s.content ? s.content.split(/\s+/).filter(Boolean).length : 0);
  }, 0);
  const estimatedReadTime = Math.round(totalWords / 140);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Editor Control Bar */}
      <div className="edu-card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '16px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: '#ffb606', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--charcoal-dark)' }}>
            <FileEdit size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
              Instructor Live Editor
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {sections.length} Sections • {totalWords} Words • ~{estimatedReadTime} Min Read Time
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {saveStatus === 'saved' && (
            <span style={{ fontSize: '0.82rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <Check size={15} /> Saved to disk & local storage
            </span>
          )}
          <button
            type="button"
            className="edu-btn edu-btn-amber"
            onClick={handleSave}
            style={{ padding: '9px 20px', fontSize: '0.82rem' }}
          >
            <Save size={15} />
            <span>Save All Edits</span>
          </button>
        </div>
      </div>

      {/* Metadata Edit */}
      <div className="edu-card">
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.04em', display: 'block', marginBottom: '14px' }}>
          Lesson Header & Objectives
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-dark)' }}>
              Lesson Title
            </label>
            <input
              type="text"
              className="edu-input"
              value={editedLesson.lessonTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-dark)' }}>
              Learning Objective
            </label>
            <textarea
              className="edu-textarea"
              rows={2}
              value={editedLesson.learningObjective}
              onChange={(e) => handleObjectiveChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sections List with Expand/Collapse Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
            Lesson Sections & Timing ({sections.length})
          </h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="edu-btn edu-btn-outline"
              onClick={handleExpandAll}
              style={{ padding: '5px 12px', fontSize: '0.75rem' }}
            >
              <ChevronsUpDown size={12} />
              <span>Expand All</span>
            </button>
            <button
              type="button"
              className="edu-btn edu-btn-outline"
              onClick={handleCollapseAll}
              style={{ padding: '5px 12px', fontSize: '0.75rem' }}
            >
              <span>Collapse All</span>
            </button>
            <button
              type="button"
              className="edu-btn edu-btn-amber"
              onClick={handleAddSection}
              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
            >
              <Plus size={13} />
              <span>Add Custom Section</span>
            </button>
          </div>
        </div>

        {sections.map((sec, idx) => {
          const isOpen = Boolean(openEditorSections[idx]);
          const previewSnippet = sec.content
            ? sec.content.replace(/[#*`>]/g, '').slice(0, 90).trim() + '...'
            : '';

          return (
            <div
              key={sec.id || idx}
              className="edu-card"
              style={{
                background: '#ffffff',
                borderLeft: isOpen ? '4px solid #ffb606' : '1px solid var(--border-light)',
                padding: '16px 20px'
              }}
            >
              {/* Collapsible Section Header Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
                  <span style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '4px',
                    background: isOpen ? '#18191d' : 'var(--bg-subtle)',
                    color: isOpen ? '#ffb606' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </span>

                  <div>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--text-dark)', display: 'block' }}>
                      {sec.title}
                    </strong>
                    {!isOpen && (
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {previewSnippet}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="edu-badge edu-badge-amber" style={{ fontSize: '0.68rem' }}>
                    <Clock size={11} /> {sec.duration || '5 min'}
                  </span>

                  <button
                    type="button"
                    className="edu-btn edu-btn-outline"
                    onClick={() => toggleEditorSection(idx)}
                    style={{ fontSize: '0.74rem', padding: '5px 12px' }}
                  >
                    <span>{isOpen ? 'Close ▴' : 'Edit Section ▾'}</span>
                  </button>

                  <button
                    type="button"
                    className="edu-btn edu-btn-outline"
                    onClick={() => handleDeleteSection(idx)}
                    title="Delete Section"
                    style={{ padding: '5px 9px', color: '#dc2626', borderColor: '#fca5a5' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Editable Fields (Only open when clicked) */}
              {isOpen && (
                <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '3px' }}>
                        Section Title
                      </label>
                      <input
                        type="text"
                        className="edu-input"
                        value={sec.title}
                        onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                      />
                    </div>

                    <div style={{ width: '130px' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '3px' }}>
                        Duration
                      </label>
                      <input
                        type="text"
                        className="edu-input"
                        value={sec.duration || ''}
                        onChange={(e) => handleSectionChange(idx, 'duration', e.target.value)}
                        placeholder="e.g. 5 min"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '3px' }}>
                      Content (Markdown formatting supported)
                    </label>
                    <textarea
                      className="edu-textarea"
                      style={{ minHeight: '130px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                      value={sec.content}
                      onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
