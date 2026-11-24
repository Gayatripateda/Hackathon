# Hackathon Starter Kit

A minimal React + Vite frontend connected to a Python + FastAPI backend. The current app demonstrates a basic API connection; AI, document processing, databases, authentication, and deployment are not implemented.

## Run locally

Start the backend in PowerShell:

```powershell
Set-Location .\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install fastapi uvicorn
python -m uvicorn app.main:app --reload
```

In a second terminal, start the frontend:

```powershell
Set-Location .\frontend
npm.cmd ci
npm.cmd run dev
```

Open the address printed by Vite (usually `http://localhost:5173`). FastAPI's interactive API page is at `http://127.0.0.1:8000/docs`.

The backend install is currently manual because the repository does not yet include a Python dependency manifest.

## Project guide

See [docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md) for the architecture, setup, current scope, security notes, roadmap, and team workflow.
