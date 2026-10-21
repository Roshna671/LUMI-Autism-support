/**
 * LUMI Developmental Screening & Observation Tool Configuration
 *
 * IMPORTANT CLINICAL & ETHICAL DISCLAIMER:
 * This screening observation tool is designed to gather structured caregiver observations.
 * It is NOT a clinical diagnosis of autism, ADHD, or any other developmental condition,
 * and CANNOT determine autism severity.
 *
 * Age-specific pathways:
 * 1. Toddler / Early Preschool Pathway (18 months - 3 years 11 months):
 *    Observational indicators based on early joint attention, social communication, and play milestones.
 * 2. CAST-Referenced Pathway (4 years - 11 years):
 *    References the Childhood Autism Spectrum Test (CAST; Scott, Baron-Cohen, Bolton, & Brayne, 2002; Autism Research Centre).
 *    Intended strictly for children aged 4 to 11 years.
 */

export const SCREENING_DOMAINS = [
  { id: 'social', name: 'Social Interaction', icon: '🤝', desc: 'Connecting, sharing enjoyment, and interacting with peers and family' },
  { id: 'communication', name: 'Communication & Language', icon: '🗣️', desc: 'Verbal, emerging, gestural, or AAC-based expression and understanding' },
  { id: 'play', name: 'Play & Imagination', icon: '🎨', desc: 'Pretend play, toy exploration, flexibility, and creative activities' },
  { id: 'routines', name: 'Routines & Repetitive Behaviors', icon: '🔄', desc: 'Preferences for consistency, repetitive movements, and intense focused interests' },
  { id: 'sensory', name: 'Sensory Preferences & Responses', icon: '🌊', desc: 'Reactions to sounds, textures, lights, movement, and tactile sensations' },
  { id: 'adaptive', name: 'Daily Living & Adaptive Skills', icon: '🌱', desc: 'Everyday routines, self-care attempts, transitions, and independence' },
  { id: 'strengths', name: 'Strengths & Special Interests', icon: '⭐', desc: 'Areas of joy, deep interest, curiosity, and visual/memory strengths' }
];

// Toddler Pathway (18m - 3y 11m)
export const TODDLER_SCREENING_ITEMS = [
  {
    id: 't_soc_1',
    domain: 'social',
    question: 'Does your child look at you to share excitement when they see something interesting (e.g., pointing out an airplane or cute animal)?',
    options: [
      { label: 'Yes, often', score: 0 },
      { label: 'Sometimes', score: 1 },
      { label: 'Rarely or not yet', score: 2 }
    ],
    hint: 'This is called joint attention — sharing joy about something in the environment.'
  },
  {
    id: 't_soc_2',
    domain: 'social',
    question: 'When you call your child’s name in a quiet room, do they usually turn their head or acknowledge you?',
    options: [
      { label: 'Yes, almost always', score: 0 },
      { label: 'Sometimes / depends on focus', score: 1 },
      { label: 'Rarely, even with repeated calls', score: 2 }
    ],
    hint: 'Children may be intensely focused on favorite toys, but should acknowledge their name in general.'
  },
  {
    id: 't_com_1',
    domain: 'communication',
    question: 'How does your child communicate their wants or needs (e.g., asking for juice or a toy)?',
    options: [
      { label: 'Uses words or word approximations', score: 0 },
      { label: 'Uses pointing, gestures, or visual symbols / AAC', score: 0 },
      { label: 'Takes your hand and pulls you toward items without pointing or looking', score: 1 },
      { label: 'Experiences significant frustration expressing needs', score: 2 }
    ],
    hint: 'Pointing and visual AAC are recognized, positive communication strategies.'
  },
  {
    id: 't_play_1',
    domain: 'play',
    question: 'Does your child engage in simple pretend play (e.g., pretending to feed a teddy bear, talk on a toy phone, or drive a car)?',
    options: [
      { label: 'Yes, regularly', score: 0 },
      { label: 'Sometimes with encouragement', score: 1 },
      { label: 'Prefers lining up or inspecting parts of toys (e.g., spinning wheels)', score: 2 }
    ],
    hint: 'Both pretend play and mechanical exploration are natural, but balance is informative.'
  },
  {
    id: 't_sens_1',
    domain: 'sensory',
    question: 'Does your child cover their ears, get distressed, or seek to escape common everyday sounds (e.g., blender, vacuum, hair dryer)?',
    options: [
      { label: 'Rarely / typical reaction', score: 0 },
      { label: 'Sometimes for loud or unexpected noises', score: 1 },
      { label: 'Frequently distressed by everyday sounds', score: 2 }
    ],
    hint: 'Sensory sensitivity to auditory input is very common in early childhood.'
  },
  {
    id: 't_rout_1',
    domain: 'routines',
    question: 'Does your child show rhythmic, repetitive movements when excited or overwhelmed (e.g., hand-flapping, rocking, spinning)?',
    options: [
      { label: 'Rarely', score: 0 },
      { label: 'Occasionally when very happy or excited', score: 1 },
      { label: 'Frequently throughout the day', score: 2 }
    ],
    hint: 'Stimming is a natural regulatory mechanism; we note it to support comfort, never to suppress it.'
  },
  {
    id: 't_adap_1',
    domain: 'adaptive',
    question: 'How does your child handle changes to familiar routines (e.g., a different route to preschool, changing caregivers)?',
    options: [
      { label: 'Adapts smoothly with brief preparation', score: 0 },
      { label: 'Needs extra time and comforting', score: 1 },
      { label: 'Experiences intense distress or prolonged meltdowns', score: 2 }
    ],
    hint: 'Visual schedules and clear transitions can provide significant support.'
  },
  {
    id: 't_str_1',
    domain: 'strengths',
    question: 'What are your child’s noticeable developmental strengths and areas of delight?',
    options: [
      { label: 'Strong visual memory, puzzles, or pattern recognition', score: 0 },
      { label: 'Deep curiosity, focus, and passion for specific topics', score: 0 },
      { label: 'Affectionate, musical, or kinesthetic / physical energy', score: 0 },
      { label: 'All of the above in different moments', score: 0 }
    ],
    hint: 'Identifying strengths helps us personalize LUMI’s activity rewards and themes.'
  }
];

// CAST-Referenced Pathway (4 - 11 years)
// Reference: Childhood Autism Spectrum Test (CAST), Scott et al. 2002.
export const CAST_SCREENING_ITEMS = [
  {
    id: 'cast_1',
    domain: 'social',
    question: 'Does your child join in playing games with other children easily?',
    options: [
      { label: 'Yes', score: 0 },
      { label: 'Sometimes / with familiar peers', score: 1 },
      { label: 'No / prefers solitary play', score: 2 }
    ],
    hint: 'Observes peer social interaction and group play comfort.'
  },
  {
    id: 'cast_2',
    domain: 'communication',
    question: 'Does your child come up to you spontaneously for a chat or to share thoughts?',
    options: [
      { label: 'Yes', score: 0 },
      { label: 'Sometimes', score: 1 },
      { label: 'No / only speaks to communicate urgent needs', score: 2 }
    ],
    hint: 'Explores reciprocal conversation vs. instrumental communication.'
  },
  {
    id: 'cast_3',
    domain: 'communication',
    question: 'Does your child understand conversation nuance, jokes, or do they tend to take idioms very literally (e.g., "it’s raining cats and dogs")?',
    options: [
      { label: 'Understands figurative language appropriately for age', score: 0 },
      { label: 'Sometimes takes things literally', score: 1 },
      { label: 'Tends to take idioms and sarcasm very literally', score: 2 }
    ],
    hint: 'Literal interpretation of spoken language is a common developmental pattern.'
  },
  {
    id: 'cast_4',
    domain: 'routines',
    question: 'Does your child have very intense, focused interests or passions that they love exploring for long periods?',
    options: [
      { label: 'Typical variety of rotating interests', score: 0 },
      { label: 'A few strong favorite hobbies', score: 1 },
      { label: 'Very deep, encyclopedic special interests', score: 2 }
    ],
    hint: 'Special interests are wonderful cognitive strengths that LUMI uses for engagement.'
  },
  {
    id: 'cast_5',
    domain: 'play',
    question: 'Does your child enjoy role-playing, acting out stories with figures, or pretend play?',
    options: [
      { label: 'Yes, enjoys imaginative pretend play', score: 0 },
      { label: 'Sometimes, prefers structured or digital games', score: 1 },
      { label: 'Prefers organizing, categorizing, or factual play', score: 2 }
    ],
    hint: 'Observes play style and imaginative vs. organizational preferences.'
  },
  {
    id: 'cast_6',
    domain: 'sensory',
    question: 'Does your child have intense sensitivity to clothing textures (tags, seams), sounds, foods, or light?',
    options: [
      { label: 'No unusual sensitivities', score: 0 },
      { label: 'Mild preferences (e.g., prefers cutting off tags)', score: 1 },
      { label: 'Significant sensory sensitivities affecting daily routine', score: 2 }
    ],
    hint: 'Helps configure LUMI’s sensory-friendly visual and audio settings.'
  },
  {
    id: 'cast_7',
    domain: 'adaptive',
    question: 'Does your child thrive when daily routines are predictable, and feel upset if plans change without warning?',
    options: [
      { label: 'Flexible with sudden changes', score: 0 },
      { label: 'Prefers a heads-up before changes', score: 1 },
      { label: 'Strong preference for predictable routines and advance notice', score: 2 }
    ],
    hint: 'Predictability and visual schedules significantly reduce childhood anxiety.'
  },
  {
    id: 'cast_8',
    domain: 'strengths',
    question: 'What special cognitive or creative strengths does your child show?',
    options: [
      { label: 'Exceptional memory for facts, dates, maps, or details', score: 0 },
      { label: 'Artistic, musical, or technical affinity', score: 0 },
      { label: 'Honesty, loyalty, and deep sense of fairness', score: 0 },
      { label: 'Fast problem solver with visual patterns and mechanics', score: 0 }
    ],
    hint: 'Strengths-based support focuses on what the child loves and excels at.'
  }
];

/**
 * Calculates a descriptive, non-diagnostic observation summary.
 * NEVER outputs an autism diagnosis or clinical severity label.
 */
export function evaluateScreeningResponses(ageYears, responses) {
  const isToddler = (Number(ageYears) || 4) < 4;
  const items = isToddler ? TODDLER_SCREENING_ITEMS : CAST_SCREENING_ITEMS;

  let totalScore = 0;
  let maxScore = 0;
  const domainSummaries = {};

  items.forEach((item) => {
    const chosenScore = responses[item.id] !== undefined ? responses[item.id] : 0;
    totalScore += chosenScore;
    maxScore += 2;

    if (!domainSummaries[item.domain]) {
      domainSummaries[item.domain] = { domain: item.domain, score: 0, count: 0 };
    }
    domainSummaries[item.domain].score += chosenScore;
    domainSummaries[item.domain].count += 1;
  });

  const toolName = isToddler ? 'Early Developmental Observation Guide (18m–3y 11m)' : 'CAST-Referenced Observation Guide (4–11y)';
  const ratio = totalScore / (maxScore || 1);

  let recommendationLevel = 'typical_support';
  let guidanceText = 'Observations reflect typical early developmental variation. Supportive play and communication practice in LUMI are recommended to build confidence.';
  let professionalFollowUpSuggested = false;

  if (ratio > 0.45) {
    recommendationLevel = 'consultation_recommended';
    guidanceText = 'Observations highlight distinct communication, sensory, or routine preferences. Discussing these observations with your pediatrician, developmental pediatrician, or an early intervention specialist is recommended for comprehensive guidance.';
    professionalFollowUpSuggested = true;
  } else if (ratio > 0.25) {
    recommendationLevel = 'monitoring_and_practice';
    guidanceText = 'Several unique developmental and sensory patterns were noted. Targeted, low-stress practice with LUMI activities and ongoing pediatric check-ins can provide supportive enrichment.';
    professionalFollowUpSuggested = true;
  }

  return {
    toolName,
    agePathway: isToddler ? 'toddler' : 'child_cast',
    totalScore,
    maxScore,
    recommendationLevel,
    guidanceText,
    professionalFollowUpSuggested,
    domainSummaries,
    disclaimer: 'This observation summary is an educational support tool and does not constitute a medical or psychological diagnosis. Only a qualified developmental pediatrician, clinical psychologist, or multidisciplinary team can conduct a formal assessment.'
  };
}
