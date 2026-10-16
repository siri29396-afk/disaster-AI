# DisasterAI

DisasterAI is an offline-first disaster-preparedness PWA with a React/Vite frontend and a FastAPI backend. It provides bundled safety guides, local household planning, a checklist, an indicative readiness assessment, and optional OpenAI-backed chat, plan generation, and document summaries.

## Safety and data boundaries

- AI features require internet access and `OPENAI_API_KEY` on the backend.
- The app does not provide live alerts by default. `/api/alerts` explicitly reports that no official feed is configured.
- It does not invent emergency numbers or routes. Personal contacts and plans are stored in this browser using IndexedDB.
- Readiness results are indicative, not official ratings.
- Follow local authorities and emergency services during an active emergency.

## Windows local setup

Open PowerShell in this project folder. Install Python 3.11+ and Node.js LTS, then restart VS Code so the terminal refreshes PATH.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
Copy-Item .env.example .env
```

Add your own OpenAI key to `.env` locally; never commit it. Then start the backend in one terminal:

```powershell
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload --port 8000
```

Start the frontend in a second terminal:

```powershell
npm --prefix frontend ci
npm --prefix frontend run dev
```

Open the Vite URL printed in the frontend terminal (normally `http://localhost:5173`). The Vite server proxies `/api` to `http://127.0.0.1:8000`.

## Production build and local host

```powershell
npm --prefix frontend ci
npm --prefix frontend run build
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Open `http://127.0.0.1:8000`. FastAPI serves the built React app and API from one origin. API docs are at `http://127.0.0.1:8000/docs`; health is at `/api/health`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | For AI features | Server-side OpenAI secret; configure in Replit Secrets in deployment |
| `OPENAI_MODEL` | No | OpenAI model name; defaults to `gpt-4.1-mini` |
| `OPENAI_TIMEOUT_SECONDS` | No | Provider timeout in seconds; defaults to `30` |

## Tests

```powershell
.\.venv\Scripts\Activate.ps1
python -m pytest
npm --prefix frontend run build
```

Most backend provider behavior is tested with a mocked OpenAI call; live API billing is not required for the suite.

## Replit deployment

1. Import `https://github.com/siri29396-afk/disaster-AI` into Replit, or upload this project to a Replit workspace.
2. Confirm the workspace has Python 3.11+ and Node.js 22+; `.replit` builds the Vite frontend and starts FastAPI on the platform-provided `PORT`.
3. Add `OPENAI_API_KEY` in Replit Secrets. Optionally set `OPENAI_MODEL` and `OPENAI_TIMEOUT_SECONDS`.
4. Run the project and verify `/api/health`, `/docs`, the dashboard, and offline guides.
5. Use Replit's Deploy control to publish an HTTPS deployment. The deployment URL is assigned by Replit after deployment; it cannot be known in advance.

The service uses local browser storage and does not implement accounts or server-side synchronization. No live alert source or verified regional emergency-contact dataset is configured. Do not present the app as an official warning service.
