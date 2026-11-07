import { Link } from "react-router-dom";
import { Palette, Layout, FileText, Globe } from "lucide-react";

export function AdminCMS() {
  const sections = [
    { to: "/admin/cms/settings", label: "Site Settings", icon: <Palette className="w-4 h-4" />, desc: "Site name, colors, contact", color: "border-blueberry" },
    { to: "/admin/cms/menus", label: "Menus", icon: <Layout className="w-4 h-4" />, desc: "Header & footer navigation", color: "border-sunshine" },
    { to: "/admin/cms/footer", label: "Footer Blocks", icon: <FileText className="w-4 h-4" />, desc: "Footer content blocks", color: "border-mint" },
    { to: "/admin/cms/pages", label: "Pages", icon: <Globe className="w-4 h-4" />, desc: "About, Contact, Privacy pages", color: "border-sky" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">Website CMS</span>
        <h1 className="text-2xl font-bold text-blueberry">Edit the website</h1>
        <p className="text-muted-foreground">Change header, footer, menus and pages — no code deploy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="card group border-l-4 border-blueberry hover:border-sunshine transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color.replace("border-", "bg-")}/10 text-blueberry group-hover:bg-sunshine transition-colors`}>
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
