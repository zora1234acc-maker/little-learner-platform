import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";

export function ParentChildren() {
  const { t } = useTranslation();

  const children = [
    { id: "u3", name: "Sophal", avatar: "bear", grade: "Grade 1", lang: "Khmer", progress: 60, lastActive: "2 days ago" },
    { id: "u4", name: "Sophea", avatar: "cat", grade: "Grade 2", lang: "English", progress: 80, lastActive: "Today" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blueberry">My Children</h1>
          <p className="text-muted-foreground">View progress for your linked children.</p>
        </div>
        <Users className="w-8 h-8 text-blueberry" />
      </div>

      <div className="space-y-4">
        {children.map((child) => (
          <div key={child.id} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blueberry/5 via-white to-blueberry/5 rounded-2xl border border-transparent group-hover:border-blueberry/30 transition-all" />
            <div className="relative rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-2xl">{child.avatar}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{child.name}</h3>
                <p className="text-sm text-muted-foreground">{child.grade} • {child.lang}</p>
                <p className="text-xs text-muted-foreground mt-1">Last active: {child.lastActive}</p>
              </div>
              <div className="w-24 bg-muted/50 rounded-xl h-8 overflow-hidden">
                <div className={`bg-blueberry h-full rounded-xl`} style={{ width: `${child.progress}%` }} />
              </div>
              <span className="text-sm font-medium text-blueberry">{child.progress}%</span>
              <Link to={`/parent/child/${child.id}`} className="px-4 py-2 rounded-lg border border-blueberry text-blueberry text-sm font-medium hover:bg-blueberry hover:text-white transition-colors">
                View Details <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
