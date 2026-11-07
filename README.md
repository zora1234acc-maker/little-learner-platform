# Little Learner Platform – Project Overview

> Read this file first. Then read `AGENTS.md` for build instructions.

## Purpose
A **free online learning platform for kids**. Teachers assign lessons, quizzes and assignments to students. Parents follow their child's progress. The **Admin controls everything**: users, learning content, and the public website itself (header, footer, menu, pages).

## Key decisions (do not change without asking)
| Topic | Decision |
|---|---|
| Learning types | Videos/reading, auto-scored quizzes, assignments graded by teacher |
| Roles | Admin, Teacher, Student, Parent |
| Accounts | Admin creates and links ALL accounts. No public sign-up |
| Content authoring | Admin only. Teachers browse the library and assign |
| Monetization | Free. No payments, no subscriptions |
| Languages | English (`en`, fallback), Khmer (`km`), Arabic (`ar`, RTL) |
| Frontend | React + Vite |
| Backend | Python Flask REST API |
| Database | PostgreSQL |

## The big idea: the website is data
No website text is hardcoded. The React app loads **header, footer, menu, and page content from the API**. The Admin edits them in the dashboard and the public site updates without a code deploy.

```
Admin Dashboard ──edit──▶ Flask API ──store──▶ PostgreSQL
                                │
Public Website  ◀──fetch────────┘   (header, footer, menu, pages, lessons)
Teacher / Student / Parent dashboards ◀── same API, role-limited
```

## Documents
| File | Contents |
|---|---|
| `AGENTS.md` | Step-by-step build plan and rules for the coding agent |
| `docs/01-business-flow.md` | Current vs optimized workflow, friction points |
| `docs/02-features-moscow.md` | Feature list by priority |
| `docs/03-roles-and-data.md` | Who does what, data moving between steps |
| `docs/04-architecture-and-database.md` | Folder structure, DB schema, API list |
| `docs/05-admin-cms-control.md` | How admin controls the frontend (header, footer, pages) |
| `docs/06-design-system.md` | Colors, fonts, RTL rules, UI tone |
| `docs/07-market-research.md` | Similar platforms studied and ideas adopted |
| `docs/08-privacy-and-compliance.md` | Child privacy rules and engineering requirements |
| `docs/09-cambodia-khmer-context.md` | Local context, existing platforms, Khmer-specific needs |
| `docs/10-feature-updates.md` | Priority changes from research (overrides doc 02 on conflict) |

## Out of scope (this release)
Payments, self-registration, teacher-created content, live video classes.
