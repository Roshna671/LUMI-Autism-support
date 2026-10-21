/**
 * LUMI Test Suite: Adaptive Rules, Screening Calculations, and Plan Generator
 * Run with: node test/adaptiveAndScreening.test.js
 */

import assert from 'node:assert';
import { evaluateScreeningResponses } from '../src/data/developmentalScreening.js';
import { generateIndividualizedPlan } from '../src/utils/activityPlanner.js';
import { analyzeAdaptiveRecommendations, createSessionRecord } from '../src/utils/adaptiveEngine.js';
import { validateReportFile } from '../src/utils/reportExtractor.js';

console.log('🧪 Starting LUMI Automated Logic & Safety Verification...');

// ── Test 1: Screening Evaluation (Toddler vs. CAST Pathway & Non-Diagnostic Guarantee) ──
console.log('\n[Test 1] Screening Evaluation Logic:');
{
  const toddlerResponses = { t_soc_1: 2, t_soc_2: 1, t_com_1: 2, t_play_1: 1 };
  const toddlerResult = evaluateScreeningResponses(3, toddlerResponses);
  assert.strictEqual(toddlerResult.agePathway, 'toddler', 'Should select toddler pathway for age < 4');
  assert.ok(toddlerResult.disclaimer.includes('educational support tool'), 'Must include non-diagnostic disclaimer');
  assert.ok(!toddlerResult.disclaimer.includes('severity: severe'), 'Must NOT assert diagnostic severity');
  console.log('  ✓ Toddler pathway correctly selected with ethical non-diagnostic disclaimer');

  const castResponses = { cast_1: 2, cast_2: 1, cast_3: 2, cast_4: 2 };
  const castResult = evaluateScreeningResponses(6, castResponses);
  assert.strictEqual(castResult.agePathway, 'child_cast', 'Should select CAST pathway for age >= 4');
  assert.ok(castResult.professionalFollowUpSuggested !== undefined, 'Must provide follow-up suggestion');
  console.log('  ✓ CAST-referenced pathway correctly applied for age 6 with transparent follow-up guidance');
}

// ── Test 2: Individualized Plan Generation (Personalized, not Severity-Based) ──
console.log('\n[Test 2] Individualized Plan Generator:');
{
  const testProfile = {
    name: 'Rohan',
    age: 4,
    communicationStyle: 'emerging',
    interests: ['Dinosaurs', 'Animals'],
    sensoryPreferences: { soundSensitivity: 'sensitive_low_volume' }
  };
  const testHistory = { caregiverConcerns: ['speech_communication', 'sensory'] };

  const plan = generateIndividualizedPlan(testProfile, testHistory, null, []);
  assert.ok(plan.activities.length >= 3, 'Should generate at least 3 supportive daily activities');

  const hasSpeech = plan.activities.some((a) => a.activityId === 'speech');
  const hasSensory = plan.activities.some((a) => a.activityId === 'sensory');
  assert.ok(hasSpeech, 'Emerging speech concern must queue Speech Mirror activity');
  assert.ok(hasSensory, 'Sensory sensitivity must queue Sensory Calm activity');

  // Verify rationale is present and human-readable
  plan.activities.forEach((act) => {
    assert.ok(act.rationale && act.rationale.length > 10, `Activity ${act.name} must have explainable rationale`);
  });
  console.log('  ✓ Plan adapts to emerging speech and sensory needs with clear explainable rationales');
}

// ── Test 3: Transparent Multi-Session Adaptive Practice Rules ──
console.log('\n[Test 3] Adaptive Engine Multi-Session Pacing:');
{
  // Scenario A: Insufficient data (<2 sessions)
  const singleSession = [createSessionRecord({ activityId: 'speech', attempts: 5, successfulResponses: 5 })];
  const adviceSingle = analyzeAdaptiveRecommendations('speech', singleSession);
  assert.strictEqual(adviceSingle.action, 'maintain_level', 'Must not jump difficulty after only 1 session');
  assert.strictEqual(adviceSingle.status, 'insufficient_data');
  console.log('  ✓ Correctly maintains baseline when fewer than 2 sessions recorded');

  // Scenario B: Repeated High Mastery (>=85% success over multiple sessions)
  const masterSessions = [
    createSessionRecord({ activityId: 'speech', attempts: 5, successfulResponses: 5, hintsUsed: 0 }),
    createSessionRecord({ activityId: 'speech', attempts: 6, successfulResponses: 6, hintsUsed: 0 }),
    createSessionRecord({ activityId: 'speech', attempts: 5, successfulResponses: 5, hintsUsed: 0 })
  ];
  const adviceMaster = analyzeAdaptiveRecommendations('speech', masterSessions);
  assert.strictEqual(adviceMaster.action, 'offer_next_level', 'Suggests advancement when comfortable');
  console.log('  ✓ Suggests optional next level after consistent comfortable mastery');

  // Scenario C: Fatigue / Break signal
  const fatigueSessions = [
    createSessionRecord({ activityId: 'speech', attempts: 4, successfulResponses: 2, breaksRequested: 1, childEngagement: 'fatigued' }),
    createSessionRecord({ activityId: 'speech', attempts: 3, successfulResponses: 1, breaksRequested: 1, childEngagement: 'fatigued' })
  ];
  const adviceFatigue = analyzeAdaptiveRecommendations('speech', fatigueSessions);
  assert.strictEqual(adviceFatigue.action, 'shorten_or_calm', 'Recommends calm pause when fatigue signaled');
  console.log('  ✓ Proactively suggests sensory pause and shorter sessions when fatigue signals occur');
}

// ── Test 4: Document Validation & Safe File Rules ──
console.log('\n[Test 4] Document Validation & File Constraints:');
{
  const invalidFileType = { name: 'virus.exe', type: 'application/x-msdownload', size: 2000 };
  const valType = validateReportFile(invalidFileType);
  assert.strictEqual(valType.valid, false, 'Must reject unsupported binary executable types');

  const tooLargeFile = { name: 'huge_scan.pdf', type: 'application/pdf', size: 25 * 1024 * 1024 };
  const valSize = validateReportFile(tooLargeFile);
  assert.strictEqual(valSize.valid, false, 'Must reject files exceeding 15MB');

  const validPDF = { name: 'speech_evaluation.pdf', type: 'application/pdf', size: 1024 * 500 };
  const valGood = validateReportFile(validPDF);
  assert.strictEqual(valGood.valid, true, 'Accepts valid PDF under 15MB');
  console.log('  ✓ Document upload validation safeguards enforced correctly');
}

console.log('\n🎉 ALL 4 TEST SUITES PASSED CLEANLY (100% assertions verified)!\n');
