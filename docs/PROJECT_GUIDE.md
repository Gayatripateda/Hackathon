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
- CORS allows the local Vite origin `http://localhost:5173`.
- The React page calls `GET http://127.0.0.1:8000/` when it loads.
- The page displays the backend response or a generic disconnected message.
- Frontend npm scripts provide development, production build, preview, and lint commands.

### Not implemented

There is no document upload or parsing, AI/model integration, database, authentication, data-analysis module, deployment setup, or automated test suite. The previous BHARAT DOC AI ideas are not implemented features.

The backend has no dependency manifest, so its dependencies are currently installed manually. The API URL is hard-coded in the React page, and the CORS configuration is for local development rather than production.

## Project layout

```text
Hackathon/
├── README.md                   Short project introduction and quick start
├── .gitignore                  Excludes local environments, caches, and build output
├── backend/
│   └── app/
│       └── main.py             FastAPI app, CORS configuration, and routes
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
        ├── App.jsx             Current backend connection demo
        └── index.css           Global page styles
```

There are no frontend component/page modules yet; add them when the UI grows. The backend `api/` and `services/` modules can likewise be introduced when the backend grows beyond its current two routes. Git does not track empty folders.

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
    React -->|GET http://127.0.0.1:8000/| API[FastAPI :8000]
    API -->|JSON response| React
    React --> Browser
    Browser -. optional direct check .->|GET /health| API
```

When `App.jsx` loads, it calls the browser's built-in `fetch` function with the backend URL. FastAPI returns JSON, and React displays the response. The page handles a network or HTTP error by showing a generic disconnected message. The `/health` endpoint can be checked directly, but the React page does not call it.

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
python -m pip install fastapi uvicorn
python -m uvicorn app.main:app --reload
```

In a second PowerShell terminal, start the frontend:

```powershell
Set-Location .\frontend
npm.cmd ci
npm.cmd run dev
```

Open the local address printed by Vite, normally `http://localhost:5173`. Both servers must remain running.

The FastAPI and Uvicorn install shown above is a manual workaround because no backend dependency manifest is present. It does not pin dependency versions.

### Check the API and frontend

With the backend running, use PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/
Invoke-RestMethod http://127.0.0.1:8000/health
```

On the Vite page, the backend status should change to connected when the API is reachable. If it is not, check that both servers are running and that the browser uses the allowed `http://localhost:5173` origin.

Run the configured frontend checks from `frontend/`:

```powershell
npm.cmd run lint
npm.cmd run build
```

These are lint and build checks; the repository does not currently have a configured automated test suite.

## Security notes

- This prototype has no authentication, authorization, persistence, or upload handling. Do not treat it as production-ready or send private data to it.
- The CORS origin is limited to local development. CORS is not a replacement for authentication.
- Credentials are enabled in the current CORS configuration; review that setting and allowed origins before deployment.
- Never commit API keys, passwords, tokens, or real user data.
- If adding file uploads, validate file type and size and handle stored files safely.
- If adding an AI provider, call it from the backend and keep its secret key out of browser code.

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

1. **Make setup reproducible:** add a Python dependency manifest, document supported versions, and verify a clean-clone setup.
2. **Improve the basic app:** configure the frontend API URL, make request states clearer, and add focused API tests.
3. **Add optional modules as needed:** file uploads, document processing, AI APIs, data processing, database persistence, and authentication where justified. Keep each module tested and separately documented.
4. **Prepare deployment and demos:** choose a hosting approach, add production configuration, and create presentation/demo templates when the team needs them.

Do not add optional services or complexity until a project needs them. Mark a roadmap item complete only after the code exists, relevant checks pass, and its limits are documented.
