# Third-Party Services Inventory

Per `docs/08-privacy-and-compliance.md` rule 32 and AGENTS.md hard rule 18, every external service used by the platform must be recorded here and reviewed before adding any new service.

## Policy

- **No advertising SDKs.** No third-party trackers.
- **No AI training on child data.** Never send student data, answers, or submissions to third-party AI or analytics services.
- **Self-host when possible.** Fonts, video, and analytics should be self-hosted or privacy-enhanced.
- **Parental consent** required before sharing children's data with third parties for non-essential purposes.

## Services

| Service | Purpose | Data Shared | Privacy Notes |
|---|---|---|---|
| PostgreSQL | Database (hosting) | User accounts, content, progress, grades | Self-hosted via Docker in dev; managed hosting in production |
| Gunicorn | Application server | None (internal) | Internal only, not exposed to internet directly |
| Nginx/Reverse proxy | TLS termination, routing | None (metadata only) | Configure for HTTPS only |
| Local file storage | Media uploads | Student submissions, avatars | Stored locally; no third-party access |
| Email (SMTP) | Password reset, notifications | Parent email addresses | Only with parental consent |
| YouTube embed | Video lessons | None (privacy-enhanced mode) | Use `youtube-nocookie.com` to avoid tracking cookies |
| Google Fonts / Noto fonts | Typography | None | **Self-hosted** — fonts bundled with frontend |

## Prohibited Services

The following are **not allowed** on this platform:

- Google Analytics or any analytics SDK
- Facebook Pixel or advertising trackers
- Crash reporters (Sentry, etc.) that collect child identifiers
- Third-party AI services trained on child data
- Any service that sells or shares children's personal information

## Review Process

Before adding any new third-party service:

1. Add it to this table with purpose, data shared, and privacy notes.
2. Confirm no child identifiers are shared.
3. Get approval from the project owner.
4. Update the Privacy for Children and Data Retention CMS pages if needed.
