import { Link } from "react-router-dom";
import { Palette, Layout, FileText, Globe } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useTranslation } from "react-i18next";

export function AdminCMS() {
  const { t } = useTranslation();
  const sections = [
    { to: "/admin/cms/settings", label: t("nav.cms"), icon: <Palette className="w-4 h-4" />, desc: "Site name, colors, contact" },
    { to: "/admin/cms/menus", label: "Menus", icon: <Layout className="w-4 h-4" />, desc: "Header & footer navigation" },
    { to: "/admin/cms/footer", label: "Footer Blocks", icon: <FileText className="w-4 h-4" />, desc: "Footer content blocks" },
    { to: "/admin/cms/pages", label: "Pages", icon: <Globe className="w-4 h-4" />, desc: "About, Contact, Privacy pages" }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.cms")}
        title="Website CMS"
        description="Change header, footer, menus and pages — no code deploy."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="card group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-blueberry/10 group-hover:text-blueberry transition-colors">
                {s.icon}
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{s.label}</h3>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
