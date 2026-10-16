ASSESSMENT_QUESTIONS = {
    "supplies": "Do you have essential emergency supplies for your household?",
    "communication": "Does your household have a plan for contacting one another?",
    "meeting_place": "Have you chosen a meeting place if household members are separated?",
    "documents": "Are important documents stored so you can access them if needed?",
    "evacuation": "Do you know where local authorities publish evacuation instructions?",
    "contacts": "Do you have important emergency contacts saved somewhere accessible?",
    "medications": "Have you planned for essential medicines and accessibility needs?",
    "household_needs": "Does your plan account for children, older adults, or pets?",
}

ASSESSMENT_RECOMMENDATIONS = {
    "supplies": "Prepare water, food, first aid, lighting, and other household-specific essentials.",
    "communication": "Agree on an out-of-area contact and how household members will check in.",
    "meeting_place": "Choose meeting places and make sure every household member knows them.",
    "documents": "Keep copies of important documents protected and accessible.",
    "evacuation": "Learn where local authorities publish evacuation instructions; do not rely on unverified routes.",
    "contacts": "Save trusted contacts and verify emergency numbers with official local sources.",
    "medications": "Plan for prescribed medicines, assistive devices, and other individual needs.",
    "household_needs": "Include household members and pets who may need additional assistance.",
}

GUIDES = {
    "flood": {
        "title": "Flood",
        "before": ["Monitor local authority warnings.", "Protect important documents and prepare household supplies.", "Learn where to find official evacuation instructions."],
        "during": ["Move away from floodwater.", "Never walk or drive through floodwater.", "Follow instructions from local authorities."],
        "after": ["Return only when authorities say it is safe.", "Avoid damaged buildings and electrical equipment.", "Follow official drinking-water advisories."],
        "source": "https://www.ready.gov/floods",
    },
    "earthquake": {
        "title": "Earthquake",
        "before": ["Secure heavy furniture.", "Identify safer places in each room.", "Practice Drop, Cover, and Hold On."],
        "during": ["Drop, Cover, and Hold On.", "Stay away from windows.", "If outdoors, move away from buildings and power lines."],
        "after": ["Expect aftershocks.", "Avoid damaged structures.", "Follow official emergency instructions."],
        "source": "https://www.ready.gov/earthquakes",
    },
    "cyclone": {
        "title": "Cyclone",
        "before": ["Monitor official cyclone warnings.", "Secure loose outdoor objects.", "Prepare supplies and review official evacuation arrangements."],
        "during": ["Stay in a secure shelter and away from windows.", "Follow local authority instructions.", "Do not go outside during a temporary lull."],
        "after": ["Avoid fallen electrical wires.", "Stay away from damaged buildings.", "Wait for official clearance before returning."],
        "source": "https://www.ready.gov/hurricanes",
    },
    "landslide": {
        "title": "Landslide",
        "before": ["Learn about local slope hazards.", "Monitor official rainfall warnings.", "Know how to receive local evacuation instructions."],
        "during": ["Follow official evacuation instructions.", "Stay away from unstable slopes and affected waterways.", "Do not enter restricted areas."],
        "after": ["Stay away from the affected area.", "Watch for additional slope movement.", "Follow local authority instructions."],
        "source": "https://www.ready.gov/landslides-debris-flow",
    },
    "tsunami": {
        "title": "Tsunami",
        "before": ["Learn whether your area has tsunami risk.", "Know local evacuation procedures and official alert sources.", "Prepare essential supplies."],
        "during": ["Follow official evacuation instructions immediately.", "Move away from the coast as directed by authorities.", "Do not return until officials give the all-clear."],
        "after": ["Stay away from flooded and damaged areas.", "More than one wave may occur.", "Follow official updates before returning."],
        "source": "https://www.ready.gov/tsunamis",
    },
    "heatwave": {
        "title": "Heatwave",
        "before": ["Plan how to stay cool and hydrated.", "Check on people who may need assistance.", "Learn local heat-health guidance."],
        "during": ["Follow local health authority advice.", "Limit strenuous activity during the hottest periods.", "Seek urgent medical help for signs of heat illness."],
        "after": ["Continue checking on household members.", "Follow local health advisories.", "Replace used supplies."],
        "source": "https://www.ready.gov/heat",
    },
    "wildfire": {
        "title": "Wildfire",
        "before": ["Monitor official wildfire advisories.", "Prepare essential supplies and important documents.", "Plan how to receive evacuation notifications."],
        "during": ["Follow official evacuation orders.", "Avoid smoke exposure where possible.", "Do not enter restricted fire areas."],
        "after": ["Return only after official clearance.", "Avoid unstable or damaged structures.", "Follow local air-quality advisories."],
        "source": "https://www.ready.gov/wildfires",
    },
    "severe-storm": {
        "title": "Severe storm",
        "before": ["Monitor official weather alerts.", "Secure loose outdoor objects when safe.", "Prepare a way to receive emergency information."],
        "during": ["Follow official shelter instructions.", "Stay away from windows during severe conditions.", "Avoid flooded roads and downed power lines."],
        "after": ["Avoid damaged buildings and power lines.", "Follow official cleanup and water advisories.", "Wait for authorities before entering restricted areas."],
        "source": "https://www.ready.gov/thunderstorms-lightning",
    },
    "general": {
        "title": "General preparedness",
        "before": ["Make a household communication plan.", "Prepare supplies for household needs.", "Keep copies of important documents accessible."],
        "during": ["Follow official instructions for your location.", "Use trusted official channels for current information.", "Contact local emergency services if in immediate danger."],
        "after": ["Return only when authorities say it is safe.", "Avoid damaged utilities and structures.", "Check household members and follow official advisories."],
        "source": "https://www.ready.gov/plan",
    },
}


def get_disaster_guide(disaster_type: str) -> dict | None:
    return GUIDES.get(disaster_type.strip().lower())


def generate_checklist() -> list[str]:
    return [
        "Drinking water", "Nonperishable food", "First-aid supplies",
        "Essential prescribed medicines", "Flashlight and spare batteries",
        "Charged power bank", "Copies of important documents",
        "Personal hygiene supplies", "Battery-powered or hand-crank radio", "Whistle",
    ]


def assess_readiness(answers: dict[str, bool]) -> dict:
    unknown_answers = set(answers) - set(ASSESSMENT_QUESTIONS)
    if unknown_answers:
        raise ValueError("Answers contain unknown question identifiers")

    missing_answers = [key for key in ASSESSMENT_QUESTIONS if key not in answers]
    missing_preparations = [
        {"id": key, "recommendation": ASSESSMENT_RECOMMENDATIONS[key]}
        for key, prepared in answers.items()
        if not prepared
    ]
    complete = not missing_answers

    return {
        "complete": complete,
        "answered": len(answers),
        "total": len(ASSESSMENT_QUESTIONS),
        "score": round(sum(answers.values()) / len(ASSESSMENT_QUESTIONS) * 100) if complete else None,
        "is_illustrative": True,
        "missing_answers": missing_answers,
        "missing_preparations": missing_preparations,
    }
