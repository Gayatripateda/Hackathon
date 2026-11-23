# Project Overview

## What this project is

This repository is intended to become a reusable full-stack starter kit for hackathon projects. Its current implementation is a small connection demo: a React frontend calls a FastAPI backend and displays the backend response.

The current code is not yet a reusable AI, document-processing, or data-analysis platform. Those are possible future uses of the starter kit, not features of this prototype.

## Problem the starter kit aims to solve

Hackathon teams often spend valuable time creating the same basic structure and wiring a frontend to a backend. A starter kit can provide a clear starting point so a team can focus sooner on the problem they are trying to solve.

That is the intended purpose. The repository currently demonstrates only the initial frontend/backend connection.

## Target users

- Students and small teams starting a hackathon project.
- Developers learning how a JavaScript frontend can call a Python API.
- Future teams who want to add features such as AI, file processing, or data analysis.

These are intended users, not a feature implemented by the application.

## Objectives

1. Keep a small, understandable React and FastAPI foundation.
2. Make frontend-to-backend communication easy to verify.
3. Add optional, reusable modules only when a project needs them.
4. Provide documentation that helps the team explain and extend the system.

## Implemented now

- A FastAPI application is defined in `backend/app/main.py`.
- The API has `GET /` and `GET /health` routes.
- CORS allows the Vite development origin `http://localhost:5173`.
- The React page fetches `GET http://127.0.0.1:8000/` when it loads.
- The page displays a connected or disconnected state and the returned message.
- The frontend has npm scripts for development, build, preview, and lint.

## Not implemented yet

The current code does not upload or parse documents, call an AI model, provide authentication, persist data, run analysis, or deploy the service. There are no API or frontend tests in the visible project files.

The existing root README mentions BHARAT DOC AI features such as PDF summaries, language simplification, chart understanding, evidence-based Q&A, and a “Trust Guard.” These are not present in the implementation inspected for this documentation. Treat them as a separate product idea unless the team intentionally changes the project's scope.

## Current limitations

- Backend dependencies are imported by the code but are not declared in a backend dependency manifest.
- The frontend API address is hard-coded in `frontend/app/src/App.jsx`.
- CORS is set for local development, not a deployed frontend.
- The frontend handles request failures with a generic message, not detailed diagnostics.
- No shared configuration, persistence, tests, or deployment setup is present.

## Security considerations

The current API has no authentication or persistence, and it does not accept file uploads. Do not treat it as production-ready or send private data to it. The CORS origin is limited to the local Vite development address, while credentials are enabled in the middleware configuration; review both settings deliberately before deployment. CORS is not a substitute for authentication or authorization.

Never commit API keys, passwords, tokens, or real user data. If future modules add uploads, AI APIs, accounts, or a database, validate inputs, keep external-service credentials on the backend, and document what data is stored or sent to external services.

## Future directions

Potential additions include a backend dependency manifest, configurable API URL, tests, file processing, AI integrations, a database, authentication when needed, deployment, and reusable demo materials. These are plans, not current capabilities; see the [development roadmap](./development-roadmap.md).
