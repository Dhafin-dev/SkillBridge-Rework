# UI/UX & Web Design Specification — SkillBridge Rework

This document details the visual design standards, layout architecture, component anatomy, and user experience patterns for the SkillBridge web platform.

---

## 1. Visual Design Philosophy

SkillBridge bridges the academic rigor of universities and the entrepreneurial spirit of Indonesian UMKM. The design reflects:
1. **Credibility & Clarity:** High-contrast slate typography on crisp white surfaces with Indigo (`#4F46E5`) as the primary anchor color.
2. **Action-Oriented Simplicity:** Minimalist forms, clear call-to-actions, and uncluttered dashboards that empower students and business owners to collaborate without friction.
3. **Transparent Progress:** Prominent visual badges, dynamic percentage bars, and real-time status indicators in active workspaces.

---

## 2. Core Layout Patterns

### A. Global Shell & Navigation
- **Header Navigation Bar:** Pinned at top (`height: 64px`), featuring the SkillBridge Brand Logo, Search Bar, Catalog Link, Notification Bell with live unread badge, and User Avatar Dropdown.
- **Role-Aware Portal Navigation:**
  - *Guest:* "Eksplorasi Proyek", "Masuk", "Daftar".
  - *Student:* "Katalog Proyek", "Lamaran Saya", "Workspace Aktif", "Profil Portofolio".
  - *UMKM:* "Dashboard Bisnis", "Pasang Proyek Baru", "Kelola Pelamar", "Workspace Proyek".
  - *Admin:* "Analytics KPI", "Moderasi Proyek", "Pusat Verifikasi", "Audit Log".

### B. Project Marketplace Grid (`/pages/projects.html`)
- **Two-Column Filter Layout:**
  - *Left Sidebar (280px):* Category checkboxes, Difficulty radio chips, Stipend range, and Skill tag multi-select.
  - *Right Content Area:* Search input toolbar, total results counter, sort dropdown, and a responsive 2-column or 3-column project card grid.

### C. Collaborative Workspace Split-View (`/pages/student/workspace.html`)
- **Two-Pane Productivity Layout:**
  - *Left Pane (60%):* Project Header, Progress Bar Gauge, Task Checklist (grouped by milestones), and Final Deliverable Submission Box.
  - *Right Pane (40%):* Contextual Real-Time Chat Messenger with message bubble stream, participant headers, and input box.

---

## 3. Component Design & States

### A. Project Card Component
- **Header:** Company Logo, UMKM Name, Category Badge, and Time Posted.
- **Body:** Project Title (Bold, 18px), 2-line truncated overview, and Horizontal Skill Tag Chips (max 3 tags + `+N more`).
- **Footer:** Duration Badge (e.g., "4 Minggu"), Stipend Tag (e.g., "Rp 1.500.000"), and Primary "Lihat Detail" Button.
- **Hover State:** Elevates with `--shadow-md` and subtle border transition (`--color-primary`).

### B. AI Match Score Badge & Rationale Card
- **Score Meter:** Circular or pill badge highlighted in Emerald (`#10B981`) or Indigo (`#4F46E5`) displaying `94% Kecocokan AI`.
- **Rationale Modal:** Explains *why* the candidate was selected, highlighting overlapping skills, portfolio score credibility, and 3 recommended next action bullets.

### C. State Handling Patterns
1. **Loading State:** CSS-animated shimmering skeleton cards (`.skeleton-card`).
2. **Empty State:** Illustrated SVG, clear headline (e.g. "Belum Ada Lamaran Masuk"), descriptive paragraph, and a prominent primary action CTA.
3. **Error & Notification State:** Floating Toast alerts (`#toast-container`) positioned at top-right with auto-dismiss after 4000ms.
