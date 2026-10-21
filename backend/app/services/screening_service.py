from typing import Dict, Any, List

TODDLER_SCREENING_ITEMS = [
    {
        "id": "todd_1",
        "question": "Does your child look at you to share excitement when they see something interesting (e.g., pointing out an airplane or cute animal)?",
        "domain": "Social Interaction",
        "options": [
            {"label": "Yes, often", "score": 0},
            {"label": "Sometimes", "score": 1},
            {"label": "Rarely or not yet", "score": 2}
        ]
    },
    {
        "id": "todd_2",
        "question": "When you call your child’s name in a quiet room, do they usually turn their head or acknowledge you?",
        "domain": "Social Interaction",
        "options": [
            {"label": "Yes, almost always", "score": 0},
            {"label": "Sometimes / depends on focus", "score": 1},
            {"label": "Rarely, even with repeated calls", "score": 2}
        ]
    },
    {
        "id": "todd_3",
        "question": "How does your child communicate their wants or needs (e.g., asking for juice or a toy)?",
        "domain": "Communication",
        "options": [
            {"label": "Uses words or word approximations", "score": 0},
            {"label": "Uses pointing, gestures, or visual symbols / AAC", "score": 0},
            {"label": "Takes your hand and pulls you toward items without pointing or looking", "score": 1},
            {"label": "Experiences significant frustration expressing needs", "score": 2}
        ]
    },
    {
        "id": "todd_4",
        "question": "Does your child engage in simple pretend play (e.g., pretending to feed a teddy bear, talk on a toy phone, or drive a car)?",
        "domain": "Play & Imagination",
        "options": [
            {"label": "Yes, regularly", "score": 0},
            {"label": "Sometimes with encouragement", "score": 1},
            {"label": "Prefers lining up or inspecting parts of toys (e.g., spinning wheels)", "score": 2}
        ]
    },
    {
        "id": "todd_5",
        "question": "Does your child cover their ears, get distressed, or seek to escape common everyday sounds (e.g., blender, vacuum, hair dryer)?",
        "domain": "Sensory",
        "options": [
            {"label": "Rarely / typical reaction", "score": 0},
            {"label": "Sometimes for loud or unexpected noises", "score": 1},
            {"label": "Frequently distressed by everyday sounds", "score": 2}
        ]
    },
    {
        "id": "todd_6",
        "question": "Does your child show rhythmic, repetitive movements when excited or overwhelmed (e.g., hand-flapping, rocking, spinning)?",
        "domain": "Routines & Repetitive",
        "options": [
            {"label": "Rarely", "score": 0},
            {"label": "Occasionally when very happy or excited", "score": 1},
            {"label": "Frequently throughout the day", "score": 2}
        ]
    },
    {
        "id": "todd_7",
        "question": "How does your child handle changes to familiar routines (e.g., a different route to preschool, changing caregivers)?",
        "domain": "Adaptive & Daily Living",
        "options": [
            {"label": "Adapts smoothly with brief preparation", "score": 0},
            {"label": "Needs extra time and comforting", "score": 1},
            {"label": "Experiences intense distress or prolonged meltdowns", "score": 2}
        ]
    },
    {
        "id": "todd_8",
        "question": "What are your child’s noticeable developmental strengths and areas of delight?",
        "domain": "Strengths",
        "options": [
            {"label": "Strong visual memory, puzzles, or pattern recognition", "score": 0},
            {"label": "Deep curiosity, focus, and passion for specific topics", "score": 0},
            {"label": "Affectionate, musical, or kinesthetic / physical energy", "score": 0},
            {"label": "All of the above in different moments", "score": 0}
        ]
    }
]

CAST_SCREENING_ITEMS = [
    {
        "id": "cast_1",
        "question": "Does your child join in playing games with other children easily?",
        "domain": "Social Interaction",
        "options": [{"label": "Yes", "score": 0}, {"label": "No", "score": 1}]
    },
    {
        "id": "cast_2",
        "question": "Does your child come up to you spontaneously for a chat or conversation?",
        "domain": "Communication",
        "options": [{"label": "Yes", "score": 0}, {"label": "No", "score": 1}]
    },
    {
        "id": "cast_3",
        "question": "Was your child speaking by 2 years old?",
        "domain": "Developmental History",
        "options": [{"label": "Yes", "score": 0}, {"label": "No", "score": 1}]
    },
    {
        "id": "cast_4",
        "question": "Does your child enjoy sports or physical games?",
        "domain": "Play",
        "options": [{"label": "Yes", "score": 0}, {"label": "No", "score": 0}]
    },
    {
        "id": "cast_5",
        "question": "Is it important to your child that routines and activities are kept the same?",
        "domain": "Routines & Repetitive",
        "options": [{"label": "Yes", "score": 1}, {"label": "No", "score": 0}]
    },
    {
        "id": "cast_6",
        "question": "Can your child easily imagine what someone else might be thinking or feeling?",
        "domain": "Social Interaction",
        "options": [{"label": "Yes", "score": 0}, {"label": "No", "score": 1}]
    },
    {
        "id": "cast_7",
        "question": "Does your child have an extraordinarily good memory for details (e.g. timetables, dates, facts)?",
        "domain": "Strengths & Interests",
        "options": [{"label": "Yes", "score": 1}, {"label": "No", "score": 0}]
    },
    {
        "id": "cast_8",
        "question": "Does your child have sensory sensitivities (e.g. noticing very quiet sounds, textures of clothing)?",
        "domain": "Sensory",
        "options": [{"label": "Yes", "score": 1}, {"label": "No", "score": 0}]
    },
    {
        "id": "cast_9",
        "question": "Does your child tend to take phrases very literally or find indirect jokes confusing?",
        "domain": "Communication",
        "options": [{"label": "Yes", "score": 1}, {"label": "No", "score": 0}]
    },
    {
        "id": "cast_10",
        "question": "Does your child make comfortable, natural eye contact when speaking or listening to you?",
        "domain": "Social Interaction",
        "options": [{"label": "Yes", "score": 0}, {"label": "No", "score": 1}]
    },
    {
        "id": "cast_11",
        "question": "Does your child have an intense area of fascination that they enjoy talking about deeply?",
        "domain": "Strengths & Interests",
        "options": [{"label": "Yes", "score": 1}, {"label": "No", "score": 0}]
    },
    {
        "id": "cast_12",
        "question": "Does your child sometimes find unpredictable group situations or loud classrooms overwhelming?",
        "domain": "Sensory & Routines",
        "options": [{"label": "Yes", "score": 1}, {"label": "No", "score": 0}]
    }
]

class ScreeningService:
    @staticmethod
    def get_instrument_questions(instrument: str) -> Dict[str, Any]:
        inst_lower = (instrument or "").lower()
        if "todd" in inst_lower or "18" in inst_lower or "early" in inst_lower:
            return ScreeningService.get_instrument_for_age(2)
        else:
            return ScreeningService.get_instrument_for_age(6)

    @staticmethod
    def evaluate(instrument: str, answers: Dict[str, int]) -> Dict[str, Any]:
        inst_lower = (instrument or "").lower()
        age = 2 if ("todd" in inst_lower or "18" in inst_lower) else 6
        return ScreeningService.evaluate_screening(age, answers)

    @staticmethod
    def get_instrument_for_age(age_years: int) -> Dict[str, Any]:
        """Selects verified age-appropriate screening tool."""
        if age_years < 4:
            return {
                "instrument_name": "Toddler Early Developmental Milestones",
                "instrument_version": "1.0",
                "intended_age_range": "18 months – 3 years",
                "description": "Evidence-informed developmental observation questions for joint attention, early communication, and sensory processing.",
                "questions": TODDLER_SCREENING_ITEMS
            }
        else:
            return {
                "instrument_name": "Childhood Autism Spectrum Test (CAST - Caregiver Screening)",
                "instrument_version": "2.0-subset",
                "intended_age_range": "4 – 11 years",
                "description": "Standardized developmental observation questionnaire referenced from the CAST instrument.",
                "questions": CAST_SCREENING_ITEMS
            }

    @staticmethod
    def evaluate_screening(age_years: int, answers: Dict[str, int]) -> Dict[str, Any]:
        """
        Evaluates screening answers using verified scoring rules.
        Screening is always framed as observational guidance, never as a clinical diagnosis.
        """
        is_toddler = age_years < 4
        items = TODDLER_SCREENING_ITEMS if is_toddler else CAST_SCREENING_ITEMS

        total_score = 0
        domain_scores: Dict[str, int] = {}
        items_answered = 0

        for item in items:
            q_id = item["id"]
            if q_id in answers:
                score = int(answers[q_id])
                total_score += score
                domain = item["domain"]
                domain_scores[domain] = domain_scores.get(domain, 0) + score
                items_answered += 1

        referral_recommended = False
        if is_toddler:
            referral_recommended = total_score >= 4
            if referral_recommended:
                guidance_text = (
                    "Caregiver observations indicate differences in early communication, joint attention, or sensory preferences. "
                    "A developmental consultation with a pediatrician or speech-language therapist is recommended for comprehensive guidance."
                )
            else:
                guidance_text = (
                    "Observations align with emerging developmental milestones. Continue supportive interactive play, communication modeling, and sensory comfort."
                )
        else:
            referral_recommended = total_score >= 3
            if referral_recommended:
                guidance_text = (
                    "Observations show notable traits in social communication or sensory routines. "
                    "Sharing these observations with an educational psychologist or developmental specialist may provide helpful personalized support."
                )
            else:
                guidance_text = (
                    "Observations suggest steady developmental navigation with unique personal strengths. Continue engaging in preferred learning interests."
                )

        return {
            "instrument_name": "Toddler Early Milestones" if is_toddler else "CAST-Referenced Questionnaire",
            "intended_age_range": "18m–3y" if is_toddler else "4–11y",
            "total_score": float(total_score),
            "items_answered": items_answered,
            "total_items": len(items),
            "domain_scores": domain_scores,
            "interpretation": "Follow-up developmental discussion may be helpful" if referral_recommended else "Supportive developmental practice recommended",
            "guidance_text": guidance_text,
            "referral_recommended": referral_recommended,
            "non_diagnostic_disclaimer": (
                "LUMI screening is a caregiver observational tool, NOT a diagnostic test. "
                "It cannot determine autism spectrum status or clinical severity. Always consult qualified healthcare professionals."
            )
        }
