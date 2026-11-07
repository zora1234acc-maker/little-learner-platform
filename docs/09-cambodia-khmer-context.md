# 09 – Cambodia and Khmer Context

Research date: November 2026. The owner is in Phnom Penh and Khmer is a launch language.

## What already exists
| Initiative | What it offers | Takeaway |
|---|---|---|
| **MoEYS E-Learning app** (official, with the Union of Youth Federations of Cambodia) | Self-paced learning, videos from Cambodian teachers across grades, e-library of MoEYS textbooks (PDF) and Khmer e-books, usable offline | Offline reading and Khmer video are expected by families |
| **Sala Digital** (MoEYS) | Online platform for formal education, virtual schools and courses | Government focus is formal school content. Little Learner can stay playful and early-years |
| **Khmer LEARN** | Free interactive reading, language and learning apps with a digital library for under-resourced communities. One of the larger Cambodian e-learning platforms (220,000+ installs reported) | Free and Khmer-first content has real demand |
| **Surala Net x MoEYS** | Agreement (Aug 2025) to teach math digitally in Khmer | Khmer math content is a growing area |
| **Library For All / Let's Read** | Khmer children's e-books | Khmer story content is scarce beyond folktales |
| **MoEYS Primary Learning Platform** | Early-grade Khmer literacy package | Early Khmer reading is a national priority |

## Insights that change our design
1. **Content is the bottleneck.** Quality Khmer children's content is scarce. The admin content tools (Phase 4) must make it fast to add Khmer lessons, and the library should allow re-use of embedded videos and uploaded books.
2. **Digital divide.** Use varies by region and income. Build **mobile-first**, light pages, compressed images, and a PWA with offline reading. Promote offline support from "Could" to "Should".
3. **Oral language matters in early Khmer literacy.** A national study of early-grade Khmer found oral language needs more focus. Add **audio for every lesson and question** (read-aloud). Promote audio from "Could" to "Should".
4. **Khmer typography.** Use Noto Sans Khmer, larger line-height, and test Khmer word wrapping (Khmer has no spaces between words; use `word-break: normal` and `line-break: auto`, and test long strings).
5. **Parents may share one phone.** The parent view must be quick and work on small screens. Multiple children under one parent account.
6. **Teachers may have limited tech skills.** Teacher screens: few steps, big buttons, and a short in-app guide in Khmer.
7. **Kids who cannot type yet.** Use QR code or picture login (see `10-feature-updates.md`).

## Not verified
I did not find a specific Cambodian children's data protection law during research. Do not assume none exists. Ask a local lawyer, and follow `08-privacy-and-compliance.md` as the baseline.

## Sources
- MoEYS E-Learning app: https://apps.apple.com/sg/app/moeys/id1551279703
- Sala Digital (Phnom Penh Post): https://www.pressreader.com/cambodia/the-phnom-penh-post/20240209/281651080012359
- Khmer LEARN (MIT Solve): https://solve.mit.edu/solutions/1487
- Surala Net x MoEYS (AKP): https://mail.akp.gov.kh/post/detail/345996
- Early-grade Khmer literacy study (ACER): https://www.acer.org/news/article/evidence-to-strengthen-early-literacy-at-scale-in-cambodia
- UNICEF on digital divide in Cambodia: https://www.unicef.org/cambodia/stories/unlocking-potential-digital-education-mle-schools
- Library For All Khmer e-books: https://sandbox.asiafoundation.org/2016/03/23/the-dawn-of-a-new-day-for-reading-in-cambodia/
