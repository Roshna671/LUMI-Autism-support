import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Check, ArrowRight, ArrowLeft, Upload, FileText, AlertCircle,
  Sparkles, Heart, Brain, Info, HelpCircle, Eye, User, Calendar, RefreshCw, X, Play, Globe, Cake, ChevronRight, ChevronLeft
} from 'lucide-react';
import AestheticDarkBackground from '../components/AestheticDarkBackground';
import {
  NameAskingGraphic,
  DetailsAgeGraphic,
  CommunicationStyleGraphic,
  SensoryComfortGraphic,
  ClinicalHistoryGraphic,
  DocumentUploadGraphic,
  ObservationQuestionGraphic,
  GameZoneDoorwayGraphic
} from '../components/onboarding/StepGraphics';
import { useApp } from '../context/AppContext';
import { validateReportFile, parseReportDocument } from '../utils/reportExtractor';
import { TODDLER_SCREENING_ITEMS, CAST_SCREENING_ITEMS, evaluateScreeningResponses } from '../data/developmentalScreening';
import { generateIndividualizedPlan } from '../utils/activityPlanner';
import confetti from 'canvas-confetti';

const STEPS = [
  { id: 1, title: 'Child Identity & Consent', short: 'Identity', graphic: NameAskingGraphic },
  { id: 2, title: 'Developmental Milestones & Language', short: 'Milestones', graphic: DetailsAgeGraphic },
  { id: 3, title: 'Communication & Passions', short: 'Communication', graphic: CommunicationStyleGraphic },
  { id: 4, title: 'Sensory Comfort & Routine', short: 'Sensory', graphic: SensoryComfortGraphic },
  { id: 5, title: 'Assessment & Therapy History', short: 'History', graphic: ClinicalHistoryGraphic },
  { id: 6, title: 'Developmental Report Upload', short: 'Report', graphic: DocumentUploadGraphic },
  { id: 7, title: 'Developmental Observations', short: 'Screening', graphic: ObservationQuestionGraphic },
  { id: 8, title: 'Individualized Practice Plan', short: 'Unlock', graphic: GameZoneDoorwayGraphic }
];

export default function CaregiverOnboarding() {
  const navigate = useNavigate();
  const {
    profile, updateProfile,
    assessmentHistory, updateAssessmentHistory,
    reportData, updateReportData,
    updateScreeningResults,
    sessionHistory,
    updateDailyPlan,
    speakText
  } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // --- Step 1: Identity & Consent ---
  const [name, setName] = useState(profile.name || 'Aarav');
  const [caregiverRelation, setCaregiverRelation] = useState(profile.caregiverRelation || 'Mother');
  const [consentGiven, setConsentGiven] = useState(profile.consentGiven ?? true);

  // --- Step 2: Details & Milestones ---
  const [ageYears, setAgeYears] = useState(profile.age || 4);
  const [ageMonths, setAgeMonths] = useState(profile.ageMonths || 2);
  const [dob, setDob] = useState(profile.dob || '');
  const [language, setLanguage] = useState(profile.language || 'en');

  // --- Step 3: Communication & Interests ---
  const [communicationStyle, setCommunicationStyle] = useState(profile.communicationStyle || 'emerging');
  const [selectedInterests, setSelectedInterests] = useState(profile.interests || ['Dinosaurs', 'Trains', 'Animals', 'Bubbles']);
  const [customInterest, setCustomInterest] = useState('');

  // --- Step 4: Sensory & Comfort ---
  const [soundSensitivity, setSoundSensitivity] = useState(profile.sensoryPreferences?.soundSensitivity || 'sensitive_low_volume');
  const [movementNeed, setMovementNeed] = useState(profile.sensoryPreferences?.movementNeed || 'calm_seated');
  const [sessionDuration, setSessionDuration] = useState(profile.preferredSessionDuration || 10);
  const [reducedMotionPref, setReducedMotionPref] = useState(profile.accessibility?.reducedMotion || false);
  const [voiceGuidancePref, setVoiceGuidancePref] = useState(profile.accessibility?.voiceGuidance ?? true);

  // --- Step 5: Assessment & Therapy History ---
  const [hasAssessment, setHasAssessment] = useState(assessmentHistory.hasProfessionalAssessment || 'in_progress');
  const [autismDiagnosed, setAutismDiagnosed] = useState(assessmentHistory.autismDiagnosed || 'under_evaluation');
  const [otherConditions, setOtherConditions] = useState(assessmentHistory.otherConditions || ['Speech / Language Delay']);
  const [professionalsConsulted, setProfessionalsConsulted] = useState(assessmentHistory.consultedProfessionals || ['Pediatrician', 'Speech-Language Pathologist']);
  const [therapyStatus, setTherapyStatus] = useState(assessmentHistory.currentlyReceivingTherapy || 'yes');
  const [firstTimeSeeking, setFirstTimeSeeking] = useState(assessmentHistory.firstTimeSeekingAssessment || 'no');
  const [selectedConcerns, setSelectedConcerns] = useState(assessmentHistory.caregiverConcerns || ['speech_communication', 'sensory']);
  const [additionalNotes, setAdditionalNotes] = useState(assessmentHistory.additionalNotes || '');

  // --- Step 6: Report Upload ---
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessingReport, setIsProcessingReport] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [extractedReport, setExtractedReport] = useState(reportData);
  const [isEditingReport, setIsEditingReport] = useState(false);

  // --- Step 7: Developmental Screening ---
  const isToddler = Number(ageYears) < 4;
  const screeningQuestions = isToddler ? TODDLER_SCREENING_ITEMS : CAST_SCREENING_ITEMS;
  const [screeningAnswers, setScreeningAnswers] = useState({});
  const [screeningEvaluation, setScreeningEvaluation] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // --- Step 8: Individualized Plan ---
  const [previewPlan, setPreviewPlan] = useState(null);

  // Keyboard Enter key support: pressing Enter anywhere in the onboarding advances to next step
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    currentStep, name, caregiverRelation, consentGiven,
    ageYears, ageMonths, dob, language, communicationStyle, selectedInterests,
    soundSensitivity, movementNeed, sessionDuration, reducedMotionPref, voiceGuidancePref,
    hasAssessment, autismDiagnosed, otherConditions, professionalsConsulted, therapyStatus,
    firstTimeSeeking, selectedConcerns, additionalNotes, screeningAnswers, screeningEvaluation, previewPlan,
    currentQuestionIndex
  ]);

  const toggleArrayItem = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests([...selectedInterests, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;

    setUploadError('');
    const validation = validateReportFile(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    setUploadFile(file);
    setIsProcessingReport(true);
    setUploadProgress(25);

    try {
      await new Promise((r) => setTimeout(r, 400));
      setUploadProgress(65);
      const parsedData = await parseReportDocument(file);
      setUploadProgress(100);
      await new Promise((r) => setTimeout(r, 300));

      setExtractedReport(parsedData);
      updateReportData(parsedData);
      setIsProcessingReport(false);
    } catch (err) {
      setIsProcessingReport(false);
      setUploadError(err.message || 'Unable to parse document. You can still enter observations manually.');
    }
  };

  const handleScreeningAnswer = (qId, score) => {
    const updated = { ...screeningAnswers, [qId]: score };
    setScreeningAnswers(updated);
    const evalResult = evaluateScreeningResponses(ageYears, updated);
    setScreeningEvaluation(evalResult);

    // If not last question, smoothly advance to next question
    if (currentQuestionIndex < screeningQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 300);
    }
  };

  const handleNext = () => {
    try {
      if (currentStep === 1) {
        if (!name.trim()) {
          alert('Please enter your child’s name to proceed.');
          return;
        }
        if (!consentGiven) {
          alert('Please review caregiver consent to proceed.');
          return;
        }
        updateProfile({
          name: name.trim(),
          caregiverRelation,
          consentGiven,
          consentTimestamp: new Date().toISOString()
        });
        speakText(`Welcome ${name.trim()}! Next, let's look at developmental milestones.`);
        setCurrentStep(2);
        return;
      }

      if (currentStep === 2) {
        updateProfile({
          age: Number(ageYears),
          ageMonths: Number(ageMonths),
          dob,
          language
        });
        speakText(`Great! Now let's explore ${name.trim()}’s communication style and interests.`);
        setCurrentStep(3);
        return;
      }

      if (currentStep === 3) {
        updateProfile({
          communicationStyle,
          interests: selectedInterests
        });
        speakText(`Got it! Next, sensory preferences and session duration.`);
        setCurrentStep(4);
        return;
      }

      if (currentStep === 4) {
        updateProfile({
          sensoryPreferences: {
            soundSensitivity,
            movementNeed,
            visualPreference: 'standard',
            knownTriggers: ['Sudden loud noises']
          },
          preferredSessionDuration: Number(sessionDuration),
          accessibility: {
            reducedMotion: reducedMotionPref,
            voiceGuidance: voiceGuidancePref
          }
        });
        setCurrentStep(5);
        return;
      }

      if (currentStep === 5) {
        updateAssessmentHistory({
          hasProfessionalAssessment: hasAssessment,
          autismDiagnosed,
          otherConditions,
          consultedProfessionals: professionalsConsulted,
          currentlyReceivingTherapy: therapyStatus,
          firstTimeSeekingAssessment: firstTimeSeeking,
          caregiverConcerns: selectedConcerns,
          additionalNotes
        });
        setCurrentStep(6);
        return;
      }

      if (currentStep === 6) {
        if (extractedReport) {
          updateReportData(extractedReport);
          const diagLower = (extractedReport.diagnosesDocumented || '').toLowerCase();
          const fileLower = (extractedReport.fileName || '').toLowerCase();
          const isAutism = diagLower.includes('autism') || diagLower.includes('asd') || fileLower.includes('autism');
          const isADHD = diagLower.includes('adhd') || diagLower.includes('attention') || fileLower.includes('adhd');

          const newConditions = [...otherConditions];
          if (isADHD && !newConditions.includes('ADHD')) newConditions.push('ADHD');

          updateAssessmentHistory({
            hasProfessionalAssessment: 'yes',
            autismDiagnosed: isAutism ? 'yes' : autismDiagnosed,
            otherConditions: newConditions
          });
        }
        setCurrentStep(7);
        return;
      }

      if (currentStep === 7) {
        // If still in question sequence and not completed
        if (currentQuestionIndex < screeningQuestions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          return;
        }

        if (screeningEvaluation) {
          updateScreeningResults({
            evaluatedDate: new Date().toISOString(),
            answers: screeningAnswers,
            evaluation: screeningEvaluation
          });
        }

        const genPlan = generateIndividualizedPlan(
          { ...profile, name, age: ageYears, communicationStyle, interests: selectedInterests },
          { ...assessmentHistory, caregiverConcerns: selectedConcerns },
          extractedReport,
          sessionHistory
        );
        setPreviewPlan(genPlan);
        updateDailyPlan(genPlan);
        setCurrentStep(8);
        return;
      }

      if (currentStep === 8) {
        confetti({ particleCount: 160, spread: 100, origin: { y: 0.55 } });
        speakText(`Welcome ${name}! Unlocking your colorful Game Zone.`);
        navigate('/home');
      }
    } catch (err) {
      console.error('Error proceeding to next step:', err);
      if (currentStep < 8) setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 7 && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      return;
    }
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const StepGraphicComponent = STEPS[currentStep - 1].graphic;

  return (
    <AestheticDarkBackground>
      {/* ── TOP HEADER ── */}
      <header className="w-full border-b border-white/10 bg-[#070913]/90 backdrop-blur-2xl sticky top-0 z-30 font-jakarta">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-slate-950 font-outfit font-black text-lg shadow-[0_0_25px_rgba(0,245,255,0.5)]">
              L
            </div>
            <div>
              <span className="font-outfit font-extrabold text-white text-lg tracking-wide block leading-tight">LUMI Setup</span>
              <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block">
                Step {currentStep} of {STEPS.length} • {STEPS[currentStep - 1].short}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => navigate('/home')}
            className="text-xs sm:text-sm font-bold text-slate-300 hover:text-cyan-300 px-5 py-2.5 rounded-2xl glass-btn transition-colors cursor-pointer flex items-center gap-2"
          >
            <span>Skip to Game Zone 🚀</span>
          </motion.button>
        </div>
      </header>

      {/* ── MAIN CENTERED RESPONSIVE CONTAINER (SPACIOUS & UNCONGESTED) ── */}
      <main className="w-full flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-12 md:py-16 pb-32 font-jakarta">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">

          {/* Step Progress Pill Bar */}
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-outfit font-black text-cyan-300 uppercase tracking-wider text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> {STEPS[currentStep - 1].title}
              </span>
              <span className="font-extrabold text-slate-400 text-xs">
                {Math.round((currentStep / STEPS.length) * 100)}% Complete
              </span>
            </div>

            <div className="grid grid-cols-8 gap-2.5">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    s.id === currentStep
                      ? 'bg-cyan-400 shadow-[0_0_16px_#00F5FF]'
                      : s.id < currentStep
                      ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                      : 'bg-white/10'
                  }`}
                  title={s.title}
                />
              ))}
            </div>
          </div>

          {/* Dynamic Frosted Glassmorphism Card (SPACIOUS) */}
          <div className="p-8 sm:p-14 md:p-16 rounded-[40px] glass-card-glow shadow-2xl flex flex-col gap-10 relative">
            
            {/* Centered Graphic with subtle floating animation */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="flex justify-center"
            >
              <StepGraphicComponent className="w-32 h-32 sm:w-40 sm:h-40" />
            </motion.div>

            <AnimatePresence mode="wait">
              {/* ──────── STEP 1: CHILD IDENTITY & WELCOME ──────── */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-8"
                >
                  <div className="text-center flex flex-col gap-2 border-b border-white/10 pb-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-black text-white tracking-tight">Let’s Welcome Your Child</h2>
                    <p className="text-base sm:text-lg text-slate-300 font-medium">Enter your child’s name so Lumi can personalize every interaction with warmth</p>
                  </div>

                  <div className="flex flex-col gap-7">
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                        <User className="w-4 h-4 text-cyan-400" /> Child’s Preferred Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aarav, Yuktha"
                        className="w-full h-16 px-6 rounded-2xl glass-input text-white font-bold text-lg sm:text-xl placeholder-slate-500 focus:border-cyan-400"
                      />
                    </div>

                    {name.trim() && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 text-cyan-200 text-sm font-semibold flex items-center gap-3.5 shadow-[0_0_20px_rgba(0,245,255,0.2)]"
                      >
                        <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
                        <span>Welcome, <strong className="text-white text-base">{name}</strong>! We are so honored to support your learning journey.</span>
                      </motion.div>
                    )}

                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                        Your Relationship to Child
                      </label>
                      <select
                        value={caregiverRelation}
                        onChange={(e) => setCaregiverRelation(e.target.value)}
                        className="w-full h-15 px-6 rounded-2xl glass-input text-white font-bold text-base cursor-pointer"
                      >
                        {['Mother', 'Father', 'Grandparent', 'Legal Guardian', 'Foster Parent', 'Other Family Caregiver'].map((rel) => (
                          <option key={rel} value={rel} className="bg-slate-900 text-white">{rel}</option>
                        ))}
                      </select>
                    </div>

                    <label className="flex items-start gap-4 p-6 rounded-3xl glass-btn cursor-pointer hover:border-cyan-400/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        className="w-5 h-5 rounded accent-cyan-400 mt-1 cursor-pointer"
                      />
                      <span className="text-sm text-slate-300 leading-relaxed font-medium">
                        I understand LUMI is an educational supportive practice tool (not a medical diagnosis), and consent to recording preferences for personalized activities.
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* ──────── STEP 2: CHILD DETAILS & MILESTONES (SPACIOUS & ELEGANT) ──────── */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-10"
                >
                  <div className="text-center flex flex-col gap-2 border-b border-white/10 pb-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-black text-white tracking-tight">{name}’s Developmental Milestones</h2>
                    <p className="text-base sm:text-lg text-slate-300 font-medium">Age and language calibrate sentence complexity, visual prompt sizing, and activity difficulty</p>
                  </div>

                  {/* SUB-PANEL 1: AGE SELECTOR (SPACIOUS) */}
                  <div className="glass-card-subpanel rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="text-sm font-outfit font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2.5">
                        <Cake className="w-5 h-5 text-cyan-400" /> Child's Age:
                      </span>
                      <span className="text-lg sm:text-xl font-outfit font-black text-white bg-cyan-950/80 px-4 py-1.5 rounded-2xl border border-cyan-400/40">
                        {ageYears} Years Old {ageMonths > 0 ? `(+${ageMonths} Mos)` : ''}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-extrabold uppercase text-slate-300 tracking-wider">Select Age in Years:</span>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((y) => {
                          const isSelected = Number(ageYears) === y;
                          return (
                            <motion.button
                              key={y}
                              type="button"
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => setAgeYears(y)}
                              className={`h-14 sm:h-16 rounded-2xl text-center text-sm font-outfit font-black cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-[0_0_25px_rgba(0,245,255,0.7)] border-2 border-white'
                                  : 'glass-btn text-slate-200 hover:text-white hover:border-cyan-400/50'
                              }`}
                            >
                              <span>{y} yr</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Additional Months (Optional Fine-Tuning):</span>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {[0, 2, 4, 6, 8, 10].map((m) => {
                          const isSelected = Number(ageMonths) === m;
                          return (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setAgeMonths(m)}
                              className={`py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-2 border-cyan-400 shadow-lg'
                                  : 'glass-btn text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              +{m} Mos
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* SUB-PANEL 2: LANGUAGE SELECTION (SPACIOUS) */}
                  <div className="glass-card-subpanel rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
                    <span className="text-sm font-outfit font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2.5 border-b border-white/10 pb-4">
                      <Globe className="w-5 h-5 text-cyan-400" /> Preferred Language for Speech Guidance & Visual Prompts:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { code: 'en', name: 'English (Default)', native: 'English' },
                        { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
                        { code: 'hi', name: 'Hindi', native: 'हिंदी' },
                        { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
                        { code: 'te', name: 'Telugu', native: 'తెలుగు' },
                        { code: 'ml', name: 'Malayalam', native: 'മലയാളം' }
                      ].map((lang) => {
                        const isSelected = language === lang.code;
                        return (
                          <motion.button
                            key={lang.code}
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setLanguage(lang.code)}
                            className={`p-5 rounded-2xl text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-cyan-950/70 border-2 border-cyan-400 text-white shadow-[0_0_25px_rgba(0,245,255,0.3)]'
                                : 'glass-btn text-slate-300 hover:text-white hover:border-cyan-400/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-outfit font-bold text-base text-white">{lang.name}</span>
                              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-white/10 text-cyan-300">{lang.native}</span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reassuring Calibration Note */}
                  <div className="p-6 rounded-3xl bg-cyan-950/50 border border-cyan-400/35 text-sm text-cyan-200 leading-relaxed flex items-center gap-4">
                    <Sparkles className="w-6 h-6 text-cyan-400 shrink-0" />
                    <span>
                      <strong>Adaptive Pacing:</strong> LUMI automatically sets speech clarity, visual guidance, and game mechanics to {name}’s age ({ageYears}y {ageMonths}m).
                    </span>
                  </div>
                </motion.div>
              )}

              {/* ──────── STEP 3: COMMUNICATION & PASSIONS (SPACIOUS) ──────── */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-10"
                >
                  <div className="text-center flex flex-col gap-2 border-b border-white/10 pb-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-black text-white tracking-tight">Communication & Passions</h2>
                    <p className="text-base sm:text-lg text-slate-300 font-medium">How {name} expresses wants, and their favorite topics</p>
                  </div>

                  {/* Communication Style Selection */}
                  <div className="glass-card-subpanel rounded-3xl p-6 sm:p-8 flex flex-col gap-5">
                    <label className="text-sm font-outfit font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2 border-b border-white/10 pb-4">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> Primary Communication Style
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'spoken', title: 'Spoken Sentences', desc: 'Communicates using conversational phrases' },
                        { id: 'emerging', title: 'Emerging Speech', desc: 'Single words, word sounds, approximations' },
                        { id: 'aac_visual', title: 'AAC & Visual Symbols', desc: 'Picture cards, PECS, speech apps' },
                        { id: 'gestural', title: 'Gestural / Body Language', desc: 'Leading by hand, pointing, expressions' }
                      ].map((comm) => {
                        const isSelected = communicationStyle === comm.id;
                        return (
                          <motion.button
                            key={comm.id}
                            type="button"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCommunicationStyle(comm.id)}
                            className={`p-6 rounded-2xl text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'glass-btn-active'
                                : 'glass-btn hover:border-cyan-400/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-outfit font-extrabold text-lg text-white">{comm.title}</span>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-white/30'}`}>
                                {isSelected && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">{comm.desc}</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Favorite Interests Pills */}
                  <div className="glass-card-subpanel rounded-3xl p-6 sm:p-8 flex flex-col gap-5">
                    <label className="text-sm font-outfit font-black uppercase tracking-wider text-amber-300 flex items-center gap-2 border-b border-white/10 pb-4">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Favorite Topics (Used to Personalize Games)
                    </label>

                    <div className="flex flex-wrap gap-3">
                      {['Dinosaurs', 'Trains', 'Animals', 'Space', 'Bubbles', 'Music', 'Drawing', 'Cars', 'Water Play', 'Puzzles'].map((item) => {
                        const isChecked = selectedInterests.includes(item);
                        return (
                          <motion.button
                            key={item}
                            type="button"
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => toggleArrayItem(selectedInterests, setSelectedInterests, item)}
                            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.5)] font-black'
                                : 'glass-btn text-slate-200 hover:text-white hover:border-cyan-400/50'
                            }`}
                          >
                            {item} {isChecked ? '✓' : '+'}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Add Custom Topic Input */}
                    <div className="flex gap-3 max-w-md pt-2">
                      <input
                        type="text"
                        value={customInterest}
                        onChange={(e) => setCustomInterest(e.target.value)}
                        placeholder="Add custom interest..."
                        className="px-5 py-3.5 rounded-2xl glass-input text-sm font-bold text-white placeholder-slate-400 flex-1"
                      />
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={handleAddCustomInterest}
                        className="px-7 py-3.5 rounded-2xl glass-btn text-white text-sm font-bold hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400 cursor-pointer"
                      >
                        Add
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ──────── STEP 4: SENSORY COMFORT & ROUTINE (SPACIOUS) ──────── */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-10"
                >
                  <div className="text-center flex flex-col gap-2 border-b border-white/10 pb-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-black text-white tracking-tight">Sensory Comfort Profile</h2>
                    <p className="text-base sm:text-lg text-slate-300 font-medium">Ensuring practice feels calm, pressure-free, and safe</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="p-7 rounded-3xl glass-card flex flex-col gap-4">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">Audio Tolerance</label>
                      <select
                        value={soundSensitivity}
                        onChange={(e) => setSoundSensitivity(e.target.value)}
                        className="w-full h-14 px-5 rounded-2xl glass-input text-white font-bold text-sm cursor-pointer"
                      >
                        <option value="typical" className="bg-slate-900 text-white">Typical sound tolerance</option>
                        <option value="sensitive_low_volume" className="bg-slate-900 text-white">Sensitive to unexpected noises (Gentle Audio)</option>
                        <option value="seeks_sound" className="bg-slate-900 text-white">Enjoys musical rhythm and auditory feedback</option>
                      </select>
                    </div>

                    <div className="p-7 rounded-3xl glass-card flex flex-col gap-4">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">Session Pacing Duration</label>
                      <select
                        value={sessionDuration}
                        onChange={(e) => setSessionDuration(Number(e.target.value))}
                        className="w-full h-14 px-5 rounded-2xl glass-input text-white font-bold text-sm cursor-pointer"
                      >
                        <option value={5} className="bg-slate-900 text-white">Short & Gentle (5 Minutes)</option>
                        <option value={10} className="bg-slate-900 text-white">Standard (10 Minutes)</option>
                        <option value={15} className="bg-slate-900 text-white">Extended (15 Minutes)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-cyan-950/40 border border-cyan-400/35 text-sm text-cyan-200 leading-relaxed flex items-center gap-4">
                    <Sparkles className="w-6 h-6 text-cyan-400 shrink-0" />
                    <span>
                      <strong>Comfort Guarantee:</strong> Activities adapt dynamically. If {name} requests a pause or shows fatigue, LUMI immediately transitions to Sensory Calm breathing without reprimand.
                    </span>
                  </div>
                </motion.div>
              )}

              {/* ──────── STEP 5: ASSESSMENT & THERAPY HISTORY (SPACIOUS) ──────── */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-10"
                >
                  <div className="text-center flex flex-col gap-2 border-b border-white/10 pb-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-black text-white tracking-tight">Prior Clinical History</h2>
                    <p className="text-base sm:text-lg text-slate-300 font-medium">Understanding previous evaluations informs personalized recommendations</p>
                  </div>

                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">Has your child received a developmental evaluation?</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {['Yes', 'No', 'In Progress', 'Not Sure'].map((lbl) => {
                          const isSelected = hasAssessment === lbl.toLowerCase();
                          return (
                            <motion.button
                              key={lbl}
                              type="button"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setHasAssessment(lbl.toLowerCase())}
                              className={`py-4 px-4 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'glass-btn-active'
                                  : 'glass-btn text-slate-300 hover:text-white'
                              }`}
                            >
                              {lbl}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">Autism Diagnosis Status</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { id: 'yes', label: 'Yes, Diagnosed' },
                          { id: 'no', label: 'No Diagnosis' },
                          { id: 'under_evaluation', label: 'Under Evaluation' },
                          { id: 'prefer_not_to_say', label: 'Prefer Not to Say' }
                        ].map((item) => {
                          const isSelected = autismDiagnosed === item.id;
                          return (
                            <motion.button
                              key={item.id}
                              type="button"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setAutismDiagnosed(item.id)}
                              className={`py-4 px-4 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'glass-btn-active'
                                  : 'glass-btn text-slate-300 hover:text-white'
                              }`}
                            >
                              {item.label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">Focus Areas for Supportive Practice:</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                          { id: 'speech_communication', label: 'Speech & Sounds 🗣️' },
                          { id: 'play_imagination', label: 'Play & Curiosity 🎨' },
                          { id: 'daily_living', label: 'Daily Routines 🏠' },
                          { id: 'sensory', label: 'Sensory Comfort 🌊' },
                          { id: 'social_interaction', label: 'Emotion Recognition 💛' },
                          { id: 'motor_skills', label: 'Motor Coordination ✍️' }
                        ].map((concern) => {
                          const isChecked = selectedConcerns.includes(concern.id);
                          return (
                            <motion.button
                              key={concern.id}
                              type="button"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => toggleArrayItem(selectedConcerns, setSelectedConcerns, concern.id)}
                              className={`p-5 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-amber-400/20 border-2 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                                  : 'glass-btn text-slate-300 hover:text-white'
                              }`}
                            >
                              {concern.label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ──────── STEP 6: DEVELOPMENTAL REPORT UPLOAD (SPACIOUS) ──────── */}
              {currentStep === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-10"
                >
                  <div className="text-center flex flex-col gap-2 border-b border-white/10 pb-8">
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-btn text-slate-300 text-xs font-bold mb-1 mx-auto">
                      Optional Step
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-black text-white tracking-tight">Developmental Report Upload</h2>
                    <p className="text-base sm:text-lg text-slate-300 font-medium">Extract documented recommendations safely in your local browser</p>
                  </div>

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFileSelect(e);
                    }}
                    className="border-2 border-dashed border-cyan-400/40 rounded-[32px] p-12 text-center glass-btn hover:border-cyan-400 transition-colors flex flex-col items-center justify-center relative cursor-pointer"
                  >
                    <input
                      type="file"
                      accept=".pdf,application/pdf,image/png,image/jpeg,text/plain"
                      onChange={handleFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="w-20 h-20 rounded-3xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-5 shadow-[0_0_25px_rgba(0,245,255,0.4)]">
                      <Upload className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-outfit font-bold text-white">Drag & drop your report PDF here</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2">Accepts PDF, text summaries, and scanned pages (Max 15 MB)</p>
                    <span className="mt-6 px-8 py-3 rounded-2xl glass-btn text-cyan-300 font-bold text-sm border border-cyan-400/40 inline-block shadow-md">
                      Browse File from Device
                    </span>
                  </div>

                  {isProcessingReport && (
                    <div className="p-6 rounded-3xl glass-card flex flex-col gap-3">
                      <div className="flex justify-between text-sm font-bold text-cyan-400">
                        <span>Extracting explicit documented observations...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <div className="p-5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-sm font-bold flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {extractedReport && (
                    <div className="p-7 rounded-3xl glass-card border border-emerald-500/40 flex flex-col gap-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400 flex items-center gap-2 text-base font-outfit">
                          <Check className="w-5 h-5" /> Loaded: {extractedReport.fileName}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (isEditingReport) {
                              updateReportData(extractedReport);
                            }
                            setIsEditingReport(!isEditingReport);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-bold hover:bg-cyan-900 transition-all text-xs"
                        >
                          {isEditingReport ? 'Done Editing' : 'Edit Findings'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
                        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                          <span className="text-slate-400 uppercase font-bold text-[10px] block">Diagnosis / Identified Profile</span>
                          {isEditingReport ? (
                            <input
                              type="text"
                              value={extractedReport.diagnosesDocumented}
                              onChange={(e) => setExtractedReport({ ...extractedReport, diagnosesDocumented: e.target.value })}
                              className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-900 border border-cyan-400/50 text-white font-bold text-sm outline-none"
                            />
                          ) : (
                            <p className="font-bold text-white mt-1 text-sm sm:text-base">{extractedReport.diagnosesDocumented}</p>
                          )}
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                          <span className="text-slate-400 uppercase font-bold text-[10px] block">Specialist / Clinic</span>
                          {isEditingReport ? (
                            <input
                              type="text"
                              value={extractedReport.issuingProfessional}
                              onChange={(e) => setExtractedReport({ ...extractedReport, issuingProfessional: e.target.value })}
                              className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-900 border border-cyan-400/50 text-white font-bold text-sm outline-none"
                            />
                          ) : (
                            <p className="font-bold text-white mt-1 text-sm sm:text-base">{extractedReport.issuingProfessional}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ──────── STEP 7: DEVELOPMENTAL OBSERVATIONS (INTERACTIVE PAGINATED QUESTION FLOW) ──────── */}
              {currentStep === 7 && (
                <motion.div
                  key="step7"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-8"
                >
                  <div className="text-center flex flex-col gap-2 border-b border-white/10 pb-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-black text-white tracking-tight">
                      {isToddler ? 'Early Developmental Observations (18m–3y)' : 'Caregiver Questionnaire (4–11y)'}
                    </h2>
                    <p className="text-base sm:text-lg text-slate-300 font-medium">
                      {isToddler ? 'Early joint attention, play, and sensory milestones.' : 'Referenced from the Childhood Autism Spectrum Test (CAST).'}
                    </p>
                  </div>

                  {/* Question Progress Dots */}
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs sm:text-sm font-outfit font-extrabold uppercase text-cyan-300 tracking-wider">
                      Question {currentQuestionIndex + 1} of {screeningQuestions.length}
                    </span>
                    <div className="flex gap-1.5">
                      {screeningQuestions.map((q, idx) => (
                        <div
                          key={q.id}
                          className={`w-3 h-3 rounded-full transition-all ${
                            idx === currentQuestionIndex
                              ? 'bg-cyan-400 scale-125 shadow-[0_0_10px_#00F5FF]'
                              : screeningAnswers[q.id] !== undefined
                              ? 'bg-indigo-500'
                              : 'bg-white/15'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Single Question Focus Card (SPACIOUS & DELIGHTFUL) */}
                  {(() => {
                    const currentQ = screeningQuestions[currentQuestionIndex];
                    const currentScore = screeningAnswers[currentQ?.id];

                    return (
                      <div className="glass-card-subpanel rounded-3xl p-8 sm:p-10 flex flex-col gap-6">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-outfit font-extrabold text-white leading-snug">
                            {currentQuestionIndex + 1}. {currentQ?.question}
                          </h3>
                          <span className="text-xs uppercase font-extrabold px-4 py-1.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/35 shrink-0">
                            {currentQ?.domain}
                          </span>
                        </div>

                        {/* Large, Beautiful Option Cards */}
                        <div className="flex flex-col gap-3.5 pt-2">
                          {currentQ?.options.map((opt, optIdx) => {
                            const isChosen = currentScore === opt.score;
                            return (
                              <motion.button
                                key={optIdx}
                                type="button"
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleScreeningAnswer(currentQ.id, opt.score)}
                                className={`p-6 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                                  isChosen
                                    ? 'glass-btn-active'
                                    : 'glass-btn text-slate-200 hover:text-white hover:border-cyan-400/50'
                                }`}
                              >
                                <span className="font-outfit font-bold text-base sm:text-lg text-white">
                                  {opt.label}
                                </span>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isChosen ? 'border-cyan-400 bg-cyan-400' : 'border-white/30'}`}>
                                  {isChosen && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>

                        {/* Question Sub-Navigation */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <button
                            type="button"
                            onClick={handleBack}
                            disabled={currentQuestionIndex === 0}
                            className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${currentQuestionIndex === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-white cursor-pointer'}`}
                          >
                            <ChevronLeft className="w-4 h-4" /> Previous Question
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (currentQuestionIndex < screeningQuestions.length - 1) {
                                setCurrentQuestionIndex((prev) => prev + 1);
                              }
                            }}
                            disabled={currentQuestionIndex >= screeningQuestions.length - 1}
                            className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${currentQuestionIndex >= screeningQuestions.length - 1 ? 'text-slate-600 cursor-not-allowed' : 'text-cyan-400 hover:text-cyan-300 cursor-pointer'}`}
                          >
                            Next Question <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Summary Callout if all answered */}
                  {screeningEvaluation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-7 rounded-3xl bg-cyan-950/50 border border-cyan-400/40 flex flex-col gap-2.5 text-sm sm:text-base text-slate-200 shadow-xl"
                    >
                      <span className="font-outfit font-extrabold uppercase text-cyan-300 tracking-wider flex items-center gap-2">
                        <Check className="w-5 h-5 text-cyan-400" /> All Questions Completed • Observation Summary
                      </span>
                      <p className="leading-relaxed font-medium">{screeningEvaluation.guidanceText}</p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ──────── STEP 8: INDIVIDUALIZED PRACTICE PLAN & UNLOCK ──────── */}
              {currentStep === 8 && (
                <motion.div
                  key="step8"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-10"
                >
                  <div className="text-center flex flex-col gap-2 border-b border-white/10 pb-8">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-1 shadow-[0_0_20px_rgba(16,185,129,0.3)] mx-auto">
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> Plan Prepared & Ready
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-black text-white tracking-tight">{name}’s Individualized Practice Plan</h2>
                    <p className="text-base sm:text-lg text-slate-300 font-medium">Prepared around communication style, sensory needs, and favorite topics</p>
                  </div>

                  {previewPlan && (
                    <div className="flex flex-col gap-4">
                      {previewPlan.adaptedFromReport && (
                        <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/70 via-indigo-950/60 to-purple-950/70 border border-cyan-400/40 flex flex-col gap-3 shadow-[0_0_30px_rgba(0,245,255,0.15)]">
                          <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-sm sm:text-base font-outfit">
                            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
                            <span>Adapted to Clinical Report: {previewPlan.reportFileName || 'Clinical Case Study'}</span>
                          </div>
                          <div className="text-xs text-slate-200">
                            Identified Profile: <strong className="text-cyan-300 font-bold">{previewPlan.reportDiagnoses}</strong>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {previewPlan.reportAdaptationHighlights?.map((hl, i) => (
                              <span key={i} className="px-3 py-1 rounded-full bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 text-xs font-semibold">
                                ✓ {hl}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {previewPlan.activities.map((act) => (
                        <div
                          key={act.activityId}
                          className="p-6 rounded-3xl glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                        >
                          <div className="flex items-center gap-5">
                            <span className="text-4xl p-3.5 rounded-2xl bg-white/10 border border-white/15 shadow-sm">{act.emoji}</span>
                            <div>
                              <h4 className="text-lg font-outfit font-extrabold text-white">{act.name}</h4>
                              <span className="text-xs text-cyan-300 font-bold">{act.skillDomain} • ~{act.plannedDurationMinutes} Mins</span>
                              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">{act.rationale}</p>
                            </div>
                          </div>

                          <span className="text-xs font-bold uppercase px-4 py-1.5 rounded-full bg-white/10 text-cyan-300 border border-cyan-400/35 self-end sm:self-auto">
                            {act.difficulty}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/70 to-indigo-950/70 border border-cyan-400/40 text-center flex flex-col items-center gap-2.5 shadow-[0_0_40px_rgba(0,245,255,0.2)]">
                    <span className="text-base font-outfit font-black text-cyan-300 flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" /> Setup complete!
                    </span>
                    <p className="text-sm sm:text-base text-slate-200 max-w-lg">
                      Click the glowing button below to unlock the vibrant, colorful game world for {name}!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── NAVIGATION ACTION BUTTONS (SPACIOUS & UNCLIPPABLE) ── */}
            <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-6">
              {currentStep > 1 ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleBack}
                  className="h-14 px-8 rounded-2xl glass-btn text-slate-200 font-outfit font-bold text-base flex items-center gap-2.5 cursor-pointer shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5" /> Back
                </motion.button>
              ) : <div />}

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleNext}
                className={`h-14 px-9 rounded-2xl font-outfit font-black text-base flex items-center gap-3 cursor-pointer transition-all shadow-2xl ${
                  currentStep === 8
                    ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400 text-slate-950 shadow-[0_0_40px_rgba(0,245,255,0.7)]'
                    : 'btn-primary-lumi shimmer-sweep text-slate-950'
                }`}
              >
                <span>
                  {currentStep === 8 
                    ? 'ENTER COLORFUL GAME ZONE 🚀' 
                    : currentStep === 7 && currentQuestionIndex < screeningQuestions.length - 1
                    ? 'Next Question'
                    : 'Continue'}
                </span>
                <span className="text-xs font-bold bg-slate-950/20 text-slate-950 px-2.5 py-1 rounded-xl border border-slate-950/15">
                  ↵ Enter
                </span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </AestheticDarkBackground>
  );
}
