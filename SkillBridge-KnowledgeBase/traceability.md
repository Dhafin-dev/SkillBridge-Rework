# Traceability Matrix Specification — SkillBridge Rework

This document establishes bidirectional traceability connecting functional requirements down to web screens, reusable components, development tasks, and verification test cases.

---

## Traceability Chain Schema

```text
REQUIREMENT (Functional Spec)
      ↓
SCREEN (Web Route & HTML View)
      ↓
COMPONENT (Reusable UI Element)
      ↓
TASK (Atomic Implementation Item)
      ↓
TEST (Automated Verification Test Case)
```

---

## End-to-End Traceability Matrix

| Requirement ID | Screen ID | Component ID | Task ID | Test ID | Verification Status |
|---|---|---|---|---|---|
| `REQ-F-001` (Registration) | `SCREEN-002` (Register) | `COMP-CORE-001`, `COMP-CORE-003` | `TASK-006`, `TASK-007` | `TEST-UNIT-003`, `BDD-SCN-001` | VERIFIED |
| `REQ-F-002` (Login / Auth) | `SCREEN-003` (Login) | `COMP-CORE-001`, `COMP-CORE-003` | `TASK-006`, `TASK-007` | `TEST-UNIT-003`, `BDD-SCN-002` | VERIFIED |
| `REQ-F-003` (Role Routing) | All Screens | `COMP-SHR-001` (Navbar) | `TASK-006` | `TEST-UNIT-003` | VERIFIED |
| `REQ-F-004` (Student Profile)| `SCREEN-009` (Profile) | `COMP-CORE-003`, `COMP-CORE-004` | `TASK-008` | `BDD-SCN-003` | VERIFIED |
| `REQ-F-005` (UMKM Profile) | `SCREEN-010` (Dashboard)| `COMP-CORE-003`, `COMP-SHR-001` | `TASK-008` | `BDD-SCN-004` | VERIFIED |
| `REQ-F-006` (Marketplace) | `SCREEN-004` (Catalog) | `COMP-FEAT-001` (ProjectCard) | `TASK-010` | `TEST-RESP-001`, `BDD-SCN-005` | VERIFIED |
| `REQ-F-007` (Project Detail)| `SCREEN-005` (Detail) | `COMP-CORE-001`, `COMP-CORE-004` | `TASK-011` | `BDD-SCN-005` | VERIFIED |
| `REQ-F-008` (Publish Brief)| `SCREEN-011` (Create) | `COMP-CORE-001`, `COMP-CORE-003` | `TASK-012` | `BDD-SCN-006` | VERIFIED |
| `REQ-F-009` (Apply Project) | `SCREEN-005` (Detail) | `COMP-SHR-003` (Modal) | `TASK-011` | `BDD-SCN-007` | VERIFIED |
| `REQ-F-010` (AI Match Engine)| `SCREEN-012` (Applicants)| `COMP-FEAT-003` (AIMatchBadge) | `TASK-013`, `TASK-014` | `TEST-UNIT-001`, `TEST-UNIT-002` | VERIFIED |
| `REQ-F-011` (Review App) | `SCREEN-012` (Applicants)| `COMP-FEAT-002`, `COMP-CORE-001` | `TASK-015` | `BDD-SCN-008` | VERIFIED |
| `REQ-F-012` (Auto Workspace) | `SCREEN-008` (Workspace)| `COMP-SHR-001`, `COMP-CORE-005` | `TASK-016` | `TEST-RLS-001`, `BDD-SCN-008` | VERIFIED |
| `REQ-F-013` (Task Checklist)| `SCREEN-008` (Workspace)| `COMP-FEAT-004` (TaskItem) | `TASK-017` | `TEST-REALTIME-002` | VERIFIED |
| `REQ-F-014` (Progress Gauge)| `SCREEN-008` (Workspace)| `COMP-CORE-005` (ProgressBar) | `TASK-017` | `TEST-REALTIME-002` | VERIFIED |
| `REQ-F-015` (Deliverable) | `SCREEN-008` (Workspace)| `COMP-CORE-001`, `COMP-CORE-003` | `TASK-018` | `BDD-SCN-009` | VERIFIED |
| `REQ-F-016` (Realtime Chat) | `SCREEN-008` (Workspace)| `COMP-FEAT-005` (ChatBubble) | `TASK-019` | `TEST-REALTIME-001`, `BDD-SCN-010` | VERIFIED |
| `REQ-F-017` (Two-Way Review)| `SCREEN-008` (Workspace)| `COMP-FEAT-006` (ReviewModal) | `TASK-021` | `BDD-SCN-011` | VERIFIED |
| `REQ-F-018` (Notifications)| All Screens | `COMP-SHR-004` (Toast) | `TASK-020` | `TEST-REALTIME-001` | VERIFIED |
| `REQ-F-019` (Admin Moderation)| `SCREEN-013` (Admin) | `COMP-CORE-001`, `COMP-CORE-004` | `TASK-022` | `BDD-SCN-012` | VERIFIED |
| `REQ-F-020` (Audit Logging) | `SCREEN-014` (Verification)| `COMP-CORE-004` (Badge) | `TASK-023` | `TEST-RLS-002` | VERIFIED |

---

## Audit Checklist & Verification Status

```text
[X] Every Screen maps to at least one Requirement.
[X] Every Requirement maps to at least one Test Case.
[X] Every Component maps to at least one Design Token.
[X] Every Database Table maps to a validated PostgreSQL persistent entity.
[X] Every API Endpoint has an assigned caller in the Task list.
[X] Row-Level Security (RLS) policies completely isolate multi-tenant user access.
[X] Zero orphan requirements or untracked screens detected.
```
