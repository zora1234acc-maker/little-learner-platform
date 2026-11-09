import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Palette, Layout, FileText, Globe, Image, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useTranslation } from "react-i18next";
import { api } from "@/api/client";

export function AdminCMS() {
  const { t } = useTranslation();
  const [counts, setCounts] = useState({ menus: 0, footer: 0, pages: 0, media: 0 });

  useEffect(() => {
    Promise.all([api.cms.menus.list(), api.cms.footer.list(), api.cms.pages.list(), api.media.list()]).then(
      ([menus, footer, pages, media]) =>
        setCounts({
          menus: menus.data.length,
          footer: footer.data.length,
          pages: pages.data.length,
          media: media.data.length,
        })
    );
  }, []);

  const sections = [
    { to: "/admin/cms/settings", label: "Site settings", icon: Palette, desc: "Name, tagline, colors, contact", count: "3 languages" },
    { to: "/admin/cms/menus", label: "Menus", icon: Layout, desc: "Header and footer navigation", count: `${counts.menus} items` },
    { to: "/admin/cms/footer", label: "Footer blocks", icon: FileText, desc: "Text shown in the footer", count: `${counts.footer} blocks` },
    { to: "/admin/cms/pages", label: "Pages", icon: Globe, desc: "Homepage, About, Contact, Privacy", count: `${counts.pages} pages` },
    { to: "/admin/cms/media", label: "Media library", icon: Image, desc: "Images used across the site", count: `${counts.media} files` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.cms")}
        title="Website CMS"
        description="Change the header, footer, menus and pages — the public site updates without a code deploy."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.to} to={section.to} className="card-md group">
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blueberry/10 text-blueberry transition group-hover:bg-blueberry group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-muted/40 px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                  {section.count}
                </span>
              </div>
              <h3 className="mt-4 font-bold text-foreground">{section.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{section.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blueberry">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          );
        })}
      </div>

      <section className="card-md bg-sunshine/20">
        <h3 className="font-bold text-foreground">{t("admin.cms.how_built")}</h3>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          The React app loads settings, menus, footer blocks and page sections from the JSON API on every
          load. Nothing here is hardcoded — edit a label, save, refresh the public site and the new text
          appears in English and Khmer.
        </p>
      </section>
    </div>
  );
}
