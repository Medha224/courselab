import React, { useState } from 'react';
import { X, Key, Cpu } from 'lucide-react';

export default function SettingsModal({ providerInfo, onClose, onRefreshConfig }) {
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geminiApiKey: geminiKey.trim() || undefined,
          openaiApiKey: openaiKey.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update config');

      setStatusMsg({ type: 'success', text: 'Settings updated successfully! Active engine updated.' });
      if (onRefreshConfig) onRefreshConfig();
      setTimeout(() => {
        setStatusMsg(null);
        onClose();
      }, 1500);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edu-modal-overlay" onClick={onClose}>
      <div className="edu-modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={20} color="#ffb606" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
              AI Engine Settings
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

        {/* Current status */}
        <div style={{
          background: 'var(--amber-light)',
          border: '1px solid var(--amber-border)',
          borderRadius: '6px',
          padding: '14px 16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Cpu size={15} color="#925f00" />
            <strong style={{ fontSize: '0.85rem', color: '#925f00' }}>
              Active Engine: {providerInfo?.activeProvider || 'Autonomous Intelligent Engine'}
            </strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#654300', lineHeight: 1.45 }}>
            The tool works 100% out of the box using our built-in <strong>Autonomous Domain Engine</strong>. Supplying an optional Google Gemini or OpenAI API key enables live dynamic cloud LLM generation.
          </p>
        </div>

        {statusMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '0.82rem',
            background: statusMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${statusMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            color: statusMsg.type === 'success' ? '#065f46' : '#991b1b'
          }}>
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-dark)' }}>
              Google Gemini API Key (Optional)
            </label>
            <input
              type="password"
              className="edu-input"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-dark)' }}>
              OpenAI API Key (Optional)
            </label>
            <input
              type="password"
              className="edu-input"
              placeholder="sk-proj-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button
              type="button"
              className="edu-btn edu-btn-outline"
              onClick={onClose}
              disabled={saving}
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="edu-btn edu-btn-amber"
              disabled={saving}
              style={{ padding: '8px 18px', fontSize: '0.8rem' }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
