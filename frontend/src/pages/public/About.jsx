import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, BookOpen, Globe2, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/api/client";
import { useSite } from "@/context/SiteContext";

export function About() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    setLoading(true);
    api.public
      .pages({ slug: "about", lang })
      .then((res) => live && setPage(res.data))
      .catch(() => live && setPage(null))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [lang]);

  if (loading || !page) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse py-24">
        <div className="h-4 w-24 rounded bg-[#E7E8F0]" />
        <div className="mt-5 h-12 w-2/3 rounded bg-[#E7E8F0]" />
        <div className="mt-4 h-5 w-full max-w-xl rounded bg-[#E7E8F0]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-[#E7E8F0] bg-gradient-to-br from-white via-white to-[#F0EEFF] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#FFF1B9] blur-2xl" />
        <div className="relative max-w-3xl">
          <span className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8D90A4]">
            <Sparkles className="h-4 w-4 text-[#D89A21]" />
            {t("nav.about")}
          </span>
          <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-[#30325F] sm:text-6xl">
            Learning should feel possible for every child.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#777A91] sm:text-lg">
            Little Learner gives children a calm, friendly place to learn with lessons,
            quizzes, and activities in English and Khmer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/subjects" className="btn-primary">
              Explore subjects <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/privacy-for-children" className="btn-secondary">
              Our privacy promise
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          { icon: BookOpen, title: "Learn at your pace", text: "Short lessons and quizzes make it easy to take one useful step at a time." },
          { icon: Globe2, title: "Made for two languages", text: "Children can learn in English or Khmer and switch whenever they need." },
          { icon: HeartHandshake, title: "Built with care", text: "Teachers, parents, and children each get a simple place to do their part." },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-2xl border border-[#E7E8F0] bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EFFF] text-[#514BFF]">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-lg font-extrabold text-[#30325F]">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#777A91]">{item.text}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="rounded-2xl border border-[#E7E8F0] bg-white p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-[#B7B4E8]" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#8D90A4]">{t("home.testimonials.title")}</span>
          </div>
          {page.sections.map((section) => (
            <div
              key={section.id}
              className="prose prose-sm max-w-none leading-8 text-[#555A77]"
              dangerouslySetInnerHTML={{ __html: section.content || "" }}
            />
          ))}
        </div>

        <aside className="rounded-2xl bg-[#30325F] p-7 text-white">
          <ShieldCheck className="h-7 w-7 text-[#A9EEDC]" />
          <h2 className="mt-5 text-2xl font-extrabold">{t("home.testimonials.subtitle")}</h2>
          <p className="mt-3 text-sm leading-7 text-white/70">
            No ads, no trackers, and no selling children’s data. We keep the experience focused
            on learning and the adults who support it.
          </p>
          <Link to="/privacy-for-children" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#FFD75E] hover:text-white">
            Read our privacy promise <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </section>
    </div>
  );
}
