/**
 * LUMI Individualized Activity Planner
 *
 * Deterministic, strengths-focused activity planner that tailors a daily
 * supportive practice routine for early childhood development.
 *
 * It explicitly avoids:
 * - Guessing an "autism severity" level
 * - Demanding forced eye contact as a universal success criterion
 * - Suppressing harmless stimming or forcing masking
 * - Labeling activities as a "treatment" or "cure" for autism
 *
 * It prioritizes:
 * - Communication access (spoken, emerging, AAC)
 * - Sensory comfort & regulation
 * - Child's special interests & passions
 * - Documented recommendations from caregivers and professionals
 * - Recent session performance and fatigue signals
 */

import { LUMI_ACTIVITIES } from '../data/activityMetadata.js';

export function generateIndividualizedPlan(profile, assessmentHistory, reportData, sessionHistory = []) {
  const age = Number(profile?.age) || 4;
  const communicationStyle = profile?.communicationStyle || 'spoken';
  const interests = profile?.interests || ['Animals', 'Dinosaurs', 'Bubbles'];
  const caregiverConcerns = assessmentHistory?.caregiverConcerns || [];
  const sensoryPrefs = profile?.sensoryPreferences || {};

  // Check recent fatigue / break patterns from sessionHistory
  const recentSessions = sessionHistory.slice(-5);
  const hadRecentFatigue = recentSessions.some(
    (s) => s.childEngagement === 'fatigued' || s.childEngagement === 'overwhelmed' || s.breaksRequested > 0
  );

  // Parse clinical findings from reportData
  const reportDiagnoses = (reportData?.diagnosesDocumented || '').toLowerCase();
  const reportFileName = (reportData?.fileName || '').toLowerCase();
  const combinedReport = `${reportDiagnoses} ${reportFileName}`;

  const hasAutismReport =
    combinedReport.includes('autism') ||
    combinedReport.includes('asd') ||
    combinedReport.includes('spectrum') ||
    assessmentHistory?.autismDiagnosed === 'yes';

  const hasAdhdReport =
    combinedReport.includes('adhd') ||
    combinedReport.includes('attention deficit') ||
    assessmentHistory?.otherConditions?.includes('ADHD');

  const hasSpeechReport =
    combinedReport.includes('speech') ||
    combinedReport.includes('language') ||
    caregiverConcerns.includes('speech_communication');

  const hasSensoryReport =
    combinedReport.includes('sensory') ||
    sensoryPrefs.soundSensitivity === 'sensitive_low_volume' ||
    caregiverConcerns.includes('sensory');

  const selectedPlan = [];

  // Helper to add activity with customized rationale and configuration
  const addActivity = (activityId, customDifficulty, rationale, durationOverride) => {
    const base = LUMI_ACTIVITIES.find((a) => a.id === activityId);
    if (!base || selectedPlan.some((p) => p.activityId === activityId)) return;

    selectedPlan.push({
      activityId: base.id,
      name: base.name,
      emoji: base.emoji,
      route: base.route,
      skillDomain: base.skillDomain,
      difficulty: customDifficulty || (age < 4 ? 'easy' : 'medium'),
      plannedDurationMinutes: durationOverride || (hadRecentFatigue ? Math.max(3, base.typicalDurationMinutes - 2) : (hasAdhdReport ? 3 : base.typicalDurationMinutes)),
      sensoryIntensity: base.sensoryIntensity,
      interactionStyle: base.interactionStyle,
      rationale,
      isCompleted: false,
      recommendedTheme: interests[0] || 'Animals'
    });
  };

  // 1. Visual Attention & Eye Contact Tracking (Always prioritized for Autism & ADHD)
  if (hasAutismReport) {
    addActivity(
      'eye-contact',
      'autism_screen_wide',
      `Adapted to Clinical Report (${reportData?.fileName || 'Autism Case Study'}): Screen-Wide Laptop Gaze Boundaries active. Looking anywhere on the laptop screen counts as valid eye contact, supporting visual attention comfortably without forced social pressure.`,
      hasAdhdReport ? 3 : 4
    );
  } else if (hasAdhdReport) {
    addActivity(
      'eye-contact',
      'fast_paced',
      `Adapted to ADHD Clinical Profile: 30–45s micro-burst visual tracking with high-dopamine neon rainbow road rewards and melodic checkpoint chimes.`,
      3
    );
  } else {
    addActivity(
      'eye-contact',
      'easy',
      `Provides soothing visual tracking of a glowing neon ball through magical checkpoints to support sustained attention comfortably.`
    );
  }

  // 2. Socio-Emotional Understanding (Real Human / Baby Emotion Faces)
  if (hasAutismReport || caregiverConcerns.includes('social_interaction') || caregiverConcerns.includes('play_imagination')) {
    addActivity(
      'emotion',
      age < 4 ? 'easy' : 'medium',
      `Adapted to Case Study: Uses real human and baby expressive faces paired with Lumi mascot mode. Fosters emotional recognition and expression at child's own pace with zero performance anxiety.`
    );
  }

  // 3. Communication & Vocal Practice
  if (hasSpeechReport || communicationStyle === 'emerging' || caregiverConcerns.includes('speech_communication')) {
    addActivity(
      'speech',
      age < 4 ? 'level_1' : 'level_2',
      `Adapted to Speech/Communication Profile: Multi-sensory phoneme and vocal imitation with visual "I Said It" tap assistance to build expressive confidence.`
    );
  } else {
    addActivity(
      'speech',
      'level_2',
      `Builds expressive confidence through low-pressure phoneme and word games with Lumi.`
    );
  }

  // 4. Cognitive / Theme-Based Exploration (Connecting Child Interests)
  const lovesAnimals = interests.some((i) => i.toLowerCase().includes('animal') || i.toLowerCase().includes('dino'));
  if (lovesAnimals || caregiverConcerns.includes('play_imagination') || hasAdhdReport) {
    addActivity(
      'animal-hunt',
      age < 4 ? 'easy' : 'medium',
      `Incorporates ${profile?.name || 'your child'}'s favorite animal interests to practice receptive language, quick scanning, and positive choice-making.`
    );
  } else {
    addActivity(
      'sand-drawing',
      'free_play',
      `Fosters creative expression, fine-motor control, and sensory satisfaction on an open neon sand canvas.`
    );
  }

  // 5. Sensory Regulation & Calming (Especially if sensitive or fatigued)
  if (hasSensoryReport || hasAutismReport || hadRecentFatigue || selectedPlan.length < 4) {
    addActivity(
      'sensory',
      'breathing',
      `Adapted to Sensory Integration Needs: Predictable visual breathing pacing and soothing soundscapes to regulate nervous system and prevent overstimulation.`,
      3
    );
  }

  // 6. Additional Bubble Pop if space
  if (selectedPlan.length < 3) {
    addActivity(
      'bubble-pop',
      'slow',
      `Delivers delightful cause-and-effect tapping practice to celebrate participation and coordination.`
    );
  }

  return {
    planDate: new Date().toISOString().split('T')[0],
    childName: profile?.name || 'Aarav',
    totalEstimatedMinutes: selectedPlan.reduce((acc, p) => acc + p.plannedDurationMinutes, 0),
    hadRecentFatigue,
    activities: selectedPlan,
    notes: 'Caregivers may rearrange, adjust difficulty, or take breaks at any time during practice.',
    adaptedFromReport: Boolean(reportData && (reportData.fileName || reportData.diagnosesDocumented !== 'No diagnosis confirmed in this report')),
    reportFileName: reportData?.fileName || null,
    reportDiagnoses: reportData?.diagnosesDocumented || (hasAutismReport ? 'Autism Spectrum Difference / Condition' : null),
    reportIssuingProfessional: reportData?.issuingProfessional || null,
    reportAdaptationHighlights: [
      hasAutismReport ? 'Autism Mode Active: Corner-to-corner screen attention counts as valid eye contact' : null,
      hasAdhdReport ? 'ADHD Dopamine Rewards: Dynamic neon paths, sparkling checkpoints, and snappy 30-45s timers' : null,
      hasSpeechReport ? 'Speech Support: Vocal phoneme mirroring with visual "I Said It" assistive tap' : null,
      hasSensoryReport ? 'Sensory Calm Regulation: Gentle ambient audio and low-arousal visual pacing' : null
    ].filter(Boolean),
    clinicalRecommendations: reportData?.recommendations || []
  };
}
