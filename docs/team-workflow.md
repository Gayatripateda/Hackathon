# Team Workflow

This is a suggested workflow for a two-person team. It describes recommendations, not an existing automated process.

## Divide responsibilities by feature

One possible split:

- **Frontend lead for a task:** implement the relevant React UI, handle loading/error states, and verify the browser behavior.
- **Backend lead for a task:** implement the API contract, validation, and server-side behavior.
- **Both:** agree on request/response shapes before parallel implementation, review each other's changes, test the full flow, and update documentation.

Roles can rotate so both teammates learn both sides. For a small feature, it may be better for one person to own the full change while the other reviews it.

## Coordinate API changes

Before building a feature, agree on:

- HTTP method and route.
- Request fields and expected response fields.
- Error response behavior.
- Whether data is temporary or persisted.
- Which person owns each file or feature area.

Keep the API contract in a short issue or pull request description. Use FastAPI's `/docs` page to inspect the implemented routes.

## Suggested GitHub cycle

1. Check `git status` and preserve any uncommitted work. Do not switch branches or pull over changes you have not reviewed or saved.
2. Start from an up-to-date `main` branch once the working tree is ready.
3. Create a small feature branch, such as `feature/file-upload`.
4. Make one focused change and run the relevant checks.
5. Review `git status` and the diff before staging. Do not stage secrets, virtual environments, `node_modules`, or generated build files.
6. Push the branch and open a pull request.
7. Ask the teammate to review behavior, not just formatting.
8. Merge only after resolving feedback and checking that the change still runs.

Useful PowerShell commands from the repository root:

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

Replace the example branch name and staging path with the actual change. Review the diff before committing, especially because the repository may contain local, uncommitted work.

## Keep contributions safe and understandable

- Never put API keys, passwords, access tokens, or private user data in source files or commits.
- Keep each pull request small enough for a teammate to review.
- Explain what changed, how to test it, and any known limitation in the pull request.
- Update the relevant documentation in the same change as behavior it describes.
- Do not claim a feature is complete until it works and its limits are understood.
