# Hackathon Starter Kit — Project Guide

This guide describes the code currently in the repository. Features marked **planned** are ideas only; they are not implemented.

## Project overview

The goal is to create a reusable full-stack starting point for hackathon projects. A small React interface and FastAPI backend are already connected, so a team can build on a working web/API foundation instead of starting from nothing.

### Problem and intended users

Hackathon teams often spend time setting up the same basic frontend/backend structure. A reusable foundation can help students and small development teams focus earlier on their specific problem.

The project is also suitable for learners who want to understand how a browser application communicates with a Python API. The repository currently demonstrates this connection; it is not yet a full-featured starter platform.

### Objectives

- Keep the base application small and understandable.
- Make frontend-to-backend communication straightforward to run and verify.
- Add reusable modules only when real projects need them.
- Document the code clearly enough for a teammate to explain and extend it.

## Current features and limitations

### Implemented

- FastAPI application in `backend/app/main.py`.
- `GET /` returns a greeting and success status.
- `GET /health` returns a healthy status.
- `POST /api/ai/chat` sends a prompt to the Gemini API using a key held by the backend.
- CORS allows the local Vite origin `http://localhost:5173`.
- The React page calls `GET http://127.0.0.1:8000/` when it loads and provides a prompt form for the AI route.
- The page displays the backend response or a generic disconnected message.
- Frontend npm scripts provide development, production build, preview, and lint commands.

### Not implemented

There is no document upload or parsing, database, authentication, data-analysis module, chat history, streaming, or deployment setup. The previous BHARAT DOC AI ideas are not implemented features.

The first AI module supports Gemini only. Its default model is configurable, prompts and replies are not stored, and the backend does not impose user authentication or its own rate limit. CORS is configured for local development, not production.

## Project layout

```text
Hackathon/
├── README.md                   Short project introduction and quick start
├── .gitignore                  Excludes local environments, caches, and build output
├── backend/
│   ├── .env.example                Safe configuration template; contains no real key
│   ├── requirements.txt            Python runtime dependencies
│   ├── app/
│   │   ├── main.py                 FastAPI app, CORS configuration, and router registration
│   │   ├── config.py               Reads AI settings and local environment variables
│   │   ├── api/
│   │   │   └── ai.py               Validates the AI chat request and response
│   │   └── services/
│   │       ├── ai_service.py       Selects the configured provider
│   │       └── providers/
│   │           └── gemini.py       Calls Gemini from the backend
│   └── tests/
│       ├── test_ai_api.py          Tests the chat route without provider calls
│       └── test_gemini_provider.py Tests the provider adapter with mock responses
├── docs/
│   └── PROJECT_GUIDE.md        Architecture, setup, roadmap, and collaboration guide
└── frontend/
    ├── package.json            Frontend dependencies and npm commands
    ├── package-lock.json       Locked frontend dependency versions
    ├── index.html              Browser page loaded by Vite
    ├── vite.config.js          Vite development/build configuration
    ├── eslint.config.js        JavaScript lint rules
    ├── public/
    │   └── favicon.svg         Browser tab icon
    └── src/
        ├── main.jsx            React application entry point
        ├── App.jsx             Existing connection demo plus AI section
        ├── index.css           Global and AI section styles
        ├── components/
        │   └── AiChat.jsx      Prompt form and reply display
        └── services/
            └── aiApi.js        Browser-to-FastAPI request helper
```

The current provider boundary lives in `services/ai_service.py`; adding a provider later should not require provider credentials or API logic in React.

### Switching providers

The current implementation supports `AI_PROVIDER=gemini` only. The setting is read by the backend. To add another provider later, add a backend adapter that accepts the prompt and returns reply text, then select that adapter inside `ai_service.py`. Keep the frontend request (`POST /api/ai/chat`) and response (`{ "reply": "..." }`) the same. Provider keys and provider URLs must remain server-side; never accept an arbitrary provider URL or API key from the browser.

## Technology stack

| Technology | Purpose in this project |
|---|---|
| JavaScript | Implements the browser UI and HTTP request. |
| React | Renders the interface from components; the current app has one `App` component. |
| Vite | Runs the frontend development server and builds frontend assets. |
| npm | Installs frontend packages and runs project scripts. |
| Python | Runs the backend application. |
| FastAPI | Defines the HTTP API endpoints and interactive API documentation. |
| CORS middleware | Allows the local browser frontend to call the backend on another port. |

The environment used to create the project has Python 3.12 and Node.js/npm. The repository does not pin their versions.

## How the frontend communicates with the backend

```mermaid
flowchart LR
    Browser[Browser] -->|load page| Vite[Vite :5173]
    Vite --> React[React app]
    React -->|GET / and POST /api/ai/chat| API[FastAPI :8000]
    API -->|HTTPS request with backend-held key| Gemini[Gemini API]
    Gemini -->|Generated text| API
    API -->|JSON response| React
    React --> Browser
    Browser -. optional direct check .->|GET /health| API
```

When `App.jsx` loads, it calls the browser's built-in `fetch` function to check the backend root route. When the user submits a prompt, `AiChat.jsx` calls `POST /api/ai/chat` through `aiApi.js`. FastAPI validates the prompt, calls `ai_service.py`, and the Gemini adapter sends an HTTPS request. The API key is added by the backend as a request header and never sent to the browser. The browser receives only the generated reply or a safe error message.

FastAPI also provides interactive docs at `http://127.0.0.1:8000/docs` while the backend is running.

## Setup and checks

### Requirements

- Windows PowerShell.
- Node.js and npm.
- Python.
- Git to clone or synchronize the project.

### Install and run

Start the backend from the repository root:

```powershell
Set-Location .\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
notepad .env
python -m uvicorn app.main:app --reload
```

In the local `backend\.env` file, set `GEMINI_API_KEY` and, if desired, `GEMINI_MODEL`. The checked-in `.env.example` documents the variables but has no real credential. The root `.gitignore` excludes `.env`. Never use a `VITE_` variable for an API key: Vite makes those values public in frontend assets.

In a second PowerShell terminal, start the frontend:

```powershell
Set-Location .\frontend
npm.cmd ci
npm.cmd run dev
```

Open the local address printed by Vite, normally `http://localhost:5173`. Both servers must remain running.

### Check the API and frontend

With the backend running, use PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/
Invoke-RestMethod http://127.0.0.1:8000/health
```

On the Vite page, the backend status should change to connected when the API is reachable. If the Gemini key is configured, submit a prompt in the AI section. The endpoint can also be called directly:

```powershell
Invoke-RestMethod -Method Post `
  -Uri http://127.0.0.1:8000/api/ai/chat `
  -ContentType 'application/json' `
  -Body (@{ prompt = 'Explain what an API is in one sentence.' } | ConvertTo-Json)
```

If the backend is not reachable, check that both servers are running and that the browser uses the allowed `http://localhost:5173` origin. If Gemini returns a rate limit or service error, the page displays the backend's safe error message.

Run the configured frontend checks from `frontend/`:

```powershell
npm.cmd run lint
npm.cmd run build
```

Run the backend unit tests from `backend/`:

```powershell
python -m unittest discover -s tests -v
```

Provider tests use a mocked Gemini response and do not require a key or make a paid API call.

## Security notes

- The API has no authentication, request rate limiting, persistence, or upload handling. Do not expose it publicly without cost/abuse controls.
- The CORS origin is limited to local development. CORS is not a replacement for authentication.
- Credentials are enabled in the current CORS configuration; review that setting and allowed origins before deployment.
- The Gemini key is read by FastAPI from its environment. Never commit API keys, passwords, tokens, or real user data.
- The default model is `gemini-3.5-flash-lite`; review Google's current [model documentation](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite), [pricing](https://ai.google.dev/gemini-api/docs/pricing), and [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) before a demo because model availability and quotas can change.
- Google's current [Gemini API terms](https://ai.google.dev/gemini-api/terms) state users must be 18 or older. Unpaid Gemini usage may allow prompts and responses to be used to improve Google services and may involve human review. Do not submit sensitive or confidential content, and check age and regional eligibility before use.
- If adding file uploads, validate file type and size and handle stored files safely.
- Do not log provider keys, authorization headers, or sensitive prompts. Rotate a key immediately if it is exposed.

## Git and GitHub workflow

The current branch is `main` and its configured remote is `origin`. A simple team workflow is:

1. Check `git status` and preserve any uncommitted changes.
2. Update the local `main` branch when its worktree is ready.
3. Create a small feature branch, such as `feature/file-upload`.
4. Agree on API routes and request/response shapes before frontend and backend work proceed in parallel.
5. Make a focused change and run the relevant checks.
6. Review `git diff`; stage only the intended files.
7. Push the branch and open a pull request for the teammate to review.
8. Merge after feedback is resolved and the change still works.

Useful commands:

```powershell
git status
git switch main
git pull
git switch -c feature/short-description
git diff
git add <specific-file-or-folder>
git commit -m "Describe the change"
git push -u origin feature/short-description
```

These are general recommendations, not an automated workflow configured in this repository. Do not stage secrets, local virtual environments, installed dependencies, or generated build output.

### Suggested collaboration

One teammate can lead the frontend for a feature and the other the backend, but agree on the API contract first. Both teammates should test the full flow, review each other's changes, and update this guide when behavior changes. Rotate roles to learn both sides.

## Deployment possibilities

No deployment target or configuration is currently included. A future deployment could build the Vite frontend and host its static output, while running FastAPI on a Python-capable app host or in a container. A single host or virtual private server is another option but needs more deployment and operations work.

Before deploying, configure HTTPS, production CORS origins, and secret storage, and test the deployed frontend/API connection.

## Development roadmap

The following are proposed steps, not completed features:

1. **Improve the basic app:** document supported Python/Node versions and verify a clean-clone setup.
2. **Improve AI integration:** add another provider adapter only when needed; compare provider data policies and prices, then add a configuration option and tests without changing the frontend response format.
3. **Add optional modules as needed:** file uploads, document processing, data processing, database persistence, and authentication where justified. Keep each module tested and separately documented.
4. **Prepare deployment and demos:** choose a hosting approach, add production configuration, and create presentation/demo templates when the team needs them.

Do not add optional services or complexity until a project needs them. Mark a roadmap item complete only after the code exists, relevant checks pass, and its limits are documented.
