# 10 – Feature Updates From Research

These changes **override** `02-features-moscow.md` where they conflict.

## Priority changes
| Feature | Old | New | Reason |
|---|---|---|---|
| Kid-friendly login (QR code, picture, or PIN) | – | **Must** | Young children cannot type passwords. Admin creates accounts, so admin prints login cards |
| Published privacy + data retention pages (CMS) | – | **Must** | Required by modern child-privacy rules, builds parent trust |
| Data retention job and delete/export student data | – | **Must** | No indefinite retention of child data |
| No ads, no third-party trackers, no AI training on child data | – | **Must** | Trust and compliance |
| Mobile-first, light pages, compressed media | – | **Must** | Digital divide in Cambodia |
| Audio read-aloud on lessons and questions | Could | **Should** | Oral language focus, pre-readers |
| Offline reading via PWA | Could | **Should** | Low connectivity |
| Library search and filters (subject, level, language) | – | **Should** | Teachers find content fast |
| Printable parent invite and student login cards (PDF) | – | **Should** | Seesaw-style onboarding, helps parents with one shared phone |
| Multiple children under one parent account | implied | **Must** (explicit) | Common family case |
| Adaptive learning path | – | **Could** | Khan Academy Kids style |
| Student work portfolio (photo, voice, drawing) | – | **Could** | Seesaw style |
| Parent encouragement comments | – | **Could** | Seesaw style, moderated by teacher |
| Printable worksheets | – | **Could** | Offline learning |

## Database additions
- `users`: add `login_method` (password | qr | pin | picture), `login_token_hash` (hashed, rotatable), `avatar` (preset id, not a photo)
- `consent_records` (parent_id, student_id, purpose, recorded_by, recorded_at)
- `data_requests` (student_id, type export|delete, status, handled_by, handled_at)
- `lesson_audio` or `audio_url` JSONB per language on lessons and questions
- `site_settings`: `retention_days_activity`, `retention_days_deactivated`

## API additions
- `POST /users/:id/login-card` (admin) returns printable PDF with QR/PIN
- `POST /auth/token-login` (QR/PIN login for students, rate limited)
- `GET /library/search?q=&subject=&level=&lang=`
- `POST /privacy/requests` (admin records export/delete request), `POST /privacy/consent`
- Scheduled job: `retention_cleanup` (daily)

## Security notes for QR/PIN login
Tokens are random (128-bit), stored hashed, rotatable by admin, scoped to student role only, short session, and rate-limited. Never put a student's real name or email in the QR.
