import io

from fastapi.testclient import TestClient

import main
from disasterai_service import ASSESSMENT_QUESTIONS

client = TestClient(main.app)


def test_health_and_hazards():
    assert client.get("/api/health").json()["status"] == "running"
    hazards = client.get("/api/disasters").json()["disasters"]
    assert len(hazards) == 9
    assert "tsunami" in hazards
    assert client.get("/api/guide/heatwave").json()["title"] == "Heatwave"
    assert client.get("/api/guide/unknown").status_code == 404


def test_readiness_requires_every_answer_for_score():
    partial = client.post("/api/assessment", json={"answers": {"supplies": True}})
    assert partial.status_code == 200
    assert partial.json()["score"] is None
    assert partial.json()["complete"] is False

    complete = client.post(
        "/api/assessment",
        json={"answers": {key: True for key in ASSESSMENT_QUESTIONS}},
    )
    assert complete.status_code == 200
    assert complete.json()["score"] == 100
    assert complete.json()["is_illustrative"] is True


def test_readiness_rejects_unknown_and_non_boolean_answers():
    assert client.post("/api/assessment", json={"answers": {"unknown": True}}).status_code == 422
    assert client.post("/api/assessment", json={"answers": {"supplies": "yes"}}).status_code == 422


def test_alert_and_contact_endpoints_do_not_fabricate_data():
    assert client.get("/api/alerts").json() == {
        "configured": False,
        "alerts": [],
        "message": "No verified official alert feed is configured for this deployment.",
    }
    assert client.get("/api/contacts").json()["contacts"] == []


def test_chat_uses_backend_provider_and_validates_payload(monkeypatch):
    monkeypatch.setattr(main, "ask_disaster_ai", lambda **kwargs: "Prepared test guidance")
    response = client.post(
        "/api/chat",
        json={"message": "How do I prepare?", "language": "English", "disaster_type": "flood"},
    )
    assert response.status_code == 200
    assert response.json()["powered_by"] == "OpenAI"
    assert response.json()["response"] == "Prepared test guidance"
    assert client.post("/api/chat", json={"message": "", "language": "English"}).status_code == 422
    assert client.post("/api/chat", json={"message": "Hi", "language": "French"}).status_code == 422


def test_chat_includes_bounded_follow_up_context(monkeypatch):
    captured = {}
    monkeypatch.setattr(main, "ask_disaster_ai", lambda **kwargs: captured.update(kwargs) or "Answer")
    response = client.post(
        "/api/chat",
        json={
            "message": "What should I add?",
            "history": [{"role": "user", "content": "How do I prepare for a flood?"}],
        },
    )
    assert response.status_code == 200
    assert "How do I prepare for a flood?" in captured["message"]
    too_many_turns = [{"role": "user", "content": "context"}] * 11
    assert client.post("/api/chat", json={"message": "Hello", "history": too_many_turns}).status_code == 422


def test_plan_handles_provider_failure(monkeypatch):
    def unavailable(**kwargs):
        raise RuntimeError("provider unavailable")

    monkeypatch.setattr(main, "ask_disaster_ai", unavailable)
    response = client.post("/api/plan", json={"disaster_type": "flood", "family_members": 3})
    assert response.status_code == 503
    assert "offline" in response.json()["detail"].lower()
    assert client.post("/api/plan", json={"disaster_type": "flood", "family_members": 0}).status_code == 422


def test_document_upload_validation_and_summary(monkeypatch):
    unsupported = client.post(
        "/api/documents/summarize",
        files={"file": ("notes.csv", b"text", "text/csv")},
    )
    assert unsupported.status_code == 415

    malformed_pdf = client.post(
        "/api/documents/summarize",
        files={"file": ("notes.pdf", b"not a PDF", "application/pdf")},
    )
    assert malformed_pdf.status_code == 422

    monkeypatch.setattr(main, "process_document", lambda text, task, language="English": "Test summary")
    summary = client.post(
        "/api/documents/summarize",
        files={"file": ("guide.txt", io.BytesIO(b"Official preparation text."), "text/plain")},
    )
    assert summary.status_code == 200
    assert summary.json()["summary"] == "Test summary"
    assert summary.json()["ai_generated"] is True

    answer = client.post(
        "/api/documents/ask",
        data={"question": "What does this guide recommend?", "language": "English"},
        files={"file": ("guide.txt", b"Official preparation text.", "text/plain")},
    )
    assert answer.status_code == 200
    assert answer.json()["answer"] == "Test summary"


def test_production_frontend_routes_are_served():
    home = client.get("/")
    assert home.status_code == 200
    assert "DisasterAI" in home.text
    assert client.get("/assistant").status_code == 200
    assert client.get("/sw.js").status_code == 200
