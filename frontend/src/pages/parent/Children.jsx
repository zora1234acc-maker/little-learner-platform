import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export function ParentChildren() {
  const { t } = useTranslation();

  const children = [
    { id: "u3", name: "Sophal", avatar: "🐻", grade: "Grade 1", lang: "Khmer", progress: 60, lastActive: "2 days ago" },
    { id: "u4", name: "Sophea", avatar: "🐱", grade: "Grade 2", lang: "English", progress: 80, lastActive: "Today" }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.library")}
        title="My Children"
        description="View progress for your linked children."
      />

      <div className="space-y-4">
        {children.map((child) => (
          <div key={child.id} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blueberry/5 via-transparent to-blueberry/5 rounded-2xl border border-transparent group-hover:border-blueberry/30 transition-all" />
            <div className="relative rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-muted/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="text-2xl">{child.avatar}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{child.name}</h3>
                <p className="text-sm text-muted-foreground">{child.grade} • {child.lang}</p>
                <p className="text-xs text-muted-foreground mt-1">Last active: {child.lastActive}</p>
              </div>
              <div className="w-24 bg-muted/40 rounded-lg h-6 overflow-hidden">
                <div className="bg-blueberry h-full rounded-lg" style={{ width: `${child.progress}%` }} />
              </div>
              <span className="text-sm font-medium text-blueberry">{child.progress}%</span>
              <Link to={`/parent/child/${child.id}`} className="btn-secondary touch-target">
                View Details <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
