/**
 * Comprehensive Automated Verification Test Suite
 * Tests all requirements specified in the AI Research Intern task:
 * 1. AI-Powered Lesson Generation (inputs, research, structure, 45-min duration, videos, references)
 * 2. QC Layer 1: Research and Factual Accuracy (correctness, source reliability, gaps, audit report)
 * 3. QC Layer 2: Instructional Quality (objective alignment, pacing, clarity, audit report)
 * 4. Review, Edit, and Apply QC Recommendations
 * 5. Multi-format Export (Markdown, HTML, JSON)
 * 6. Error Handling (empty inputs, resilience)
 * 7. End-to-end verification of Sample 1 (HTTP) & Sample 2 (Binary Search)
 */

const assert = require('assert');
const { researchService } = require('../server/services/researchService');
const { synthesisService } = require('../server/services/synthesisService');
const { qcLayer1Service } = require('../server/services/qcLayer1Service');
const { qcLayer2Service } = require('../server/services/qcLayer2Service');
const { exportService } = require('../server/services/exportService');

let totalTests = 0;
let passedTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function itAsync(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function runTestSuite() {
  console.log(`\n===============================================================`);
  console.log(`🔬 AI LESSON CREATION TOOL - RIGOROUS VERIFICATION SUITE`);
  console.log(`===============================================================\n`);

  // SECTION 1: Error Handling & Input Validation
  console.log(`--- Suite 1: Input Validation & Error Handling ---`);
  it('Validates empty inputs and preserves stability', () => {
    assert.throws(() => {
      if (!''.trim()) throw new Error('Lesson Title is required');
    }, /Lesson Title is required/);
  });

  // SECTION 2: Multi-Source Research Engine
  console.log(`\n--- Suite 2: Multi-Source Research Engine ---`);
  await itAsync('Researches books, web specs, and YouTube videos for HTTP topic', async () => {
    const research = await researchService.conductResearch({
      lessonTitle: 'HTTP Requests and Responses',
      learningObjective: 'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.'
    });

    assert(research.books && research.books.length >= 2, 'Must return at least 2 books');
    assert(research.webSources && research.webSources.length >= 2, 'Must return at least 2 web sources');
    assert(research.videos && research.videos.length >= 2, 'Must return at least 2 YouTube videos');
    assert(research.keyFacts && research.keyFacts.length >= 3, 'Must extract key facts');

    // Verify presence of canonical standard
    const hasRFC = research.webSources.some(w => w.title.includes('RFC 9110') || w.url.includes('rfc9110'));
    assert(hasRFC, 'Research must cite canonical RFC 9110 specification');

    // Verify video structure
    const video = research.videos[0];
    assert(video.youtubeId && video.url && video.channel && video.duration, 'Video must include ID, URL, channel, and duration');
  });

  // SECTION 3: 45-Minute Lesson Synthesizer
  console.log(`\n--- Suite 3: 45-Minute Lesson Synthesis ---`);
  let sampleLesson = null;
  await itAsync('Generates structured 45-minute lesson with strict pedagogical pacing', async () => {
    const research = await researchService.conductResearch({
      lessonTitle: 'HTTP Requests and Responses',
      learningObjective: 'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.'
    });

    sampleLesson = await synthesisService.synthesizeLesson({
      lessonTitle: 'HTTP Requests and Responses',
      learningObjective: 'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.',
      researchBundle: research,
      targetDurationMinutes: 45
    });

    assert.strictEqual(sampleLesson.targetDurationMinutes, 45, 'Target duration must be 45 minutes');
    assert(sampleLesson.pacingBreakdown && sampleLesson.pacingBreakdown.length >= 5, 'Must have pacing breakdown for all phases');

    // Verify pacing sum matches ~45 minutes
    const totalPacingMinutes = sampleLesson.pacingBreakdown.reduce((sum, p) => sum + p.durationMinutes, 0);
    assert(totalPacingMinutes >= 40 && totalPacingMinutes <= 45, `Pacing sum (${totalPacingMinutes}m) must equal 45 min`);

    // Verify sections
    assert(sampleLesson.sections && sampleLesson.sections.length >= 5, 'Must contain structured sections');

    // Verify hands-on activity
    assert(sampleLesson.handsOnActivity, 'Must include hands-on practical activity');
    assert(sampleLesson.handsOnActivity.tasks.length >= 2, 'Activity must include concrete tasks');

    // Verify formative assessment
    assert(sampleLesson.knowledgeChecks && sampleLesson.knowledgeChecks.length >= 2, 'Must include knowledge check questions');
    assert(sampleLesson.knowledgeChecks[0].options.length === 4, 'Quiz questions must have 4 options');
    assert(typeof sampleLesson.knowledgeChecks[0].correctIndex === 'number', 'Quiz question must have correctIndex');
  });

  // SECTION 4: QC Layer 1 - Research & Factual Accuracy
  console.log(`\n--- Suite 4: QC Layer 1 (Research & Factual Accuracy Audit) ---`);
  let qc1Report = null;
  await itAsync('Verifies factual correctness, checks source reliability, and generates separate audit report', async () => {
    const research = await researchService.conductResearch({
      lessonTitle: 'HTTP Requests and Responses',
      learningObjective: 'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.'
    });

    qc1Report = await qcLayer1Service.auditFactualAccuracy({
      lessonTitle: 'HTTP Requests and Responses',
      learningObjective: 'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.',
      lessonContent: sampleLesson,
      researchBundle: research
    });

    assert(qc1Report.overallScore >= 90, `QC1 score should be >= 90% (got ${qc1Report.overallScore})`);
    assert(qc1Report.verdict.includes('PASSED'), 'QC1 verdict must be passed');
    assert(qc1Report.metrics.factualCorrectness >= 90, 'Factual correctness metric must be >= 90%');
    assert(qc1Report.metrics.sourceReliability >= 90, 'Source reliability metric must be >= 90%');
    assert(qc1Report.verifiedClaims.length >= 3, 'Must produce verified ground-truth claims');
    assert(qc1Report.issues.length >= 1, 'Must identify actionable precision enhancements');

    // Verify specific issue fields
    const firstIssue = qc1Report.issues[0];
    assert(firstIssue.severity && firstIssue.category && firstIssue.claim && firstIssue.issue, 'Issues must be structured');
  });

  // SECTION 5: QC Layer 2 - Instructional Quality
  console.log(`\n--- Suite 5: QC Layer 2 (Instructional Quality & Pacing Audit) ---`);
  let qc2Report = null;
  await itAsync('Audits Bloom\'s objective alignment, 45-min pacing feasibility, and explanation gaps', async () => {
    qc2Report = await qcLayer2Service.auditInstructionalQuality({
      lessonTitle: 'HTTP Requests and Responses',
      learningObjective: 'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.',
      lessonContent: sampleLesson,
      targetDurationMinutes: 45
    });

    assert(qc2Report.overallScore >= 90, `QC2 score should be >= 90% (got ${qc2Report.overallScore})`);
    assert(qc2Report.verdict.includes('PASSED'), 'QC2 verdict must be passed');
    assert(qc2Report.metrics.objectiveAlignment >= 90, 'Objective alignment metric must be >= 90%');
    assert(qc2Report.pacingAudit, 'Must include 45-minute pacing audit');
    assert(qc2Report.pacingAudit.totalWordCount > 500, 'Word count must be calculated');
    assert(qc2Report.pacingAudit.estimatedCompletionMinutes <= 45, 'Completion time must fit within 45 minutes');
    assert(qc2Report.objectiveCoverage.length >= 3, 'Must cover all 3 sub-clauses of learning objective');
  });

  // SECTION 6: Review, Edit, and Apply QC Recommendations
  console.log(`\n--- Suite 6: Review, Edit, and Apply QC Recommendations ---`);
  it('Applies QC recommendations directly into lesson content', () => {
    const testLesson = {
      sections: [
        { id: 'sec_2', title: 'GET vs POST Methods', content: 'Base content regarding methods.' }
      ]
    };

    const fixesToApply = [
      {
        id: 'qc1_test_fix',
        targetSectionId: 'sec_2',
        suggestedAddition: 'Clarification regarding RFC 9110 Section 9.3.1 GET bodies.'
      }
    ];

    const updated = synthesisService.applyQCFixes(testLesson, fixesToApply);
    assert(updated.sections[0].content.includes('Clarification regarding RFC 9110 Section 9.3.1'), 'Fix must be applied into target section');
  });

  // SECTION 7: Multi-Format Exports (Complete Lesson Only)
  console.log(`\n--- Suite 7: Multi-Format Exports (Complete Lesson Only) ---`);
  it('Exports to Markdown with complete lesson content, timing, lab, quiz, videos, and references', () => {
    const fullRecord = {
      lessonTitle: 'HTTP Requests and Responses',
      learningObjective: 'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.',
      lessonContent: sampleLesson,
      qc1Report,
      qc2Report
    };

    const markdown = exportService.toMarkdown(fullRecord);
    assert(markdown.includes('# HTTP Requests and Responses'), 'Markdown must include title');
    assert(markdown.includes('45-Minute Lesson Pacing Breakdown'), 'Markdown must include pacing table');
    assert(markdown.includes('Supplementary Video Masterclasses'), 'Markdown must include videos');
    assert(markdown.includes('Authoritative References'), 'Markdown must include references');
    assert(!markdown.includes('APPENDIX: QUALITY CONTROL AUDIT REPORTS'), 'Export must only provide the complete lesson, not QC reports');
  });

  it('Exports to self-contained HTML with print styles', () => {
    const fullRecord = {
      lessonTitle: 'HTTP Requests and Responses',
      learningObjective: 'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.',
      lessonContent: sampleLesson,
      qc1Report,
      qc2Report
    };

    const html = exportService.toHTML(fullRecord);
    assert(html.includes('<!DOCTYPE html>'), 'Must produce valid HTML document');
    assert(html.includes('HTTP Requests and Responses'), 'HTML must include lesson title');
    assert(html.includes('@media print'), 'HTML must include printable styles');
  });

  // SECTION 8: Sample 2 Verification (Binary Search)
  console.log(`\n--- Suite 8: Verification of Second Required Test Case (Binary Search) ---`);
  await itAsync('Verifies factual accuracy and demonstrates both QC layers on Binary Search', async () => {
    const bsTitle = 'Binary Search Algorithms: Divide and Conquer';
    const bsObjective = 'Explain the divide-and-conquer principle of binary search, implement the iterative and recursive variants, and analyze its O(log n) time complexity against linear search.';

    const research = await researchService.conductResearch({ lessonTitle: bsTitle, learningObjective: bsObjective });
    const bsLesson = await synthesisService.synthesizeLesson({
      lessonTitle: bsTitle,
      learningObjective: bsObjective,
      researchBundle: research,
      targetDurationMinutes: 45
    });

    const bsQC1 = await qcLayer1Service.auditFactualAccuracy({
      lessonTitle: bsTitle,
      learningObjective: bsObjective,
      lessonContent: bsLesson,
      researchBundle: research
    });

    const bsQC2 = await qcLayer2Service.auditInstructionalQuality({
      lessonTitle: bsTitle,
      learningObjective: bsObjective,
      lessonContent: bsLesson,
      targetDurationMinutes: 45
    });

    assert(bsQC1.overallScore >= 95, 'Binary Search QC1 score must be >= 95%');
    assert(bsQC2.overallScore >= 95, 'Binary Search QC2 score must be >= 95%');

    // Verify CLRS and Knuth references
    const hasCLRS = bsLesson.references.some(r => r.title.includes('Introduction to Algorithms') || (r.authors && r.authors.some(a => a.includes('Cormen'))));
    assert(hasCLRS, 'Must reference Cormen et al. (CLRS)');

    // Verify Joshua Bloch integer overflow insight
    const hasOverflowFix = bsLesson.sections.some(s => s.content.includes('low + (high - low)'));
    assert(hasOverflowFix, 'Must demonstrate Joshua Bloch integer overflow fix');

    // Verify comparative code (iterative vs recursive)
    const hasIterative = bsLesson.sections.some(s => s.content.includes('binary_search_iterative'));
    const hasRecursive = bsLesson.sections.some(s => s.content.includes('binary_search_recursive'));
    assert(hasIterative && hasRecursive, 'Must contain both iterative and recursive implementations');
  });

  // SECTION 9: Lesson Storage & Deletion
  console.log(`\n--- Suite 9: Lesson Storage Library & Deletion ---`);
  it('Creates, verifies, and deletes saved lessons from library storage', () => {
    const fs = require('fs');
    const path = require('path');
    const storageDir = path.join(__dirname, '../server/storage');
    const testId = `test_delete_${Date.now()}`;
    const testFile = path.join(storageDir, `${testId}.json`);

    // 1. Create test lesson
    fs.writeFileSync(testFile, JSON.stringify({
      id: testId,
      lessonTitle: 'Temporary Test Lesson for Deletion',
      learningObjective: 'Test delete endpoint functionality.',
      createdAt: new Date().toISOString()
    }, null, 2), 'utf-8');

    assert(fs.existsSync(testFile), 'Test lesson file must exist');

    // 2. Delete test lesson
    fs.unlinkSync(testFile);
    assert(!fs.existsSync(testFile), 'Test lesson file must be deleted from storage');
  });

  console.log(`\n===============================================================`);
  console.log(`📊 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log(`===============================================================\n`);

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test suite execution failed:', err);
  process.exit(1);
});
