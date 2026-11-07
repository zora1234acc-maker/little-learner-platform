# 02 – Features (MoSCoW)

## Must have
| Module | Features |
|---|---|
| Auth | Login all roles, role-based access, admin-reset password, JWT |
| Users (Admin) | Create/edit/deactivate users; link Parent↔Student, Teacher↔Student |
| Content library (Admin) | CRUD Subjects, Courses, Lessons (video embed/upload, reading); Draft/Published |
| Quiz engine | Multiple choice with images, auto-score, instant feedback |
| Assignments | Admin templates; student submits file/text; teacher grades with score + comment |
| Assigning | Teacher assigns lessons/quizzes/assignments to students or classes with due date |
| Student UI | To-do list, lesson player, quiz taker, submission screen. Kid-friendly |
| Progress | Per-student completion and scores |
| Parent dashboard | Read-only view of linked children |
| Website CMS (Admin) | Edit header, footer, menu, homepage sections, static pages |
| i18n + RTL | en / km / ar content, language switcher, `dir="rtl"` for Arabic |
| Child data protection | Minimal student data, no public profiles, HTTPS, audit log |

## Should have
Extra quiz types (true/false, match, fill-blank), prerequisites and ordering, classes, in-app notifications, stars/badges, CSV user import, media library, teacher class reports, weekly parent summary.

## Could have
Interactive games, teacher↔parent messaging, email/SMS digests, PWA offline, read-aloud audio, admin analytics.

## Won't have (now)
Payments, self-registration, teacher-created content, live classes.
