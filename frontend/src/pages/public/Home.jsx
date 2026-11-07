import { useTranslation } from "react-i18next";
import { ArrowRight, Play, BookOpen, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export function Home() {
  const { t } = useTranslation();
  const lang = localStorage.getItem("lang") || "en";

  return (
    <div className="space-y-12">
      {/* Hero — typography as the design element, not a centered card */}
      <section className="relative overflow-hidden">
        <div className="relative z-10">
          <span className="eyebrow">{t("home.eyebrow")}</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-blueberry mb-6 leading-tight text-balance">
            {t("home.hero_title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            {t("home.hero_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/subjects"
              className="btn-primary"
            >
              <Play className="w-5 h-5" /> {t("home.cta_start")}
            </Link>
            <Link
              to="/login"
              className="btn-secondary"
            >
              <ArrowRight className="w-5 h-5" />
              {t("nav.login")}
            </Link>
          </div>
        </div>
        {/* Decorative circles — subtle, not gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full bg-blueberry/10 -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 rounded-full bg-sunshine/10 -z-10" />
      </section>

      {/* Three feature blocks — not identical cards, varied layout */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-blueberry">
          <div className="card-icon bg-blueberry/10 text-blueberry">
            <Play className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground mb-2">{t("home.cards.lessons.title")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("home.cards.lessons.desc")}</p>
        </div>
        <div className="card border-l-4 border-sky">
          <div className="card-icon bg-sky/10 text-sky-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground mb-2">{t("home.cards.quizzes.title")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("home.cards.quizzes.desc")}</p>
        </div>
        <div className="card border-l-4 border-mint">
          <div className="card-icon bg-mint/10 text-mint-600">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground mb-2">{t("home.cards.languages.title")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("home.cards.languages.desc")}</p>
        </div>
      </section>

      {/* How it works — left-aligned, numbered only because it's a sequence */}
      <section className="border-t border-border pt-10">
        <span className="eyebrow">{t("home.how_works")}</span>
        <h2 className="text-2xl font-bold text-blueberry mb-8">{t("home.how_works_title")}</h2>
        <div className="space-y-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blueberry text-white text-sm font-bold flex items-center justify-center">
                {step}
              </span>
              <div>
                <h4 className="font-semibold text-foreground mb-1">{t(`home.steps.${step}.title`)}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`home.steps.${step}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
