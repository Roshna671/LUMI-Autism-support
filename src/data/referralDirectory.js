/**
 * LUMI Developmental & Referral Directory
 * Provides evidence-based referral pathways, early intervention directories,
 * and low-cost/public services information for families seeking developmental support.
 */

export const REFERRAL_CATEGORIES = [
  {
    id: 'early_intervention',
    name: 'Early Intervention & Public Support',
    desc: 'Government and community-funded early childhood programs (Ages 0–3 and 3–5)'
  },
  {
    id: 'specialists',
    name: 'Qualified Developmental Specialists',
    desc: 'Clinical specialists who provide formal assessments and evidence-informed therapies'
  },
  {
    id: 'helplines',
    name: 'Caregiver Support Helplines & Advocacy',
    desc: 'Free family guidance, parent-to-parent networks, and neurodiversity-affirming resources'
  }
];

export const REFERRAL_RESOURCES = [
  {
    id: 'ref_1',
    category: 'early_intervention',
    title: 'Public Early Intervention Programs (IDEA Part C / State Programs)',
    description: 'Free or sliding-scale developmental assessments for children under age 3. No doctor referral is legally required in most regions to request an evaluation.',
    whoCanHelp: 'Early Childhood Intervention (ECI) Service Coordinators',
    contactInfo: 'Contact your local public health department or school district special education office',
    tags: ['Ages 0-3', 'Public/Low-Cost', 'Comprehensive Assessment']
  },
  {
    id: 'ref_2',
    category: 'specialists',
    title: 'Developmental-Behavioral Pediatricians & Pediatric Neurologists',
    description: 'Medical doctors specializing in early developmental trajectories, neurodevelopmental differences, and medical co-occurrences.',
    whoCanHelp: 'Board-Certified Developmental Pediatrician',
    contactInfo: 'Request a formal referral from your family pediatrician or local children’s hospital',
    tags: ['Diagnostic Assessment', 'Medical Evaluation', 'Comprehensive']
  },
  {
    id: 'ref_3',
    category: 'specialists',
    title: 'Speech-Language Pathologists (SLP / Speech Therapists)',
    description: 'Support functional communication, receptive and expressive language, emerging speech, and Augmentative & Alternative Communication (AAC).',
    whoCanHelp: 'Certified Speech-Language Therapist',
    contactInfo: 'Search accredited clinics via national speech-language-hearing associations (e.g. ASHA, RCSLT, RCI)',
    tags: ['Communication', 'AAC', 'Speech Therapy']
  },
  {
    id: 'ref_4',
    category: 'specialists',
    title: 'Pediatric Occupational Therapists (OT)',
    description: 'Focus on sensory regulation, fine motor skills, self-care routines, and motor planning in child-led, playful environments.',
    whoCanHelp: 'Licensed Pediatric Occupational Therapist',
    contactInfo: 'Consult local pediatric therapy clinics or hospital outpatient services',
    tags: ['Sensory Processing', 'Fine Motor', 'Daily Living']
  },
  {
    id: 'ref_5',
    category: 'helplines',
    title: 'Autism & Developmental Support Networks & Caregiver Helplines',
    description: 'Non-profit organizations offering guidance on navigating waitlists, insurance coverage, school accommodations, and caregiver mental health.',
    whoCanHelp: 'Parent Navigators & Peer Counselors',
    contactInfo: 'National Autism Association, Autism Society, or local parent advocacy chapters',
    tags: ['Caregiver Support', 'Free Advice', 'Peer Network']
  }
];

export const CAREGIVER_PREPARATION_TIPS = [
  'Keep a short video log of everyday behaviors and moments of joy or distress (1–2 minutes each).',
  'Write down your child’s favorite strengths, special interests, and sensory triggers before the appointment.',
  'Remember you can seek an evaluation even if a pediatrician suggests "waiting and seeing" if your instincts indicate support is needed.',
  'Early support is about building comfort, communication, and independence — not "fixing" who your child is.'
];
