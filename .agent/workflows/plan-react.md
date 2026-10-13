---
description: Initiates the ReAct approach and loads the architectural context.
---
# Initialization of ReAct Context and Architecture

When this workflow is called, you must imperatively execute the following steps in your memory for the remainder of the session:

1. **Assimilation of system directives**: For human-driven Cursor sessions, read `.agent/system_prompt.md` as a brief (ReAct loop, security directives, memory annotation). It is **not** authoritative for automations — follow `AGENTS.md` (and `.cursorrules` when in Cursor) as the cross-IDE entry point.
2. **Assimilation of technical context**: Read the stack and limits defined in `.agent/context/architecture.md`. Keep in mind the mandatory technological choices (React 19, Vite, Uvicorn + FastAPI, Docker Compose, Traefik).
3. **Immediate application**: Upon reading this workflow, switch to the Agentic Software Architect mode. Respect `AGENTS.md` plus the architecture context; treat `.agent/system_prompt.md` as a human-session brief only.
4. **Confirmation**: Confirm to the user that the ReAct mode is activated, that the target architecture has been analyzed, and detail your "Implementation Plan" for their request.
