# Web Component Registry — SkillBridge Rework

This document details the component hierarchy, HTML structure, events, design tokens, and accessibility contracts for all reusable UI components in SkillBridge.

---

## Component Registry Map

```text
Core Components:
├── COMP-CORE-001: SBPrimaryButton
├── COMP-CORE-002: SBSecondaryButton
├── COMP-CORE-003: SBTextField
├── COMP-CORE-004: SBBadge (Status & Category)
└── COMP-CORE-005: SBProgressBar (Dynamic Progress Gauge)

Shared Layout Components:
├── COMP-SHR-001: SBNavbar (Global & Portal Navigation)
├── COMP-SHR-002: SBFooter (Global Site Footer)
├── COMP-SHR-003: SBModal (Universal Dialog Wrapper)
├── COMP-SHR-004: SBToast (Floating Notification Alert)
└── COMP-SHR-005: SBEmptyState (Illustrated Fallback View)

Feature Components:
├── COMP-FEAT-001: SBProjectCard (Marketplace Card)
├── COMP-FEAT-002: SBApplicantCard (UMKM Review Inbox)
├── COMP-FEAT-003: SBAIMatchBadge & Rationale Modal
├── COMP-FEAT-004: SBTaskItem (Interactive Checklist)
├── COMP-FEAT-005: SBChatBubble (Workspace Messenger)
└── COMP-FEAT-006: SBReviewModal (Two-Way Rating Dialog)
```

---

## 1. Core Components

### COMP-CORE-001: `SBPrimaryButton`
- **ELEMENT:** `<button class="btn btn-primary">`
- **PURPOSE:** Main call-to-action button for form submission, project applications, and modal confirms.
- **PROPERTIES / ATTRIBUTES:**
  - `type`: `submit` | `button`.
  - `disabled`: boolean.
  - `data-loading`: boolean (swaps text with a centered spinner SVG).
- **DESIGN TOKENS:** `--color-primary`, `--color-primary-hover`, `--radius-md`, `--font-weight-semibold`.
- **ACCESSIBILITY:** Includes `aria-label` when icon-only; minimum target height 44px.

---

### COMP-CORE-004: `SBBadge`
- **ELEMENT:** `<span class="badge badge-{variant}">`
- **VARIANTS:**
  - `badge-success`: Status `ACTIVE`, `COMPLETED`, `ACCEPTED` (`--color-success`, `--color-success-bg`).
  - `badge-warning`: Status `PENDING`, `DRAFT` (`--color-warning`, `--color-warning-bg`).
  - `badge-primary`: Skill tags, Categories (`--color-primary-light`, `--color-primary`).
  - `badge-danger`: Status `REJECTED`, `CANCELLED` (`--color-danger`, `--color-danger-bg`).

---

### COMP-CORE-005: `SBProgressBar`
- **ELEMENT:** `<div class="progress-container"><div class="progress-bar" style="width: {pct}%"></div></div>`
- **PURPOSE:** Visual indicator of workspace milestone progress.
- **PROPERTIES:** `data-progress` (0 to 100).
- **BEHAVIOR:** Smooth CSS transition (`transition: width 0.4s ease-in-out`).

---

## 2. Shared Layout Components

### COMP-SHR-001: `SBNavbar`
- **ELEMENT:** `<nav class="navbar" id="main-navbar">`
- **PURPOSE:** Global sticky top navigation supporting both guest state and authenticated portal states.
- **SUB-ELEMENTS:**
  - Brand Logo link to `/index.html`.
  - Navigation Links (`Katalog Proyek`, `Dashboard`, `Workspace`).
  - Notification Bell with unread counter badge.
  - User Avatar with Dropdown Menu (`Profil`, `Pengaturan`, `Keluar`).
- **SCRIPTS:** Handled by `assets/js/auth.js` to dynamically inject buttons matching active user role.

---

### COMP-SHR-004: `SBToast`
- **ELEMENT:** `<div class="toast toast-{type}">`
- **CONTAINER:** `<div id="toast-container"></div>`
- **JS API:** `window.showToast(message, type = 'success' | 'error' | 'info')`
- **BEHAVIOR:** Appends to DOM, slides in from top-right, auto-dismisses after 4000ms with fade-out animation.

---

## 3. Feature Components

### COMP-FEAT-001: `SBProjectCard`
- **ELEMENT:** `<article class="project-card">`
- **PURPOSE:** Card displayed in marketplace grids and dashboard recommendations.
- **STRUCTURE:**
  - Header: UMKM logo, company name, category pill.
  - Body: Title, truncated description, skill tags (`<span class="badge">`).
  - Footer: Duration tag, Stipend amount, "Lihat Detail" link.
- **INTERACTION:** Hover elevates card with `--shadow-md`.

---

### COMP-FEAT-003: `SBAIMatchBadge`
- **ELEMENT:** `<div class="ai-match-badge" data-match="{pct}">`
- **PURPOSE:** Displays Gemini-calculated candidate alignment score (e.g., `94% Match`).
- **INTERACTION:** Clicking badge opens `SBAIMatchModal` detailing the rationale and recommended next steps.

---

### COMP-FEAT-004: `SBTaskItem`
- **ELEMENT:** `<div class="task-item" data-task-id="{id}">`
- **STRUCTURE:**
  - Checkbox input (`<input type="checkbox">`).
  - Task title text (applies strike-through when completed).
  - Due date badge.
  - Assignee avatar.
- **EVENT:** `change` event dispatches Supabase patch call and triggers progress bar recalculation.

---

### COMP-FEAT-005: `SBChatBubble`
- **ELEMENT:** `<div class="chat-bubble chat-bubble-{inbound|outbound}">`
- **PURPOSE:** Formats messages in collaborative workspace chat.
- **STRUCTURE:** Sender name, message text paragraph, timestamp, and read indicator.
