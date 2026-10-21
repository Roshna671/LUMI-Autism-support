/**
 * LUMI Transparent Rule-Based Adaptive Practice Engine
 *
 * Implements transparent, explainable adaptation rules across multiple sessions.
 * Explicitly avoids claims of unvalidated machine learning or clinical diagnoses.
 * Evaluates multi-session trends to suggest supportive pacing, level adjustments,
 * and sensory pauses.
 */

export const ENGAGEMENT_LEVELS = [
  { id: 'high', label: 'Highly Engaged / Joyful', emoji: '🌟' },
  { id: 'engaged', label: 'Calm & Engaged', emoji: '😊' },
  { id: 'fatigued', label: 'Showing Fatigue / Distracted', emoji: '🥱' },
  { id: 'overwhelmed', label: 'Sensory Overload / Restless', emoji: '⚠️' }
];

/**
 * Creates a structured session record.
 */
export function createSessionRecord({
  activityId,
  activityName,
  difficultyLevel = 'medium',
  durationSeconds = 180,
  attempts = 5,
  successfulResponses = 4,
  hintsUsed = 0,
  completionStatus = 'completed', // 'completed' | 'partial' | 'break_taken'
  childEngagement = 'engaged',    // 'high' | 'engaged' | 'fatigued' | 'overwhelmed'
  breaksRequested = 0,
  caregiverNotes = ''
}) {
  const accuracyPercent = attempts > 0 ? Math.round((successfulResponses / attempts) * 100) : 100;

  return {
    id: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    activityId,
    activityName: activityName || activityId,
    difficultyLevel,
    durationSeconds: Math.max(1, durationSeconds),
    attempts,
    successfulResponses,
    accuracyPercent,
    hintsUsed,
    completionStatus,
    childEngagement,
    breaksRequested,
    caregiverNotes: caregiverNotes.trim()
  };
}

/**
 * Analyzes session history across multiple sessions for an activity or globally.
 * Returns transparent recommendations and explicit observation rationales.
 */
export function analyzeAdaptiveRecommendations(activityId, sessionHistory = []) {
  const relevantSessions = activityId
    ? sessionHistory.filter((s) => s.activityId === activityId)
    : sessionHistory;

  // Rule 1: Insufficient data rule (<2 sessions)
  if (relevantSessions.length < 2) {
    return {
      status: 'insufficient_data',
      action: 'maintain_level',
      suggestedLevel: relevantSessions[0]?.difficultyLevel || 'medium',
      headline: 'Building Observation Baseline',
      summary: 'Continue at the current comfortable level. At least 2 practice sessions are needed before suggesting difficulty adjustments.',
      rationales: [
        'Only 1 session recorded so far for this activity.',
        'LUMI requires multiple observations across different times of day to ensure adjustments reflect real comfort, not random fluctuations.'
      ]
    };
  }

  // Look at last 3 to 5 sessions
  const recent = relevantSessions.slice(-4);
  const avgAccuracy = Math.round(recent.reduce((sum, s) => sum + s.accuracyPercent, 0) / recent.length);
  const totalBreaks = recent.reduce((sum, s) => sum + (s.breaksRequested || 0), 0);
  const totalHints = recent.reduce((sum, s) => sum + (s.hintsUsed || 0), 0);
  const fatigueOccurrences = recent.filter(
    (s) => s.childEngagement === 'fatigued' || s.childEngagement === 'overwhelmed'
  ).length;

  const rationales = [];
  rationales.push(`Average accuracy across last ${recent.length} sessions: ${avgAccuracy}%.`);

  // Rule 2: Fatigue or Sensory Overload
  if (fatigueOccurrences >= 2 || totalBreaks >= 2) {
    rationales.push(`Fatigue or break signals observed in ${fatigueOccurrences} of last ${recent.length} sessions.`);
    return {
      status: 'fatigue_pause',
      action: 'shorten_or_calm',
      suggestedLevel: 'gentle_pace',
      headline: 'Gentle Pacing & Sensory Reset Suggested',
      summary: 'Your child recently showed signs of fatigue or requested breaks. We suggest shorter practice sessions (3–4 minutes) or transitioning to Sensory Calm.',
      rationales
    };
  }

  // Rule 3: Repeated High Mastery (Comfortable Advancement)
  if (avgAccuracy >= 85 && totalHints <= 1) {
    rationales.push(`High consistent success rate (>=85%) with minimal assistance across ${recent.length} sessions.`);
    return {
      status: 'ready_to_advance',
      action: 'offer_next_level',
      suggestedLevel: 'advanced',
      headline: 'Ready for an Optional New Challenge',
      summary: 'Your child is consistently comfortable and confident with this activity. An optional next level or additional variation is available.',
      rationales
    };
  }

  // Rule 4: Repeated Struggle / High Assistance (Supportive Simplification)
  if (avgAccuracy < 55 || totalHints >= 4) {
    rationales.push(`Accuracy was below 55% or required frequent hints (${totalHints} hints used).`);
    return {
      status: 'simplify_task',
      action: 'simplify_and_support',
      suggestedLevel: 'easy',
      headline: 'Simplify & Offer Visual Hints',
      summary: 'To keep practice encouraging and pressure-free, we recommend reducing choices (e.g. from 4 to 2 choices) or providing extra visual cues.',
      rationales
    };
  }

  // Rule 5: Steady Pacing / Stable Progress
  rationales.push('Performance is balanced within the optimal learning zone (60%–84% accuracy).');
  return {
    status: 'optimal_zone',
    action: 'maintain_level',
    suggestedLevel: recent[recent.length - 1]?.difficultyLevel || 'medium',
    headline: 'Optimal Learning Zone',
    summary: 'Current pace and challenge level are well-matched. Continuing at this level strengthens memory and functional confidence.',
    rationales
  };
}
