# Development Workflow

> What this repo needs you to know and check. How you get there is yours: the `ponytail` skill (smallest change that fully solves the task) and the rules in `AGENTS.md` and `.cursor/rules/` apply.

## Before you change code
- Read `project-context.md` and `deployment-architecture.md` (and their `.local.md` companions, if present).
- If `CONTEXT.md` exists at the repo root, use its vocabulary in names, comments and explanations.
- Know the local and the production impact of the change (endpoints, components, env vars).

## While you change it
- Keep the API compatible for every changed or added endpoint, or say what breaks.
- Update the technical documentation when a contract changes.

## 3) Local Verification

### Frontend
```bash
cd frontend
npm run dev      # Dev server: http://localhost:5173
npm run build    # Production build
npm run lint     # ESLint check
```

### Backend
```bash
cd backend
# Module is `main` (file: main.py), not `app`.
# Default uvicorn dev port is 8000; the Docker container uses 5000.
uvicorn main:app --reload
# Check: GET http://localhost:8000/api/health   (local dev with uvicorn)
# In Docker: GET http://localhost:5000/api/health from inside the container,
#            or https://api.<project>.blain-projects.ca/api/health from outside.
```

### Full Stack (Docker)
```bash
docker-compose up --build
```

## 4) Pre-Deployment Verification
- Confirm API URLs by environment (local vs public)
- Confirm required environment variables
- Verify no added dependency was missed
- Run the test suite
- Security checklist passed

## 5) Definition of Done
- [ ] Code builds/starts without errors
- [ ] Tests written for the change, run, passing
- [ ] Linting and type checking clean
- [ ] Modified endpoints respond correctly
- [ ] Behavior compatible with Docker/Traefik deployment
- [ ] Documentation updated when relevant
- [ ] No secrets or hardcoded values
- [ ] Security checklist passed

## Commit Convention
Use conventional commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `style:` formatting
- `refactor:` code change
- `test:` tests
- `chore:` maintenance

Example: `feat(auth): add JWT login endpoint`
