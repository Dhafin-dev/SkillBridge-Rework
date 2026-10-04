# AI Coding Agent Non-Negotiable Rules — SkillBridge

These rules are strictly enforced and mandatory for any AI coding agent, subagent, or autonomous executor operating on the SkillBridge Rework codebase.

---

## Core Non-Negotiable Directives

| Rule ID | Directive | Enforcement Level |
|---|---|---|
| **RULE-001** | **Read `README.md` before implementation.** Every agent must first parse the map of documents to understand context, architecture transition, and constraints. | STRICT |
| **RULE-002** | **Read `planning.md` before structuring directories or workflows.** Never begin coding without knowing the active development phase, milestones, and master objectives. | STRICT |
| **RULE-003** | **Read `architecture.md` before writing code.** Adhere strictly to the Decoupled Web Client (HTML/CSS/JS) + Supabase Platform + Python AI Microservice architecture. No TypeScript or heavy SPA frameworks are permitted in the rework. | STRICT |
| **RULE-004** | **Read `design.md` and `design-tokens.md` before implementing UI.** All layouts, colors, typography, paddings, and border-radii must strictly use standardized CSS Custom Properties (Design Tokens). Hardcoding arbitrary hex values is forbidden. | STRICT |
| **RULE-005** | **Read `screens.md` before implementing web pages.** Each view must conform to its assigned layout hierarchy, state transitions (Loading, Empty, Error, Success), and responsive guidelines. | STRICT |
| **RULE-006** | **Read `database.md` before altering PostgreSQL schema or RLS.** Every entity and field must trace back to the documented Supabase schema. Do not invent columns without an explicit schema revision. | STRICT |
| **RULE-007** | **Read `api.md` before implementing client-side queries or Python endpoints.** Networking calls and Supabase queries must strictly reflect documented contracts, envelopes, and error handlers. | STRICT |
| **RULE-008** | **Read `tasks.md` before starting implementation.** Development must proceed strictly by atomic `TASK-xxx` order and dependencies. Do not jump ahead across blocked phases. | STRICT |
| **RULE-009** | **Do not invent requirements.** If an observed behavior or requirement is absent from `requirements.md` or `planning.md`, mark it as `UNKNOWN` or file a decision proposal. | STRICT |
| **RULE-010** | **Do not introduce dependencies without justification.** Frontend relies on native web platform features (Fetch API, ES Modules, Supabase JS CDN, Lucide Icons). Backend uses lightweight Python libraries (`fastapi`, `uvicorn`, `google-genai`, `supabase-py`). | STRICT |
| **RULE-011** | **Do not modify architecture without documenting the decision.** Architectural drift is strictly prevented. Maintain clear separation between Frontend Client, Supabase BaaS, and Python AI Service. | STRICT |
| **RULE-012** | **Do not create undocumented screens.** Every web page and view modal must correspond to a registered `SCREEN-xxx` in `screens.md`. | STRICT |
| **RULE-013** | **Do not create undocumented API endpoints.** All networking endpoints must map directly to an `API-xxx` contract in `api.md`. | STRICT |
| **RULE-014** | **Do not create undocumented database tables or columns.** Persistence must strictly mirror `database.md` and `docs/DATABASE_SCHEMA_REVISED.sql`. | STRICT |
| **RULE-015** | **Preserve the documented design system.** Follow modern web aesthetics, high contrast, clean typography, and component specifications in `components.md`. | STRICT |
| **RULE-016** | **Reuse existing components.** Before building a new UI card or modal, inspect `components.md` to reuse established atoms and layout templates. | STRICT |
| **RULE-017** | **Do not duplicate business logic.** Validation logic, state persistence, and utility functions must reside in their designated modules (`assets/js/api.js`, `assets/js/auth.js`). | STRICT |
| **RULE-018** | **Do not use mock data in production implementation.** Mocks are permissible only within isolated test files (`test/`) or initial seed scripts. Never leave hardcoded dummy arrays in production scripts. | STRICT |
| **RULE-019** | **Do not silently change API or Supabase query contracts.** If an endpoint payload or query structure differs from `api.md`, halt and report a contract discrepancy. | STRICT |
| **RULE-020** | **If documentation conflicts, stop and identify the conflict.** Immediately pause execution, isolate the conflicting document IDs, and present the contradiction for resolution. | STRICT |
| **RULE-021** | **Official GitHub Remote Repository Binding:** The project's official remote repository is bound to `https://github.com/Dhafin-dev/SkillBridge-Rework.git` under remote alias `origin`. The authoritative primary branch is `main`. | STRICT |
| **RULE-022** | **Automated Git Lifecycle (Commit):** Upon completing any task or file modification, the AI agent must proactively stage changes (`git add .`) and compose a standardized Conventional Commit message (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`). Commits must remain local unless explicitly instructed to push. | STRICT |
| **RULE-023** | **Credential & Secret Protection:** Never commit `.env` files, Supabase `service_role` keys, or Gemini API keys to the GitHub repository. All sensitive keys must remain in `.gitignore`. | STRICT |
| **RULE-024** | **Obsidian Knowledge Base Synchronization:** Any structural changes to specifications, schemas, or documentation must be mirrored into the dedicated Obsidian vault `SkillBridge-KnowledgeBase`. | STRICT |

---

## AI Agent Operational Protocols

### Protocol A: Classification Discipline
Whenever an AI agent generates, refactors, or reviews specifications or code, it must explicitly tag the evidentiary status of any critical assertion:
- `[CONFIRMED]`: Directly backed by project requirements, existing database models, or verified course briefs.
- `[INFERRED]`: Derived through deduction from multiple confirmed facts.
- `[PROPOSED]`: Recommended development enhancement (e.g. Supabase Realtime channels, specific CSS tokens).
- `[UNKNOWN]`: Explicitly unresolvable with current data.
- `[NOT OBSERVED]`: Feature or component not present in input material.

### Protocol B: Code Quality Verification
Before declaring any task as `DONE`:
1. Verify semantic HTML5 and validate that JavaScript contains zero syntax errors.
2. Verify Python service endpoints with `python -m pytest` or `ruff check`.
3. Verify that all Acceptance Criteria assigned to the task are met.
4. Ensure all newly created files are tracked and documented in `traceability.md`.

### Protocol C: GitHub Synchronization & Version Control
1. Target Remote URL: `https://github.com/Dhafin-dev/SkillBridge-Rework.git`
2. Authoritative Branch: `main`
3. Commit Message Format: `<type>(<scope>): <short imperative description>`
   - Examples: `docs(knowledgebase): initialize complete skillbridge rework obsidian vault`
4. Post-Commit Action: Ensure git status is clean and changes are committed locally.
