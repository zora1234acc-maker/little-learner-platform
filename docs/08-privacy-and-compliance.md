# 08 – Child Privacy and Compliance

> Not legal advice. Have a lawyer review before launch, especially for the countries your users live in.

## Why this matters
Children's data is regulated in many countries. The US rule (COPPA) is the most detailed and is a good baseline even if your users are elsewhere. It applies if you knowingly serve US children.

## What changed in the US COPPA rule (verified in research)
- The amended rule took effect June 23, 2025. **Full compliance was required by April 22, 2026**, so it is already in force.
- **No indefinite retention.** Operators must keep a **written data retention policy** and publish it in the privacy notice (what is collected, why, and when it is deleted).
- Privacy notices must name the third parties that receive children's data and why.
- **Separate parental consent** is needed before sharing children's data with third parties for non-essential purposes, including targeted ads and **AI training**.
- "Personal information" now covers biometrics, and mobile phone numbers can trigger full consent rules.
- Operators are responsible for the third-party tools (analytics, crash reporters, SDKs) that touch children's data.
- A proposed "COPPA 2.0" had passed the Senate but was not law at the time of research. Re-check before launch.

## Engineering rules for this project
| Rule | How |
|---|---|
| Collect the minimum | Student record: display name, class, language, avatar. No birth date, address, phone, photo, or email for students unless truly needed |
| Admin-created accounts only | Already decided. No public sign-up means no unknown children entering |
| Parent contact | Store parent email only. Avoid phone numbers (SMS triggers extra rules) |
| No ads, no trackers | No advertising SDKs. Use no analytics, or privacy-friendly self-hosted analytics with no child identifiers |
| No AI training on child data | Never send student data, answers, or submissions to third-party AI or analytics services |
| Retention policy | Config `RETENTION_DAYS_*`. Scheduled job deletes or anonymizes: submissions and activity after N months of inactivity, deactivated accounts after N days |
| Delete on request | Admin screen: export and delete a student's data (with parent request) |
| Consent record | `consent_records` table: parent id, student id, purpose, date, admin who recorded it |
| Privacy pages | Admin-editable "Privacy for Children" and "Data Retention" pages (use the CMS) listing what is collected, why, retention period, and any third parties |
| Visibility | Student first-name display only. No student-to-student contact or public profiles |
| Security | HTTPS, bcrypt, JWT expiry, rate-limited login, audit log for admin and teacher access to student data |
| Third-party inventory | Keep `docs/third-party-services.md` listing every external service (hosting, storage, video embed, fonts). Review before adding any |
| Fonts and video | Self-host fonts if possible. Prefer privacy-enhanced video embeds so no tracking cookies load for kids |

## Open questions for the owner
1. In which countries will the children live? (Decides which laws apply.)
2. Who is the legal operator (person or organization)?
3. Who handles parent consent and deletion requests?
