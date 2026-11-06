import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Check,
  CheckCircle2,
  Sparkles,
  Clock,
  RotateCcw
} from 'lucide-react';

export default function QCAuditPanel({ qc1Report, qc2Report, onApplyFix, onApplyAllFixes, onRerunQC1, onRerunQC2, loading }) {
  const [activeLayer, setActiveLayer] = useState('layer1');

  if (!qc1Report && !qc2Report) {
    return (
      <div className="edu-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <p>No QC audit reports generated yet. Enter a Title and Objective above and click Synthesize.</p>
      </div>
    );
  }

  const unappliedCount1 = (qc1Report?.issues || []).filter(i => !i.applied).length;
  const unappliedCount2 = (qc2Report?.issues || []).filter(i => !i.applied).length;
  const totalUnapplied = unappliedCount1 + unappliedCount2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Layer Switcher Bar */}
      <div className="edu-card" style={{ padding: '16px 20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Switcher Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`edu-btn ${activeLayer === 'layer1' ? 'edu-btn-dark' : 'edu-btn-outline'}`}
              onClick={() => setActiveLayer('layer1')}
              style={{ fontSize: '0.8rem', padding: '9px 16px' }}
            >
              <ShieldCheck size={15} />
              <span>QC1: Factual Accuracy</span>
              {qc1Report && (
                <span className="edu-badge edu-badge-amber" style={{ marginLeft: '4px', fontSize: '0.68rem' }}>
                  {qc1Report.overallScore}%
                </span>
              )}
            </button>

            <button
              type="button"
              className={`edu-btn ${activeLayer === 'layer2' ? 'edu-btn-dark' : 'edu-btn-outline'}`}
              onClick={() => setActiveLayer('layer2')}
              style={{ fontSize: '0.8rem', padding: '9px 16px' }}
            >
              <Award size={15} />
              <span>QC2: Instructional Quality</span>
              {qc2Report && (
                <span className="edu-badge edu-badge-amber" style={{ marginLeft: '4px', fontSize: '0.68rem' }}>
                  {qc2Report.overallScore}%
                </span>
              )}
            </button>
          </div>

          {/* Bulk Action & Rerun */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {totalUnapplied > 0 && (
              <button
                type="button"
                className="edu-btn edu-btn-amber"
                onClick={onApplyAllFixes}
                disabled={loading}
                style={{ fontSize: '0.78rem', padding: '8px 16px' }}
              >
                <Sparkles size={14} />
                <span>Apply All Recommendations</span>
              </button>
            )}

            <button
              type="button"
              className="edu-btn edu-btn-outline"
              onClick={activeLayer === 'layer1' ? onRerunQC1 : onRerunQC2}
              disabled={loading}
              style={{ fontSize: '0.75rem', padding: '8px 12px' }}
              title="Re-run audit"
            >
              <RotateCcw size={13} />
              <span>Re-audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* QC Layer 1 View */}
      {activeLayer === 'layer1' && qc1Report && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Overview Score Box */}
          <div className="edu-card" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div className="edu-score-dial excellent">
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{qc1Report.overallScore}</span>
              <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>/ 100</span>
            </div>

            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="edu-badge edu-badge-green">{qc1Report.verdict}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Audited against RFC 9110 & peer-reviewed literature
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-dark)' }}>
                Factual Accuracy & Reliability Audit
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
                {qc1Report.summary?.replace(/^###[^\n]+\n/, '')}
              </p>
            </div>
          </div>

          {/* Metrics Row */}
          {qc1Report.metrics && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <MetricBox label="Factual Correctness" value={`${qc1Report.metrics.factualCorrectness}%`} />
              <MetricBox label="Source Reliability" value={`${qc1Report.metrics.sourceReliability}%`} />
              <MetricBox label="Claim Verification" value={`${qc1Report.metrics.claimVerificationRate}%`} />
              <MetricBox label="Internal Consistency" value={`${qc1Report.metrics.internalConsistency}%`} />
            </div>
          )}

          {/* Verified Claims */}
          {qc1Report.verifiedClaims && qc1Report.verifiedClaims.length > 0 && (
            <div className="edu-card">
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 14px', color: 'var(--text-dark)' }}>
                Verified Authoritative Ground-Truth Claims ({qc1Report.verifiedClaims.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {qc1Report.verifiedClaims.map((claim, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px'
                    }}
                  >
                    <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 3px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                        {claim.claim}
                      </p>
                      <span style={{ fontSize: '0.78rem', color: '#925f00', fontWeight: 600 }}>
                        Standard: {claim.source}
                      </span>
                      {claim.notes && (
                        <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {claim.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Issues */}
          <div className="edu-card">
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 14px', color: 'var(--text-dark)' }}>
              Identified Technical Gaps & Recommendations ({qc1Report.issues?.length || 0})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(qc1Report.issues || []).map((issue, idx) => (
                <div
                  key={issue.id || idx}
                  style={{
                    background: '#ffffff',
                    border: `1.5px solid ${issue.applied ? '#10b981' : 'var(--border-light)'}`,
                    borderRadius: '8px',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="edu-badge edu-badge-amber">
                        {issue.severity}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-dark)' }}>
                        {issue.category}
                      </strong>
                    </div>

                    {issue.applied ? (
                      <span className="edu-badge edu-badge-green">
                        <Check size={12} /> Applied
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="edu-btn edu-btn-amber"
                        onClick={() => onApplyFix(issue, 'layer1')}
                        style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                      >
                        <Sparkles size={13} />
                        <span>Apply Fix</span>
                      </button>
                    )}
                  </div>

                  <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                    <strong>Examined Text:</strong> "{issue.claim}"
                  </p>
                  <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: '#b91c1c' }}>
                    <strong>Identified Gap:</strong> {issue.issue}
                  </p>

                  {issue.authoritativeSource && (
                    <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: '#925f00', fontWeight: 600 }}>
                      Authoritative Standard: {issue.authoritativeSource}
                    </p>
                  )}

                  {issue.suggestedAddition && (
                    <div style={{
                      background: 'var(--amber-light)',
                      borderLeft: '3px solid #ffb606',
                      padding: '8px 12px',
                      borderRadius: '0 4px 4px 0',
                      fontSize: '0.82rem',
                      color: '#8a5a00'
                    }}>
                      <strong>Suggested Fix:</strong> {issue.suggestedAddition}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QC Layer 2 View */}
      {activeLayer === 'layer2' && qc2Report && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Overview Score Box */}
          <div className="edu-card" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div className="edu-score-dial excellent">
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{qc2Report.overallScore}</span>
              <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>/ 100</span>
            </div>

            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="edu-badge edu-badge-green">{qc2Report.verdict}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Evaluated against Bloom's Taxonomy & 45-Minute Cognitive Feasibility
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-dark)' }}>
                Instructional Quality & Pedagogical Flow Audit
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
                {qc2Report.summary?.replace(/^###[^\n]+\n/, '')}
              </p>
            </div>
          </div>

          {/* 45-Minute Pacing Audit Bar */}
          {qc2Report.pacingAudit && (
            <div className="edu-card" style={{ background: '#fffdfa', border: '1.5px solid #ffb606' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark)' }}>
                  <Clock size={16} color="#ffb606" />
                  <span>45-Minute Pacing Feasibility</span>
                </h4>
                <span className="edu-badge edu-badge-dark">
                  {qc2Report.pacingAudit.estimatedCompletionMinutes} / 45 Min Feasible
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginBottom: '14px' }}>
                {qc2Report.pacingAudit.evaluation}
              </p>

              {qc2Report.pacingAudit.breakdown && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                  {Object.entries(qc2Report.pacingAudit.breakdown).map(([key, val], idx) => (
                    <div key={idx} style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'capitalize', color: 'var(--text-muted)', display: 'block' }}>
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <strong style={{ fontSize: '0.85rem', color: '#925f00' }}>
                        {val}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Metrics Row */}
          {qc2Report.metrics && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <MetricBox label="Objective Alignment" value={`${qc2Report.metrics.objectiveAlignment}%`} />
              <MetricBox label="Structural Clarity" value={`${qc2Report.metrics.structuralClarity}%`} />
              <MetricBox label="Pacing Feasibility" value={`${qc2Report.metrics.pacingAndCognitiveLoad}%`} />
              <MetricBox label="Scaffolding" value={`${qc2Report.metrics.practicalScaffolding}%`} />
            </div>
          )}

          {/* Objective Alignment Matrix */}
          {qc2Report.objectiveCoverage && (
            <div className="edu-card">
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 14px', color: 'var(--text-dark)' }}>
                Learning Objective Coverage (Bloom's Taxonomy)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {qc2Report.objectiveCoverage.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <p style={{ margin: '0 0 2px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                        {item.subObjective}
                      </p>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        Mapped Section: <strong>{item.mappedSection}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="edu-badge edu-badge-amber">
                        Bloom: {item.bloomsLevel}
                      </span>
                      <span className="edu-badge edu-badge-green">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Pedagogical Issues */}
          <div className="edu-card">
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 14px', color: 'var(--text-dark)' }}>
              Identified Instructional Improvements ({qc2Report.issues?.length || 0})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(qc2Report.issues || []).map((issue, idx) => (
                <div
                  key={issue.id || idx}
                  style={{
                    background: '#ffffff',
                    border: `1.5px solid ${issue.applied ? '#10b981' : 'var(--border-light)'}`,
                    borderRadius: '8px',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="edu-badge edu-badge-amber">
                        {issue.severity}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-dark)' }}>
                        {issue.category} • {issue.element}
                      </strong>
                    </div>

                    {issue.applied ? (
                      <span className="edu-badge edu-badge-green">
                        <Check size={12} /> Applied
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="edu-btn edu-btn-amber"
                        onClick={() => onApplyFix(issue, 'layer2')}
                        style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                      >
                        <Sparkles size={13} />
                        <span>Apply Recommendation</span>
                      </button>
                    )}
                  </div>

                  <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                    <strong>Observation:</strong> {issue.issue}
                  </p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.85rem', color: '#925f00', fontWeight: 600 }}>
                    <strong>Pedagogical Fix:</strong> {issue.pedagogicalRecommendation}
                  </p>

                  {issue.suggestedAddition && (
                    <pre style={{ margin: '6px 0 0', padding: '10px', fontSize: '0.78rem' }}>
                      <code>{issue.suggestedAddition}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value }) {
  return (
    <div style={{
      background: 'var(--bg-subtle)',
      border: '1px solid var(--border-light)',
      borderRadius: '6px',
      padding: '12px 14px'
    }}>
      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
        {label}
      </span>
      <strong style={{ fontSize: '1.25rem', color: '#ffb606', fontFamily: 'var(--font-heading)' }}>
        {value}
      </strong>
    </div>
  );
}
