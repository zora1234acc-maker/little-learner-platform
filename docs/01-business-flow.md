# 01 – Business Flow

## Current (manual) vs Optimized
| # | Step | Current (manual) | Friction | Optimized (platform) |
|---|---|---|---|---|
| 1 | Account setup | Names/contacts collected by hand | Slow, links between parent and child get lost | Admin creates users and links Parent↔Student, Teacher↔Student. CSV import later |
| 2 | Content creation | Files, videos, chats scattered | No library, no reuse, no translation | Admin builds Subject → Course → Lesson → Activity, in 3 languages |
| 3 | Assigning work | Teacher sends links or paper | No due dates, no tracking | Teacher picks library items, selects students/class, sets due date |
| 4 | Learning | Student opens files, no feedback | No completion record | Lesson completion tracked, quizzes auto-scored with instant feedback |
| 5 | Submission | Photos of worksheets in chat | Lost files, unclear status | Student uploads file/text. Status: Not started / Submitted / Graded |
| 6 | Grading | Paper marking plus separate reports | Slow feedback | Grading queue: score + comment + return |
| 7 | Parent updates | Parent asks in person/chat | Repeated questions | Parent dashboard: progress, scores, feedback, overdue |
| 8 | Website upkeep | Developer edits code for text changes | Slow, costly | Admin edits header, footer, menu, pages in dashboard |

## Main workflow (happy path)
```
1. ADMIN   creates teacher, students, parents → links them
2. ADMIN   creates content (lessons, quizzes, assignment templates) → publishes
3. TEACHER browses library → assigns to students/class with due date
4. STUDENT sees "My To-do" → does lesson / quiz / submits assignment
5. SYSTEM  auto-scores quizzes, records completion, notifies teacher
6. TEACHER grades submissions → returns score + comment
7. PARENT  views child's progress, scores, feedback
8. ADMIN   edits website header/footer/pages anytime (live)
```

## Assignment status lifecycle
`assigned → in_progress → submitted → graded` (quizzes and lessons jump straight to `completed`). Overdue is computed from `due_date`, not stored.
