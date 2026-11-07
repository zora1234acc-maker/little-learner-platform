# 03 – Roles and Data

## Permission matrix
| Feature | Admin | Teacher | Student | Parent |
|---|---|---|---|---|
| Manage users and links | Full | – | – | – |
| Create/edit content | Full | – | – | – |
| Edit website (header/footer/pages) | Full | – | – | – |
| Browse library, assign work | Yes | Yes | – | – |
| View assigned work | All | Own students | Own | Own children (read-only) |
| Do lessons / quizzes | – | – | Yes | – |
| Submit assignments | – | – | Yes | – |
| Grade and comment | – | Own students | – | – |
| View progress / scores | All | Own students | Own | Own children |

**Rule:** every API route checks role AND ownership (a teacher sees only linked students; a parent only linked children).

## Data movement
| From → To | Data |
|---|---|
| Admin → System | Users, roles, links, multilingual content, site settings |
| Library → Teacher | Published lessons, quizzes, templates |
| Teacher → Student | Assignment: item, targets, due date |
| Student → System | Completion, quiz answers, submission, timestamps |
| System → Student | Score, feedback, status, grade, comment |
| Teacher → System | Grade, score, comment |
| System → Parent | Completed items, scores, feedback, overdue list |
| System → Public site | Header, footer, menu, pages in visitor's language |
