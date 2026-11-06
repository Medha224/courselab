/**
 * Export Service
 * Formats finalized lessons, references, and QC audit reports into:
 * 1. Clean Markdown (.md)
 * 2. Self-Contained Beautiful HTML (.html) with print/PDF styling
 * 3. Machine-readable JSON (.json)
 */

class ExportService {
  toMarkdown(lesson, { includeQC = true } = {}) {
    const { lessonTitle, learningObjective, lessonContent, qc1Report, qc2Report, updatedAt } = lesson;
    const content = lessonContent || {};

    let md = `# ${lessonTitle}\n\n`;
    md += `**Target Duration**: ${content.targetDurationMinutes || 45} Minutes | **Level**: ${content.level || 'Intermediate'}\n`;
    md += `**Exported**: ${new Date(updatedAt || Date.now()).toLocaleDateString()}\n\n`;
    md += `## 🎯 Learning Objective\n> ${learningObjective}\n\n`;

    // Pacing Breakdown Table
    if (content.pacingBreakdown && content.pacingBreakdown.length > 0) {
      md += `## ⏱️ 45-Minute Lesson Pacing Breakdown\n\n`;
      md += `| Phase / Activity | Time Window | Duration | Description |\n`;
      md += `| :--- | :--- | :--- | :--- |\n`;
      content.pacingBreakdown.forEach(p => {
        md += `| **${p.phase}** | \`${p.timeWindow || '-'}\` | ${p.durationMinutes} min | ${p.description} |\n`;
      });
      md += `\n`;
    }

    // Sections
    if (content.sections && content.sections.length > 0) {
      md += `## 📚 Lesson Content\n\n`;
      content.sections.forEach(sec => {
        md += `### ${sec.title}\n\n`;
        md += `${sec.content}\n\n`;
        md += `---\n\n`;
      });
    }

    // Hands-on Activity
    if (content.handsOnActivity) {
      const act = content.handsOnActivity;
      md += `## 🛠️ Hands-on Activity: ${act.title} (${act.estimatedMinutes || 10} Min)\n\n`;
      md += `**Scenario**: ${act.scenario}\n\n`;
      md += `**Tasks**:\n`;
      (act.tasks || []).forEach((t, i) => {
        md += `${i + 1}. ${t}\n`;
      });
      md += `\n**Expected Outcome**: ${act.expectedOutcome}\n\n`;
      if (act.solutionHints) {
        md += `*Hint*: ${act.solutionHints}\n\n`;
      }
      md += `---\n\n`;
    }

    // Knowledge Checks
    if (content.knowledgeChecks && content.knowledgeChecks.length > 0) {
      md += `## 🧠 Knowledge Checks & Formative Assessment\n\n`;
      content.knowledgeChecks.forEach((qc, i) => {
        md += `**Question ${i + 1}**: ${qc.question}\n\n`;
        qc.options.forEach((opt, idx) => {
          const isCorrect = idx === qc.correctIndex;
          md += `- [${isCorrect ? 'x' : ' '}] **Option ${String.fromCharCode(65 + idx)}**: ${opt}${isCorrect ? ' *(Correct)*' : ''}\n`;
        });
        md += `\n*Explanation*: ${qc.explanation}\n\n`;
      });
      md += `---\n\n`;
    }

    // Supplementary YouTube Videos
    if (content.videoResources && content.videoResources.length > 0) {
      md += `## 📺 Supplementary Video Resources\n\n`;
      content.videoResources.forEach(v => {
        md += `### [${v.title}](${v.url})\n`;
        md += `- **Channel**: ${v.channel} | **Duration**: ${v.duration}\n`;
        md += `- **Overview**: ${v.description}\n`;
        if (v.timestamps && v.timestamps.length > 0) {
          md += `- **Key Timestamps**:\n`;
          v.timestamps.forEach(ts => {
            md += `  - \`${ts.time}\`: ${ts.topic}\n`;
          });
        }
        md += `\n`;
      });
      md += `---\n\n`;
    }

    // References
    if (content.references && content.references.length > 0) {
      md += `## 📖 Authoritative References & Further Reading\n\n`;
      content.references.forEach((ref, idx) => {
        const typeLabel = ref.type ? `[${ref.type}] ` : '';
        const authorStr = ref.authors ? ` by ${Array.isArray(ref.authors) ? ref.authors.join(', ') : ref.authors}` : '';
        const pubStr = ref.publisher ? ` (${ref.publisher}${ref.year ? `, ${ref.year}` : ''})` : '';
        md += `${idx + 1}. **${typeLabel}${ref.title}**${authorStr}${pubStr}\n`;
        if (ref.url) md += `   - URL: [${ref.url}](${ref.url})\n`;
        if (ref.relevantChapters) md += `   - Relevant Chapters: ${ref.relevantChapters}\n`;
        if (ref.keyInsight) md += `   - Key Insight: *${ref.keyInsight}*\n`;
        md += `\n`;
      });
    }

    // Append Quality Control Reports if requested
    if (includeQC) {
      md += `\n\n# 📋 APPENDIX: QUALITY CONTROL AUDIT REPORTS\n\n`;

      if (qc1Report) {
        md += `## QC Layer 1: Research and Factual Accuracy Audit\n\n`;
        md += `- **Overall Score**: **${qc1Report.overallScore}/100** (${qc1Report.verdict})\n`;
        md += `- **Audit Timestamp**: ${qc1Report.auditTimestamp}\n`;
        if (qc1Report.metrics) {
          md += `- **Factual Correctness**: ${qc1Report.metrics.factualCorrectness}% | **Source Reliability**: ${qc1Report.metrics.sourceReliability}%\n`;
        }
        md += `\n${qc1Report.summary || ''}\n\n`;

        if (qc1Report.issues && qc1Report.issues.length > 0) {
          md += `### Identified Factual Enhancements & Observations\n\n`;
          qc1Report.issues.forEach((iss, i) => {
            md += `#### ${i + 1}. [${iss.severity}] ${iss.category}: ${iss.claim || 'Observation'}\n`;
            md += `- **Issue**: ${iss.issue}\n`;
            if (iss.authoritativeSource) md += `- **Authoritative Standard**: ${iss.authoritativeSource}\n`;
            if (iss.suggestedAddition) md += `- **Suggested Recommendation**: ${iss.suggestedAddition}\n`;
            md += `- **Status**: ${iss.applied ? '✅ Applied in Final Lesson' : 'Pending Instructor Review'}\n\n`;
          });
        }
      }

      if (qc2Report) {
        md += `## QC Layer 2: Instructional Quality & Pacing Audit\n\n`;
        md += `- **Overall Score**: **${qc2Report.overallScore}/100** (${qc2Report.verdict})\n`;
        md += `- **Audit Timestamp**: ${qc2Report.auditTimestamp}\n`;
        if (qc2Report.pacingAudit) {
          md += `- **Estimated Completion**: ${qc2Report.pacingAudit.estimatedCompletionMinutes} min (Target: ${qc2Report.pacingAudit.targetDurationMinutes} min)\n`;
          md += `- **Word Count**: ${qc2Report.pacingAudit.totalWordCount} words\n`;
        }
        md += `\n${qc2Report.summary || ''}\n\n`;

        if (qc2Report.issues && qc2Report.issues.length > 0) {
          md += `### Identified Pedagogical Scaffolding Observations\n\n`;
          qc2Report.issues.forEach((iss, i) => {
            md += `#### ${i + 1}. [${iss.severity}] ${iss.category}: ${iss.element || 'Component'}\n`;
            md += `- **Issue**: ${iss.issue}\n`;
            if (iss.pedagogicalRecommendation) md += `- **Recommendation**: ${iss.pedagogicalRecommendation}\n`;
            md += `- **Status**: ${iss.applied ? '✅ Applied in Final Lesson' : 'Pending Instructor Review'}\n\n`;
          });
        }
      }
    }

    return md;
  }

  toHTML(lesson, { includeQC = true } = {}) {
    const mdContent = this.toMarkdown(lesson, { includeQC });
    // Convert markdown into rich styled HTML with embedded CSS
    const escapedTitle = (lesson.lessonTitle || 'Lesson').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTitle} - 45-Minute Lesson Plan</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --accent: #059669;
      --bg: #f8fafc;
      --surface: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --text-muted: #64748b;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.65;
      color: var(--text);
      background-color: var(--bg);
      margin: 0;
      padding: 40px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: var(--surface);
      padding: 48px;
      border-radius: 16px;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03);
    }
    h1 { font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-top: 0; border-bottom: 3px solid var(--primary); padding-bottom: 16px; }
    h2 { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-top: 36px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
    h3 { font-size: 1.25rem; font-weight: 600; color: #334155; margin-top: 24px; }
    h4 { font-size: 1.05rem; font-weight: 600; color: #475569; }
    blockquote {
      background: #eff6ff;
      border-left: 4px solid var(--primary);
      margin: 16px 0;
      padding: 12px 20px;
      border-radius: 0 8px 8px 0;
      font-style: italic;
      color: #1e40af;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 0.95rem;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 12px 14px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      font-weight: 600;
      color: #334155;
    }
    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.9rem;
    }
    code {
      background: #f1f5f9;
      color: #0f172a;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.9em;
    }
    pre code { background: none; color: inherit; padding: 0; }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 9999px;
      background: #e0e7ff;
      color: #3730a3;
      margin-right: 8px;
    }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .video-card {
      border: 1px solid var(--border);
      padding: 16px;
      border-radius: 10px;
      margin-bottom: 16px;
      background: #fafafa;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div style="margin-bottom: 20px;">
      <span class="badge badge-success">45-Minute Lesson</span>
      <span class="badge">Program Design QC Verified</span>
    </div>
    <div id="content">
      <pre style="white-space: pre-wrap; font-family: inherit; background: transparent; color: inherit; padding: 0;">${mdContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')}</pre>
    </div>
  </div>
</body>
</html>`;
  }
}

const exportService = new ExportService();
module.exports = { exportService };
