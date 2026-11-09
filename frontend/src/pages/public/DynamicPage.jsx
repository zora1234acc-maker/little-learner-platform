import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "@/api/client";
import { useSite } from "@/context/SiteContext";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Users,
  Clock,
  Mail,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const IconMap = {
  ShieldCheck,
  Lock,
  EyeOff,
  Users,
  Clock,
  Mail,
  Phone,
  CheckCircle2,
  AlertTriangle,
};

/**
 * Renders any CMS page by slug. Used for About/Contact and privacy/data-retention pages.
 */
export function DynamicPage({ slug }) {
  const { t } = useTranslation();
  const { lang } = useSite();
  const params = useParams();
  const pageSlug = slug || params.slug;
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState({});

  useEffect(() => {
    let live = true;
    setLoading(true);
    api.public
      .pages({ slug: pageSlug, lang })
      .then((res) => {
        if (live) setPage(res.data);
      })
      .catch(() => {
        if (live) setPage(null);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [pageSlug, lang]);

  if (loading) {
    return <div className="animate-pulse py-24 text-center text-muted-foreground">{t("common.loading")}</div>;
  }

  if (!page) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">This page is not published.</p>
        <Link to="/" className="btn-secondary mt-4">
          {t("nav.home")}
        </Link>
      </div>
    );
  }

  const sections = [...(page.sections || [])].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  );

  const toggleFaq = (id) => {
    setOpenFaq((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isFaqOpen = (id) => !!openFaq[id];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <span className="eyebrow">{t("nav.about")}</span>
      <h1 className="text-3xl font-black text-blueberry sm:text-4xl">{page.title}</h1>

      <div className="space-y-6">
        {sections.map((section) => {
          if (section.type === "richtext") {
            return (
              <section
                key={section.id}
                className="rounded-[var(--radius-xl)] border border-border bg-white p-6 sm:p-8 shadow-sm"
              >
                <div
                  className="prose prose-sm max-w-none leading-relaxed text-foreground/90"
                  dangerouslySetInnerHTML={{ __html: section.content || "" }}
                />
              </section>
            );
          }

          if (section.type === "hero") {
            return (
              <section key={section.id} className="rounded-2xl border border-border bg-blueberry/5 p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-black text-blueberry">{section.content?.title}</h2>
                {section.content?.subtitle ? (
                  <p className="mt-2 text-muted-foreground">{section.content.subtitle}</p>
                ) : null}
                {section.content?.cta ? (
                  <Link to={section.content.cta_url || "/subjects"} className="btn-primary mt-4">
                    {section.content.cta}
                  </Link>
                ) : null}
              </section>
            );
          }

          if (section.type === "steps") {
            return (
              <section key={section.id}>
                {section.content?.title ? (
                  <h2 className="text-2xl font-black text-blueberry">{section.content.title}</h2>
                ) : null}
                <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(section.content?.items || []).map((item, index) => (
                    <li key={index} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blueberry/10 text-xs font-black text-blueberry">
                        {index + 1}
                      </span>
                      <p className="mt-2 font-bold text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                    </li>
                  ))}
                </ol>
              </section>
            );
          }

          if (section.type === "cta") {
            return (
              <section key={section.id} className="rounded-2xl border border-border bg-sunshine/20 p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-black text-blueberry">{section.content?.title}</h2>
                {section.content?.cta ? (
                  <Link to={section.content.cta_url || "/subjects"} className="btn-primary mt-4">
                    {section.content.cta}
                  </Link>
                ) : null}
              </section>
            );
          }

          /* ---------- NEW: Feature grid ---------- */
          if (section.type === "features") {
            return (
              <section key={section.id}>
                {section.content?.title && (
                  <h2 className="text-2xl font-black text-blueberry mb-6">{section.content.title}</h2>
                )}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(section.content?.items || []).map((item, index) => {
                    const Icon = IconMap[item.icon ?? "ShieldCheck"] ?? ShieldCheck;
                    return (
                      <div
                        key={index}
                        className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blueberry/10 mb-3">
                          <Icon size={18} className="text-blueberry" />
                        </div>
                        <h3 className="font-bold text-foreground">{item.title}</h3>
                        {item.desc && (
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            {item.desc}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          }

          /* ---------- NEW: Stats / counters ---------- */
          if (section.type === "stats") {
            return (
              <section key={section.id} className="rounded-2xl border border-border bg-blueberry/5 p-6 sm:p-8 shadow-sm">
                {section.content?.title && (
                  <h2 className="text-2xl font-black text-blueberry mb-6 text-center sm:text-left">{section.content.title}</h2>
                )}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-center sm:text-left">
                  {(section.content?.items || []).map((item, index) => (
                    <div key={index} className="py-2">
                      <div className="text-3xl font-black text-blueberry">{item.number}</div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          /* ---------- NEW: Callout / notice box ---------- */
          if (section.type === "callout") {
            const variant = section.content?.variant ?? "info";
            const variants = {
              info: { bg: "bg-blueberry/5", border: "border-blueberry/20", icon: "ShieldCheck", color: "text-blueberry" },
              success: { bg: "bg-mint/5", border: "border-mint/20", icon: "CheckCircle2", color: "text-[#1B7F66]" },
              warning: { bg: "bg-bubblegum/5", border: "border-bubblegum/20", icon: "AlertTriangle", color: "text-bubblegum" },
            };
            const v = variants[variant] ?? variants.info;
            const Icon = IconMap[v.icon] ?? ShieldCheck;

            return (
              <section key={section.id} className="rounded-xl border p-5 sm:p-6 shadow-sm flex items-start gap-3">
                <div className={`${v.bg} flex h-9 w-9 shrink-0 items-center justify-center rounded-full mt-0.5`}>
                  <Icon size={16} className={`${v.color}`} />
                </div>
                <div>
                  {section.content?.title && (
                    <h3 className="font-bold text-foreground">{section.content.title}</h3>
                  )}
                  <p className="mt-1 text-sm leading-relaxed text-foreground/90" dangerouslySetInnerHTML={{ __html: section.content?.text || "" }} />
                </div>
              </section>
            );
          }

          /* ---------- NEW: FAQ accordion ---------- */
          if (section.type === "faq") {
            return (
              <section key={section.id}>
                {section.content?.title && (
                  <h2 className="text-2xl font-black text-blueberry mb-6">{section.content.title}</h2>
                )}
                <div className="space-y-2">
                  {(section.content?.items || []).map((item, index) => (
                    <div key={index} className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-foreground font-medium hover:bg-blueberry/5 transition"
                        aria-expanded={isFaqOpen(index)}
                      >
                        <span>{item.question}</span>
                        <ArrowRight size={16} className={`transition-transform ${isFaqOpen(index) ? "rotate-90" : ""}`} />
                      </button>
                      {isFaqOpen(index) && (
                        <div className="px-4 pb-4 border-t border-border">
                          <p className="text-sm text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.answer || "" }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          /* ---------- NEW: Two-column text ---------- */
          if (section.type === "twoColumn") {
            return (
              <section key={section.id} className="grid gap-6 sm:grid-cols-2 items-start">
                <div className="space-y-4">
                  {section.content?.title && (
                    <h2 className="text-2xl font-black text-blueberry">{section.content.title}</h2>
                  )}
                  {section.content?.left && (
                    <div className="prose prose-sm max-w-none leading-relaxed text-foreground/90" dangerouslySetInnerHTML={{ __html: section.content.left }} />
                  )}
                </div>
                <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-sm">
                  {section.content?.right && (
                    <div className="prose prose-sm max-w-none leading-relaxed text-foreground/90" dangerouslySetInnerHTML={{ __html: section.content.right }} />
                  )}
                </div>
              </section>
            );
          }

          /* ---------- NEW: Contact / support box ---------- */
          if (section.type === "contact") {
            return (
              <section key={section.id} className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm">
                {section.content?.title && (
                  <h2 className="text-2xl font-black text-blueberry mb-6">{section.content.title}</h2>
                )}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(section.content?.items || []).map((item, index) => {
                    const Icon = IconMap[item.icon ?? "Mail"] ?? Mail;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blueberry/10 mt-0.5">
                          <Icon size={16} className="text-blueberry" />
                        </div>
                        <div>
                          {item.label && <div className="text-xs font-bold text-blueberry/70 uppercase tracking-wider">{item.label}</div>}
                          <div className="font-medium text-foreground">{item.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
