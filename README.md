# Hackathon Starter Kit

A small React + Vite frontend connected to a Python + FastAPI backend. The goal is to grow this repository into a reusable starting point for hackathon projects. Today it demonstrates only the basic frontend-to-backend connection; AI, document processing, databases, authentication, and deployment are not implemented.

## Current features

- React page fetches the FastAPI `GET /` route and displays its response and connection state.
- FastAPI provides `GET /` and `GET /health`.
- CORS is configured for the local Vite origin `http://localhost:5173`.

## Quick start

Backend (PowerShell, from the repository root):

```powershell
Set-Location .\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install fastapi uvicorn
python -m uvicorn app.main:app --reload
```

Frontend (in a second PowerShell terminal, from the repository root):

```powershell
Set-Location .\frontend\app
npm ci
npm run dev
```

The backend install is currently manual because no backend dependency manifest exists. Visit `http://localhost:5173`; API docs are at `http://127.0.0.1:8000/docs`.

## Documentation

- [Project overview](docs/project-overview.md)
- [System architecture](docs/architecture/system-architecture.md)
- [Technical stack](docs/architecture/technical-stack.md)
- [Setup guide](docs/setup-guide.md)
- [Development roadmap](docs/development-roadmap.md)
- [Team workflow](docs/team-workflow.md)

The existing BHARAT DOC AI ideas are not part of the current implementation; see the project overview and roadmap for the distinction between current functionality and possible future work.