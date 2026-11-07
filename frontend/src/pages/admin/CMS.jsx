import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Layout, Globe, Palette, FileText } from "lucide-react";

export function AdminCMS() {
  const { t } = useTranslation();

  const sections = [
    { to: "/admin/cms/settings", label: "Site Settings", icon: <Palette className="w-4 h-4" />, desc: "Site name, colors, contact" },
    { to: "/admin/cms/menus", label: "Menus", icon: <Layout className="w-4 h-4" />, desc: "Header & footer navigation" },
    { to: "/admin/cms/footer", label: "Footer Blocks", icon: <FileText className="w-4 h-4" />, desc: "Footer content blocks" },
    { to: "/admin/cms/pages", label: "Pages", icon: <Globe className="w-4 h-4" />, desc: "About, Contact, Privacy pages" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blueberry">Website CMS</h1>
        <p className="text-muted-foreground">Edit the public website without code changes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="flex flex-col p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-sunshine/10 flex items-center justify-center mb-3 group-hover:bg-sunshine transition-colors">
              {s.icon}
            </div>
            <h3 className="font-semibold text-foreground mb-1">{s.label}</h3>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
