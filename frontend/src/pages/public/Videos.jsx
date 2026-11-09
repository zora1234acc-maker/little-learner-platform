import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, ChevronDown, Clock3, FileText, Home, Info, Mail, Play, PlayCircle, Route, ShieldCheck, Sparkles, UsersRound, Video } from "lucide-react";
import { Link } from "react-router-dom";
import videos from "@/data/videos.json";
import { useSite } from "@/context/SiteContext";

function localized(value, lang) {
  return typeof value === "string" ? value : value?.[lang] || value?.en || "";
}

function VideoCard({ video, lang, featured = false }) {
  return (
    <article className={`group overflow-hidden rounded-[4px] border border-[#E7E8F0] bg-white shadow-[0_14px_32px_-28px_rgba(48,50,95,0.5)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_42px_-28px_rgba(48,50,95,0.65)] ${featured ? "lg:col-span-2 lg:grid lg:grid-cols-[1.25fr_0.75fr]" : ""}`}>
      <div className={`relative aspect-video overflow-hidden bg-[#20234B] ${featured ? "lg:aspect-auto lg:min-h-[310px]" : ""}`}>
        <iframe
          src={video.embedUrl}
          title={localized(video.title, lang)}
          loading="lazy"
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-[4px] bg-black/65 px-2.5 py-1.5 text-xs font-bold text-white">
          <Play className="h-3 w-3 fill-current" />
          {video.duration}
        </span>
      </div>
      <div className="flex flex-col justify-center p-5 sm:p-7">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8D90A4]">
          <Video className="h-3.5 w-3.5 text-[#514BFF]" />
          {video.category}
        </div>
        <h2 className={`${featured ? "text-2xl" : "text-lg"} font-extrabold tracking-[-0.02em] text-[#30325F]`}>
          {localized(video.title, lang)}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#777A91]">{localized(video.description, lang)}</p>
        <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#8D90A4]">
          <Clock3 className="h-3.5 w-3.5 text-[#514BFF]" />
          {video.duration}
        </div>
      </div>
    </article>
  );
}

export function Videos() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const [category, setCategory] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);
  const publishedVideos = videos.filter((video) => video.is_published !== false);
  const categories = ["All", ...new Set(publishedVideos.map((video) => video.category))];
  const filtered = useMemo(
    () => category === "All" ? publishedVideos : publishedVideos.filter((video) => video.category === category),
    [category, publishedVideos],
  );

  return (
    <div className="space-y-10 pb-8">
      <header className="relative overflow-hidden rounded-[4px] border border-[#E6E4F3] bg-[#2B2D4F] px-6 py-10 text-white shadow-[0_18px_40px_-30px_rgba(43,45,79,0.8)] sm:px-10 sm:py-12 lg:px-14">
        <div className="absolute -right-10 -top-14 h-44 w-44 rounded-full border-[24px] border-white/[0.06]" />
        <div className="absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-[#514BFF]/30 blur-2xl" />
        <div className="relative max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-[4px] bg-[#FFD75E]/15 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#FFD75E]">
            <Sparkles className="h-4 w-4" />
            Resources
          </span>
          <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Learn by watching
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/70">
            Short videos and activities made to help children explore ideas at their own pace.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#A9EEDC]">
            <PlayCircle className="h-5 w-5" />
            Watch, pause, and learn together
          </div>
        </div>
      </header>

      <nav
        aria-label="Resource navigation"
        className="relative z-30 rounded-[4px] border border-[#E6E4F3] bg-white p-1.5 shadow-[0_12px_30px_-28px_rgba(48,50,95,0.7)]"
      >
        <div className="flex flex-wrap items-center gap-1">
          {[
            { label: "Home", href: "/", icon: Home },
            {
              label: "Subjects",
              href: "/subjects",
              icon: BookOpen,
              children: [
                { label: "All Subjects", href: "/subjects" },
                { label: "Khmer Language", href: "/courses/sub1" },
                { label: "Mathematics", href: "/courses/sub2" },
                { label: "Science", href: "/courses/sub3" },
              ],
            },
            {
              label: "Learning Paths",
              href: "/subjects",
              icon: Route,
              children: [
                { label: "Beginner", href: "/subjects" },
                { label: "Intermediate", href: "/subjects" },
                { label: "Advanced", href: "/subjects" },
              ],
            },
            {
              label: "Resources",
              href: "/videos",
              icon: Video,
              children: [
                { label: "Worksheets", href: "/videos", icon: FileText },
                { label: "Activities", href: "/videos", icon: Sparkles },
                { label: "Videos", href: "/videos", icon: Video },
              ],
            },
            {
              label: "For Parents",
              href: "/about",
              icon: UsersRound,
              children: [
                { label: "Child Progress", href: "/parent" },
                { label: "Safety & Privacy", href: "/privacy-for-children" },
                { label: "Parent Guide", href: "/about" },
              ],
            },
            { label: "Videos", href: "/videos", icon: Video, active: true },
            { label: "About", href: "/about", icon: Info },
            { label: "Contact", href: "/contact", icon: Mail },
          ].map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children?.length > 0;
            return (
              <div
                key={`${item.label}-${item.href}`}
                className="relative"
              >
                <div className="flex items-center">
                  <Link
                    to={item.href}
                    className={`inline-flex items-center gap-2 rounded-[4px] px-3 py-2.5 text-xs font-bold transition sm:px-4 sm:text-sm ${
                      item.active
                        ? "bg-[#514BFF] text-white shadow-sm"
                        : "text-[#62657E] hover:bg-[#F0EFFF] hover:text-[#514BFF]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                      className="flex min-h-[38px] items-center rounded-e-[4px] px-2 text-[#777A91] transition hover:bg-[#F0EFFF] hover:text-[#514BFF]"
                      aria-label={`Open ${item.label} submenu`}
                      aria-expanded={openMenu === item.label}
                    >
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openMenu === item.label ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>

                {hasChildren && openMenu === item.label && (
                  <div className="absolute start-0 top-full z-50 mt-2 w-52 rounded-[4px] border border-[#E6E4F3] bg-white p-1.5 shadow-xl shadow-[#30325F]/10">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <Link
                          key={child.label}
                          to={child.href}
                          onClick={() => setOpenMenu(null)}
                          className="flex items-center gap-2 rounded-[4px] px-3 py-2.5 text-xs font-bold text-[#62657E] transition hover:bg-[#F0EFFF] hover:text-[#514BFF]"
                        >
                          {ChildIcon ? <ChildIcon className="h-3.5 w-3.5 text-[#514BFF]" /> : <span className="h-1.5 w-1.5 rounded-full bg-[#8D89DF]" />}
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E8F0] pb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-[4px] px-4 py-2 text-sm font-bold transition ${
                category === item
                  ? "bg-[#514BFF] text-white"
                  : "border border-[#E6E4F3] bg-white text-[#62657E] hover:bg-[#F0EFFF] hover:text-[#514BFF]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-2 rounded-[4px] bg-[#E1F7EF] px-3 py-2 text-xs font-bold text-[#16785D]">
          <ShieldCheck className="h-4 w-4 text-[#1B9A75]" />
          Privacy-enhanced embeds
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filtered.map((video, index) => (
            <VideoCard key={video.id} video={video} lang={lang} featured={index === 0} />
          ))}
        </div>
      ) : (
        <div className="rounded-[4px] border-2 border-dashed border-[#DCDDE8] bg-white px-6 py-20 text-center text-[#777A91]">
          No videos are available yet.
        </div>
      )}
    </div>
  );
}
