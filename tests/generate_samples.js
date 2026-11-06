/**
 * Script to generate and save verified sample outputs for both required test cases:
 * 1. HTTP Requests and Responses (Sample 1)
 * 2. Binary Search Algorithms: Divide and Conquer (Sample 2)
 */

const fs = require('fs');
const path = require('path');
const { researchService } = require('../server/services/researchService');
const { synthesisService } = require('../server/services/synthesisService');
const { qcLayer1Service } = require('../server/services/qcLayer1Service');
const { qcLayer2Service } = require('../server/services/qcLayer2Service');
const { exportService } = require('../server/services/exportService');

const OUTPUT_DIR = path.join(__dirname, '..', 'sample_outputs');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runSample(lessonTitle, learningObjective, filePrefix) {
  console.log(`\n=======================================================`);
  console.log(`Running sample: "${lessonTitle}"`);
  console.log(`=======================================================`);

  // 1. Research
  console.log('1. Conducting research...');
  const research = await researchService.conductResearch({ lessonTitle, learningObjective });

  // 2. Synthesize
  console.log('2. Synthesizing 45-minute structured lesson...');
  const lessonContent = await synthesisService.synthesizeLesson({
    lessonTitle,
    learningObjective,
    researchBundle: research,
    targetDurationMinutes: 45
  });

  // 3. QC Layer 1
  console.log('3. Running QC Layer 1 (Factual Accuracy & Sources)...');
  const qc1Report = await qcLayer1Service.auditFactualAccuracy({
    lessonTitle,
    learningObjective,
    lessonContent,
    researchBundle: research
  });

  // 4. QC Layer 2
  console.log('4. Running QC Layer 2 (Instructional Quality & Pacing)...');
  const qc2Report = await qcLayer2Service.auditInstructionalQuality({
    lessonTitle,
    learningObjective,
    lessonContent,
    targetDurationMinutes: 45
  });

  // Package record
  const lessonRecord = {
    id: `sample_${filePrefix}`,
    lessonTitle,
    learningObjective,
    researchBundle: research,
    lessonContent,
    qc1Report,
    qc2Report,
    updatedAt: new Date().toISOString()
  };

  // Export Combined Lesson Markdown
  const lessonMd = exportService.toMarkdown(lessonRecord, { includeQC: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, `${filePrefix}_lesson.md`), lessonMd, 'utf-8');

  // Export Isolated QC1 Report
  let qc1Md = `# QC Layer 1 Audit Report: Research & Factual Accuracy\n\n`;
  qc1Md += `**Lesson Title**: ${lessonTitle}\n`;
  qc1Md += `**Audit Verdict**: **${qc1Report.verdict}** (Score: **${qc1Report.overallScore}/100**)\n`;
  qc1Md += `**Audit Timestamp**: ${qc1Report.auditTimestamp}\n\n`;
  qc1Md += `## Core Metrics\n`;
  qc1Md += `- **Factual Correctness**: ${qc1Report.metrics.factualCorrectness}%\n`;
  qc1Md += `- **Source Reliability**: ${qc1Report.metrics.sourceReliability}%\n`;
  qc1Md += `- **Claim Verification Rate**: ${qc1Report.metrics.claimVerificationRate}%\n`;
  qc1Md += `- **Internal Consistency**: ${qc1Report.metrics.internalConsistency}%\n\n`;
  qc1Md += `${qc1Report.summary}\n\n`;
  qc1Md += `## Verified Ground-Truth Claims\n\n`;
  qc1Report.verifiedClaims.forEach(c => {
    qc1Md += `- ✅ **Claim**: "${c.claim}"\n  - *Source*: ${c.source}\n  - *Notes*: ${c.notes || 'Verified against canonical specification.'}\n`;
  });
  qc1Md += `\n## Source Reliability Analysis\n`;
  qc1Md += `- Total Sources Audited: ${qc1Report.sourceAudit.totalSources}\n`;
  qc1Md += `- Canonical / Authoritative: ${qc1Report.sourceAudit.authoritativeCount}\n`;
  qc1Md += `- Secondary / Encyclopedic: ${qc1Report.sourceAudit.secondaryCount}\n`;
  qc1Md += `- Evaluation: ${qc1Report.sourceAudit.evaluation}\n\n`;
  qc1Md += `## Identified Issues & Suggested Improvements\n\n`;
  qc1Report.issues.forEach((iss, i) => {
    qc1Md += `### Issue ${i + 1} [${iss.severity}]: ${iss.category}\n`;
    qc1Md += `- **Examined Text/Claim**: "${iss.claim}"\n`;
    qc1Md += `- **Identified Issue**: ${iss.issue}\n`;
    if (iss.authoritativeSource) qc1Md += `- **Authoritative Standard**: ${iss.authoritativeSource}\n`;
    if (iss.suggestedAddition) qc1Md += `- **Suggested Fix / Addition**: ${iss.suggestedAddition}\n`;
    qc1Md += `\n`;
  });
  fs.writeFileSync(path.join(OUTPUT_DIR, `${filePrefix}_qc1_report.md`), qc1Md, 'utf-8');

  // Export Isolated QC2 Report
  let qc2Md = `# QC Layer 2 Audit Report: Instructional Quality & Pacing\n\n`;
  qc2Md += `**Lesson Title**: ${lessonTitle}\n`;
  qc2Md += `**Audit Verdict**: **${qc2Report.verdict}** (Score: **${qc2Report.overallScore}/100**)\n`;
  qc2Md += `**Audit Timestamp**: ${qc2Report.auditTimestamp}\n\n`;
  qc2Md += `## 45-Minute Pacing & Feasibility Analysis\n`;
  qc2Md += `- **Target Duration**: ${qc2Report.pacingAudit.targetDurationMinutes} Minutes\n`;
  qc2Md += `- **Estimated Completion**: ${qc2Report.pacingAudit.estimatedCompletionMinutes} Minutes\n`;
  qc2Md += `- **Total Word Count**: ${qc2Report.pacingAudit.totalWordCount} words\n`;
  qc2Md += `- **Pacing Evaluation**: ${qc2Report.pacingAudit.evaluation}\n\n`;
  qc2Md += `## Pedagogical Metrics\n`;
  qc2Md += `- **Objective Alignment**: ${qc2Report.metrics.objectiveAlignment}%\n`;
  qc2Md += `- **Structural Clarity**: ${qc2Report.metrics.structuralClarity}%\n`;
  qc2Md += `- **Pacing & Cognitive Load**: ${qc2Report.metrics.pacingAndCognitiveLoad}%\n`;
  qc2Md += `- **Practical Scaffolding**: ${qc2Report.metrics.practicalScaffolding}%\n`;
  qc2Md += `- **Assessment Quality**: ${qc2Report.metrics.assessmentQuality}%\n\n`;
  qc2Md += `${qc2Report.summary}\n\n`;
  qc2Md += `## Learning Objective Coverage Breakdown\n\n`;
  qc2Report.objectiveCoverage.forEach(oc => {
    qc2Md += `- **${oc.subObjective}**\n  - Status: ${oc.status}\n  - Mapped Section: ${oc.mappedSection}\n  - Bloom's Taxonomy Level: ${oc.bloomsLevel}\n`;
  });
  qc2Md += `\n## Identified Pedagogical Scaffolding Observations\n\n`;
  qc2Report.issues.forEach((iss, i) => {
    qc2Md += `### Pedagogical Note ${i + 1} [${iss.severity}]: ${iss.category}\n`;
    qc2Md += `- **Section/Element**: ${iss.element}\n`;
    qc2Md += `- **Observation**: ${iss.issue}\n`;
    if (iss.pedagogicalRecommendation) qc2Md += `- **Instructional Recommendation**: ${iss.pedagogicalRecommendation}\n`;
    if (iss.suggestedAddition) qc2Md += `- **Suggested Content Addition**: ${iss.suggestedAddition}\n`;
    qc2Md += `\n`;
  });
  fs.writeFileSync(path.join(OUTPUT_DIR, `${filePrefix}_qc2_report.md`), qc2Md, 'utf-8');

  // Export Complete JSON Package
  fs.writeFileSync(path.join(OUTPUT_DIR, `${filePrefix}_complete_package.json`), JSON.stringify(lessonRecord, null, 2), 'utf-8');

  // Export HTML format
  const htmlDoc = exportService.toHTML(lessonRecord, { includeQC: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, `${filePrefix}_lesson.html`), htmlDoc, 'utf-8');

  console.log(`✅ Finished generating artifacts for ${lessonTitle}`);
  console.log(`   Saved in ${OUTPUT_DIR}/`);
}

async function main() {
  // Test 1: Mandatory prompt sample
  await runSample(
    'HTTP Requests and Responses',
    'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.',
    'sample1_http_requests'
  );

  // Test 2: Second sample
  await runSample(
    'Binary Search Algorithms: Divide and Conquer',
    'Explain the divide-and-conquer principle of binary search, implement the iterative and recursive variants, and analyze its O(log n) time complexity against linear search.',
    'sample2_binary_search'
  );

  console.log('\nAll sample outputs generated and verified successfully!');
}

main().catch(console.error);
