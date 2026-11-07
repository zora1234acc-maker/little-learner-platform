# 05 – Admin Controls the Frontend

## Goal
Admin changes any website text, link, menu, footer or page from the dashboard. **No code change, no redeploy.**

## What the admin can control
| Area | Editable fields |
|---|---|
| Site settings | Site name, logo, favicon, brand colors, contact email/phone/address, social links |
| Header | Menu items: label (en/km/ar), URL, order, show/hide, sub-menus |
| Footer | Text blocks, link groups, contact info, copyright text |
| Homepage | Sections in order: hero, subjects, how-it-works, feature list, call-to-action |
| Static pages | About, Contact, Privacy for Children, etc. (slug, title, sections, SEO) |
| Learning content | Subjects, courses, lessons, quizzes, assignment templates |
| Users | Accounts and links |

## How it works
1. On app start, the React app calls `GET /public/site?lang=xx` and `GET /public/menus?lang=xx`.
2. Result is stored in a global `SiteContext`.
3. `<Header />` and `<Footer />` render ONLY from that context. Never hardcode their text.
4. Homepage renders `page_sections` in order by `type` through a **section registry**:
```js
const SECTION_COMPONENTS = {
  hero: HeroSection,
  subjects: SubjectsSection,
  steps: StepsSection,
  richtext: RichTextSection,
  cta: CtaSection,
};
// <DynamicPage> maps sections → components. Unknown types are skipped safely.
```
5. Route `/:slug` loads `GET /public/pages/:slug` and renders sections. 404 if not published.
6. Admin saves → API updates DB → next page load shows changes (or refetch on focus).

## Admin dashboard screens
- **Site settings** form with live preview
- **Menus** drag-to-reorder list for header and footer
- **Footer blocks** editor
- **Pages** list → page editor with sortable sections and per-language tabs (EN / KM / AR)
- **Media library** upload and pick images
- **Users** table, create form, link manager
- **Content** tree: Subject → Course → Lesson → Quiz

## Rules
- Every text field shows **three language tabs**. Missing translation falls back to English and shows a "missing translation" badge in admin.
- Sanitize rich text server-side (allow-list tags). Never trust HTML from the client.
- Only `published` pages and menu items with `is_visible=true` are returned by `/public/*`.
- Cache `/public/*` responses briefly (60s) and invalidate on admin save.
- Every admin write goes to `audit_log`.
