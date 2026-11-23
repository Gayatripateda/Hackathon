# Development Roadmap

This roadmap is a proposal, not a list of existing features. The phases are ordered to make the starter kit reliable before optional modules are added.

## Phase 1 — Make the current foundation reproducible

- Add a backend dependency manifest with supported version ranges or pinned versions.
- Add a root `.gitignore` for backend environments, Python caches, frontend build output, and local secret files.
- Decide whether `frontend/app/` remains the active application or whether the project should use a conventional `frontend/src/` layout. Remove ambiguity only after agreeing on the target.
- Document supported runtime versions and verify the setup from a clean clone.

## Phase 2 — Improve the basic API/frontend connection

- Move the frontend API base URL into local environment configuration, with a safe example file containing no secrets.
- Handle loading, HTTP error, and network error states consistently.
- Add focused backend tests for the root and health routes.
- Add an integration check for frontend/backend communication if the team has time and a suitable test setup.

## Phase 3 — Add only reusable modules needed by projects

Possible opt-in modules:

- File upload with file size/type validation and safe temporary storage.
- Document extraction and processing, with clear input-format limits.
- AI/model API calls performed by the backend, not with secret keys in browser code.
- Data-processing helpers.
- A database module if the project needs persistent data.
- Authentication only when user identity or protected data requires it.

Each module should include tests, configuration guidance, limitations, and an example. Avoid including unused dependencies in the base starter.

## Phase 4 — Demo, deployment, and maintenance

- Choose a hosting approach and document it. For example, build the Vite frontend and host its static output on a static-site service, and run FastAPI on a Python-capable app host or in a container. A single host or virtual private server is another option, but involves more deployment and operations work.
- Add safe production CORS settings, HTTPS, and deployment secrets configuration.
- Create reusable presentation, demo, and project-specific setup templates in `templates/` or `docs/presentations/` when those materials exist.
- Review dependencies and update the documentation when behavior changes.

## Completion criteria

A roadmap item is complete only when the code exists, its setup is documented, relevant checks pass, and the documentation does not claim more than the code does.
