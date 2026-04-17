# Steel Signature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a reusable Steel Signature visual baseline in the frontend template with light/dark tokens, theme switching contract, and reference component styling.

**Architecture:** Centralize design tokens in `frontend/src/index.css`, use semantic utility/component classes in `frontend/src/App.css`, and update `frontend/src/App.tsx` into a style reference page that exercises core baseline elements (button/input/card/nav/page shell). Theme state is controlled in React and synchronized through `data-theme` on the root element.

**Tech Stack:** React 19 + TypeScript + Vite + CSS

---

### Task 1: Define global Steel Signature tokens and theme contract

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Replace default template token set with Steel Signature token variables**
- [ ] **Step 2: Add light and dark token maps under `:root` and `:root[data-theme='dark']`**
- [ ] **Step 3: Keep base typography/reset styles aligned with spec (Inter stack, spacing, contrast)**

### Task 2: Implement reusable component and layout baseline styles

**Files:**
- Modify: `frontend/src/App.css`

- [ ] **Step 1: Remove starter-template-specific styles**
- [ ] **Step 2: Add page shell, nav, heading, and section layout styles**
- [ ] **Step 3: Add reference component styles (buttons, input, card, badges, alert, skeleton)**
- [ ] **Step 4: Add interaction states (hover/focus-visible/disabled) with Steel Signature behavior**

### Task 3: Create reference UI page and theme toggle behavior

**Files:**
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Replace starter UI with a style reference page for baseline components**
- [ ] **Step 2: Implement theme toggle (`light`/`dark`) with system preference initialization**
- [ ] **Step 3: Apply `data-theme` at the root document element and expose current mode in UI**

### Task 4: Verify and polish

**Files:**
- Modify (if needed): `frontend/src/index.css`, `frontend/src/App.css`, `frontend/src/App.tsx`

- [ ] **Step 1: Run `npm run build` in `frontend` and fix any compile/style issues**
- [ ] **Step 2: Run lint diagnostics and fix any issues introduced by changes**
- [ ] **Step 3: Confirm resulting page demonstrates Steel Signature baseline consistently in both themes**
