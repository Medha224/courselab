import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Check,
  CheckCircle2,
  Sparkles,
  Clock,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Target,
  FileCheck2,
  ChevronsUpDown
} from 'lucide-react';

export default function QCAuditPanel({ qc1Report, qc2Report, onApplyFix, onApplyAllFixes, onRerunQC1, onRerunQC2, loading }) {
  const [activeLayer, setActiveLayer] = useState('layer1');

  // Collapsible state for QC1
  const [showVerifiedClaims, setShowVerifiedClaims] = useState(false);
  const [openQC1Issues, setOpenQC1Issues] = useState({});

  // Collapsible state for QC2
  const [showPacingBreakdown, setShowPacingBreakdown] = useState(false);
  const [showObjectiveMatrix, setShowObjectiveMatrix] = useState(false);
  const [openQC2Issues, setOpenQC2Issues] = useState({});

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

  // Toggle individual issue details
  const toggleQC1Issue = (idx) => {
    setOpenQC1Issues(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleQC2Issue = (idx) => {
    setOpenQC2Issues(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Master toggles for QC1
  const handleExpandAllQC1 = () => {
    setShowVerifiedClaims(true);
    const all = {};
    (qc1Report?.issues || []).forEach((_, idx) => { all[idx] = true; });
    setOpenQC1Issues(all);
  };

  const handleCollapseAllQC1 = () => {
    setShowVerifiedClaims(false);
    setOpenQC1Issues({});
  };

  // Master toggles for QC2
  const handleExpandAllQC2 = () => {
    setShowPacingBreakdown(true);
    setShowObjectiveMatrix(true);
    const all = {};
    (qc2Report?.issues || []).forEach((_, idx) => { all[idx] = true; });
    setOpenQC2Issues(all);
  };

  const handleCollapseAllQC2 = () => {
    setShowPacingBreakdown(false);
    setShowObjectiveMatrix(false);
    setOpenQC2Issues({});
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Layer Switcher & Master Actions Bar */}
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

          {/* Master Detail Controls & Apply Fixes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {activeLayer === 'layer1' ? (
              <>
                <button
                  type="button"
                  className="edu-btn edu-btn-outline"
                  onClick={handleExpandAllQC1}
                  style={{ fontSize: '0.72rem', padding: '6px 12px' }}
                >
                  <ChevronsUpDown size={12} />
                  <span>Expand Details</span>
                </button>
                <button
                  type="button"
                  className="edu-btn edu-btn-outline"
                  onClick={handleCollapseAllQC1}
                  style={{ fontSize: '0.72rem', padding: '6px 12px' }}
                >
                  <span>Collapse Details</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="edu-btn edu-btn-outline"
                  onClick={handleExpandAllQC2}
                  style={{ fontSize: '0.72rem', padding: '6px 12px' }}
                >
                  <ChevronsUpDown size={12} />
                  <span>Expand Details</span>
                </button>
                <button
                  type="button"
                  className="edu-btn edu-btn-outline"
                  onClick={handleCollapseAllQC2}
                  style={{ fontSize: '0.72rem', padding: '6px 12px' }}
                >
                  <span>Collapse Details</span>
                </button>
              </>
            )}

            {totalUnapplied > 0 && (
              <button
                type="button"
                className="edu-btn edu-btn-amber"
                onClick={onApplyAllFixes}
                disabled={loading}
                style={{ fontSize: '0.76rem', padding: '7px 14px' }}
              >
                <Sparkles size={13} />
                <span>Apply All Fixes</span>
              </button>
            )}

            <button
              type="button"
              className="edu-btn edu-btn-outline"
              onClick={activeLayer === 'layer1' ? onRerunQC1 : onRerunQC2}
              disabled={loading}
              style={{ fontSize: '0.75rem', padding: '7px 12px' }}
              title="Re-run audit"
            >
              <RotateCcw size={13} />
              <span>Re-audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* QC Layer 1 View (Factual Accuracy) */}
      {activeLayer === 'layer1' && qc1Report && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Overview Score Box */}
          <div className="edu-card" style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
            <div className="edu-score-dial excellent">
              <span style={{ fontSize: '1.45rem', lineHeight: 1 }}>{qc1Report.overallScore}</span>
              <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>/ 100</span>
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="edu-badge edu-badge-green">{qc1Report.verdict}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Audited against RFC 9110 & peer-reviewed literature
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-dark)' }}>
                Factual Accuracy & Reliability Audit
              </h3>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
                {qc1Report.summary?.replace(/^###[^\n]+\n/, '')}
              </p>
            </div>
          </div>

          {/* Metrics Row */}
          {qc1Report.metrics && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <MetricBox label="Factual Correctness" value={`${qc1Report.metrics.factualCorrectness}%`} />
              <MetricBox label="Source Reliability" value={`${qc1Report.metrics.sourceReliability}%`} />
              <MetricBox label="Claim Verification" value={`${qc1Report.metrics.claimVerificationRate}%`} />
              <MetricBox label="Internal Consistency" value={`${qc1Report.metrics.internalConsistency}%`} />
            </div>
          )}

          {/* Verified Claims (Collapsible with Toggle Button) */}
          {qc1Report.verifiedClaims && qc1Report.verifiedClaims.length > 0 && (
            <div className="edu-card" style={{ padding: '18px 22px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                    <FileCheck2 size={16} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                      Verified Ground-Truth Claims ({qc1Report.verifiedClaims.length})
                    </h4>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Authoritative claims cross-referenced with RFC standards & canonical texts
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="edu-btn edu-btn-outline"
                  onClick={() => setShowVerifiedClaims(!showVerifiedClaims)}
                  style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                >
                  <span>{showVerifiedClaims ? 'Hide Claims ▴' : `View ${qc1Report.verifiedClaims.length} Claims ▾`}</span>
                </button>
              </div>

              {showVerifiedClaims && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                  {qc1Report.verifiedClaims.map((claim, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-subtle)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px'
                      }}
                    >
                      <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 2px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                          {claim.claim}
                        </p>
                        <span style={{ fontSize: '0.75rem', color: '#925f00', fontWeight: 600 }}>
                          Standard: {claim.source}
                        </span>
                        {claim.notes && (
                          <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {claim.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actionable Issues (Collapsible Details per Card) */}
          <div className="edu-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                  Identified Technical Gaps & Recommendations ({qc1Report.issues?.length || 0})
                </h4>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Click "Details ▾" on any issue to inspect examined text and suggested improvements
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(qc1Report.issues || []).map((issue, idx) => {
                const isOpen = Boolean(openQC1Issues[idx]);
                return (
                  <div
                    key={issue.id || idx}
                    style={{
                      background: '#ffffff',
                      border: `1.5px solid ${issue.applied ? '#10b981' : 'var(--border-light)'}`,
                      borderRadius: '6px',
                      padding: '14px 16px',
                      transition: 'border 0.2s ease'
                    }}
                  >
                    {/* Header Row with Toggle Button */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
                        <span className="edu-badge edu-badge-amber" style={{ fontSize: '0.68rem' }}>
                          {issue.severity}
                        </span>
                        <div>
                          <strong style={{ fontSize: '0.86rem', color: 'var(--text-dark)', display: 'block' }}>
                            {issue.category}
                          </strong>
                          {!isOpen && (
                            <span style={{ fontSize: '0.78rem', color: '#b91c1c' }}>
                              Gap: {issue.issue}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {issue.applied ? (
                          <span className="edu-badge edu-badge-green" style={{ fontSize: '0.72rem' }}>
                            <Check size={12} /> Applied
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="edu-btn edu-btn-amber"
                            onClick={() => onApplyFix(issue, 'layer1')}
                            style={{ padding: '5px 12px', fontSize: '0.74rem' }}
                          >
                            <Sparkles size={12} />
                            <span>Apply Fix</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="edu-btn edu-btn-outline"
                          onClick={() => toggleQC1Issue(idx)}
                          style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                        >
                          <span>{isOpen ? 'Details ▴' : 'Details ▾'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Detailed Content (Only shown when clicked) */}
                    {isOpen && (
                      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                        <p style={{ margin: '0 0 6px', fontSize: '0.82rem', color: 'var(--text-dark)' }}>
                          <strong>Examined Lesson Text:</strong> "{issue.claim}"
                        </p>
                        <p style={{ margin: '0 0 6px', fontSize: '0.82rem', color: '#b91c1c' }}>
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
                            fontSize: '0.8rem',
                            color: '#8a5a00',
                            marginTop: '8px'
                          }}>
                            <strong>Suggested Canonical Fix:</strong> {issue.suggestedAddition}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* QC Layer 2 View (Instructional Quality) */}
      {activeLayer === 'layer2' && qc2Report && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Overview Score Box */}
          <div className="edu-card" style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
            <div className="edu-score-dial excellent">
              <span style={{ fontSize: '1.45rem', lineHeight: 1 }}>{qc2Report.overallScore}</span>
              <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>/ 100</span>
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="edu-badge edu-badge-green">{qc2Report.verdict}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Evaluated against Bloom's Taxonomy & 45-Minute Cognitive Feasibility
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-dark)' }}>
                Instructional Quality & Pedagogical Flow Audit
              </h3>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
                {qc2Report.summary?.replace(/^###[^\n]+\n/, '')}
              </p>
            </div>
          </div>

          {/* 45-Minute Pacing Audit Bar (Collapsible with Button) */}
          {qc2Report.pacingAudit && (
            <div className="edu-card" style={{ background: '#fffdfa', border: '1.5px solid #ffb606', padding: '18px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '4px', background: '#ffb606', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#18191d' }}>
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                      45-Minute Pacing Feasibility
                    </h4>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {qc2Report.pacingAudit.estimatedCompletionMinutes} / 45 Min Feasible • Cognitive load optimized
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="edu-badge edu-badge-dark" style={{ fontSize: '0.7rem' }}>
                    {qc2Report.pacingAudit.estimatedCompletionMinutes} Min
                  </span>
                  <button
                    type="button"
                    className="edu-btn edu-btn-outline"
                    onClick={() => setShowPacingBreakdown(!showPacingBreakdown)}
                    style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                  >
                    <span>{showPacingBreakdown ? 'Hide Breakdown ▴' : 'View Breakdown ▾'}</span>
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-body)', margin: '10px 0 0', lineHeight: 1.45 }}>
                {qc2Report.pacingAudit.evaluation}
              </p>

              {showPacingBreakdown && qc2Report.pacingAudit.breakdown && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                  {Object.entries(qc2Report.pacingAudit.breakdown).map(([key, val], idx) => (
                    <div key={idx} style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                      <span style={{ fontSize: '0.68rem', textTransform: 'capitalize', color: 'var(--text-muted)', display: 'block' }}>
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <strong style={{ fontSize: '0.82rem', color: '#925f00' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <MetricBox label="Objective Alignment" value={`${qc2Report.metrics.objectiveAlignment}%`} />
              <MetricBox label="Structural Clarity" value={`${qc2Report.metrics.structuralClarity}%`} />
              <MetricBox label="Pacing Feasibility" value={`${qc2Report.metrics.pacingAndCognitiveLoad}%`} />
              <MetricBox label="Scaffolding" value={`${qc2Report.metrics.practicalScaffolding}%`} />
            </div>
          )}

          {/* Objective Alignment Matrix (Collapsible with Button) */}
          {qc2Report.objectiveCoverage && (
            <div className="edu-card" style={{ padding: '18px 22px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '4px', background: 'var(--amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#925f00' }}>
                    <Target size={16} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                      Learning Objective Coverage Matrix ({qc2Report.objectiveCoverage.length} Sub-Objectives)
                    </h4>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Bloom's Taxonomy cognitive progression and section alignment
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="edu-btn edu-btn-outline"
                  onClick={() => setShowObjectiveMatrix(!showObjectiveMatrix)}
                  style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                >
                  <span>{showObjectiveMatrix ? 'Hide Matrix ▴' : 'View Coverage Matrix ▾'}</span>
                </button>
              </div>

              {showObjectiveMatrix && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                  {qc2Report.objectiveCoverage.map((item, idx) => (
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
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}
                    >
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                          {item.subObjective}
                        </p>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          Mapped Section: <strong>{item.mappedSection}</strong>
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="edu-badge edu-badge-amber" style={{ fontSize: '0.68rem' }}>
                          Bloom: {item.bloomsLevel}
                        </span>
                        <span className="edu-badge edu-badge-green" style={{ fontSize: '0.68rem' }}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actionable Pedagogical Issues (Collapsible Details per Card) */}
          <div className="edu-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                  Identified Instructional Improvements ({qc2Report.issues?.length || 0})
                </h4>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Pedagogical enhancements to clarity, examples, and active learning
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(qc2Report.issues || []).map((issue, idx) => {
                const isOpen = Boolean(openQC2Issues[idx]);
                return (
                  <div
                    key={issue.id || idx}
                    style={{
                      background: '#ffffff',
                      border: `1.5px solid ${issue.applied ? '#10b981' : 'var(--border-light)'}`,
                      borderRadius: '6px',
                      padding: '14px 16px',
                      transition: 'border 0.2s ease'
                    }}
                  >
                    {/* Header Row with Toggle Button */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
                        <span className="edu-badge edu-badge-amber" style={{ fontSize: '0.68rem' }}>
                          {issue.severity}
                        </span>
                        <div>
                          <strong style={{ fontSize: '0.86rem', color: 'var(--text-dark)', display: 'block' }}>
                            {issue.category} • {issue.element}
                          </strong>
                          {!isOpen && (
                            <span style={{ fontSize: '0.78rem', color: '#925f00' }}>
                              Fix: {issue.pedagogicalRecommendation?.slice(0, 80)}...
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {issue.applied ? (
                          <span className="edu-badge edu-badge-green" style={{ fontSize: '0.72rem' }}>
                            <Check size={12} /> Applied
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="edu-btn edu-btn-amber"
                            onClick={() => onApplyFix(issue, 'layer2')}
                            style={{ padding: '5px 12px', fontSize: '0.74rem' }}
                          >
                            <Sparkles size={12} />
                            <span>Apply Fix</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="edu-btn edu-btn-outline"
                          onClick={() => toggleQC2Issue(idx)}
                          style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                        >
                          <span>{isOpen ? 'Details ▴' : 'Details ▾'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Detailed Content (Only shown when clicked) */}
                    {isOpen && (
                      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                        <p style={{ margin: '0 0 6px', fontSize: '0.82rem', color: 'var(--text-dark)' }}>
                          <strong>Pedagogical Observation:</strong> {issue.issue}
                        </p>
                        <p style={{ margin: '0 0 8px', fontSize: '0.82rem', color: '#925f00', fontWeight: 600 }}>
                          <strong>Recommendation:</strong> {issue.pedagogicalRecommendation}
                        </p>

                        {issue.suggestedAddition && (
                          <div style={{
                            background: '#f8fafc',
                            border: '1px solid var(--border-light)',
                            padding: '10px',
                            borderRadius: '4px',
                            fontSize: '0.78rem',
                            marginTop: '6px'
                          }}>
                            <code style={{ whiteSpace: 'pre-wrap', color: 'var(--text-dark)' }}>{issue.suggestedAddition}</code>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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
      padding: '10px 12px'
    }}>
      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
        {label}
      </span>
      <strong style={{ fontSize: '1.2rem', color: '#ffb606', fontFamily: 'var(--font-heading)' }}>
        {value}
      </strong>
    </div>
  );
}
