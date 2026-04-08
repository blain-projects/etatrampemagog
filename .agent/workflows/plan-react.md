---
description: Initiates the ReAct approach and loads the architectural context.
---
# Initialization of ReAct Context and Architecture

When this workflow is called, you must imperatively execute the following steps in your memory for the remainder of the session:

1. **Assimilation of system directives**: Read and integrate the execution protocol located in `.agent/system_prompt.md`. This includes the obligation to generate a plan, the use of the ReAct loop (Thought -> Action), strict security rules, and memory auto-annotation.
2. **Assimilation of technical context**: Read the stack and limits defined in `.agent/context/architecture.md`. Keep in mind the mandatory technological choices (React 19, Vite, Gunicorn/Flask, Docker Compose, Traefik).
3. **Immediate application**: Upon reading this workflow, switch to the Agentic Software Architect mode. All your behavior must henceforth strictly respect these two files for the requested task.
4. **Confirmation**: Confirm to the user that the ReAct mode is activated, that the target architecture has been analyzed, and detail your "Implementation Plan" for their request.
