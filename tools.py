GUIDES = {
    "flood": [
        "Monitor official flood warnings.",
        "Prepare essential supplies.",
        "Never enter or drive through floodwater.",
        "Follow official evacuation instructions.",
    ],
    "earthquake": [
        "Secure heavy furniture beforehand.",
        "Drop, Cover, and Hold On during shaking.",
        "Stay away from windows.",
        "Expect aftershocks.",
    ],
    "cyclone": [
        "Monitor official cyclone warnings.",
        "Secure loose outdoor objects.",
        "Stay inside a secure shelter.",
        "Wait for official clearance.",
    ],
    "landslide": [
        "Monitor rainfall and landslide warnings.",
        "Know official evacuation arrangements.",
        "Avoid unstable slopes.",
        "Stay away from affected areas.",
    ],
    "wildfire": [
        "Monitor official wildfire advisories.",
        "Prepare emergency supplies.",
        "Follow evacuation orders.",
        "Avoid smoke exposure where possible.",
    ],
}

CHECKLIST = [
    "Drinking water",
    "Non-perishable food",
    "First aid kit",
    "Flashlight",
    "Spare batteries",
    "Power bank",
    "Essential medicines",
    "Important documents",
    "Emergency contacts",
    "Emergency radio",
]


def get_disaster_guide(disaster_type: str) -> list[str] | None:
    """Return preparedness guidance for a supported disaster type."""
    return GUIDES.get(disaster_type.strip().lower())


def generate_checklist() -> list[str]:
    """Return the items for a basic emergency supply kit."""
    return CHECKLIST.copy()