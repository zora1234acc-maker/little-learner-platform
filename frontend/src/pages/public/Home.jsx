import { useTranslation } from "react-i18next";
import { ArrowRight, Play, BookOpen, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      <section className="relative rounded-2xl bg-blueberry text-white overflow-hidden p-6 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            {t("home.hero_title")}
          </h1>
          <p className="text-lg md:text-xl text-blueberry-100 mb-8 max-w-lg">
            {t("home.hero_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/subjects"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sunshine text-blueberry font-bold text-lg hover:bg-yellow-300 transition-colors"
            >
              <Play className="w-5 h-5" /> {t("home.cta_start")}
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors text-lg"
            >
              <ArrowRight className="w-5 h-5" />
              {t("nav.login")}
            </Link>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="150" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
          </svg>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard icon={<Play className="w-6 h-6 text-blueberry" />} title="Lessons" description="Video and reading lessons for early learners." />
        <InfoCard icon={<BookOpen className="w-6 h-6 text-sky-500" />} title="Quizzes" description="Auto-scored quizzes with instant feedback." />
        <InfoCard icon={<Globe className="w-6 h-6 text-mint-500" />} title="3 Languages" description="English, Khmer and Arabic with full RTL support." />
      </section>
    </div>
  );
}

function InfoCard({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
