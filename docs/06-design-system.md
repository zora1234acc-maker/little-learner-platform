# 06 – Design System

## Colors
| Name | Hex | Use |
|---|---|---|
| Blueberry | `#3B3F8F` | Brand, headings, primary buttons |
| Sunshine | `#FFC93C` | Main call-to-action |
| Mint | `#2FBF94` | Correct, completed |
| Bubblegum | `#FF6FA1` | Try again, art |
| Sky | `#5AA9FF` | Links, science |
| Paper | `#F6F8FF` | Background |
Dark mode: background `#15163A`, surface `#202250`, text `#F1F3FF`. Store these as CSS variables and let `site_settings` override brand colors.

## Typography
Headings: Baloo 2. Body: Nunito. Khmer: Noto Sans Khmer. Arabic: Noto Sans Arabic. Body size 17px minimum, large touch targets (44px+) for kids.

## RTL rules (Arabic)
- Set `<html dir="rtl" lang="ar">` from the active language.
- Use CSS logical properties only: `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`.
- Mirror directional icons (arrows, back buttons). Do not mirror logos, numbers, or video controls.
- Test every page in `en`, `km`, and `ar`.

## UI tone
Plain, friendly, sentence case. Buttons say exactly what happens: "Start lesson", "Submit work". Errors say what went wrong and how to fix it. Correct answers get warm feedback; wrong answers say "Try again", never "Wrong".

## Accessibility
Visible keyboard focus, color never the only signal, respect `prefers-reduced-motion`, alt text on lesson images.
