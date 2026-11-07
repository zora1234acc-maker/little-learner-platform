import { useTranslation } from "react-i18next";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionDivider } from "@/components/SectionDivider";

export function Home() {
  const { t } = useTranslation();
  const lang = localStorage.getItem("lang") || "en";

  return (
    <div className="space-y-16">
      {/* Hero — big typography as the design element, left-aligned */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="eyebrow">{t("home.eyebrow")}</span>
          <h1 className="text-5xl md:text-7xl font-black text-blueberry mb-6 leading-tight text-balance">
            {t("home.hero_title")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
            {t("home.hero_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
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
        {/* Abstract decorative circles — subtle, not gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-72 h-72 rounded-full bg-blueberry/8 -z-10" />
        <div className="absolute bottom-[-15%] left-[-10%] w-64 h-64 rounded-full bg-sunshine/8 -z-10" />
      </section>

      {/* Feature blocks — varied layout, not identical cards */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 card-md border-l-4 border-blueberry">
          <div className="icon-md bg-blueberry/10 text-blueberry mb-5">
            <Play className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground mb-3">{t("home.cards.lessons.title")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("home.cards.lessons.desc")}</p>
        </div>
        <div className="md:col-span-4 card-md border-l-4 border-sunshine">
          <div className="icon-md bg-sunshine/10 text-blueberry mb-5">
            <span className="w-6 h-6">✏️</span>
          </div>
          <h3 className="font-semibold text-lg text-foreground mb-3">{t("home.cards.quizzes.title")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("home.cards.quizzes.desc")}</p>
        </div>
        <div className="md:col-span-4 card-md border-l-4 border-mint">
          <div className="icon-md bg-mint/10 text-mint-600 mb-5">
            <span className="w-6 h-6">🌐</span>
          </div>
          <h3 className="font-semibold text-lg text-foreground mb-3">{t("home.cards.languages.title")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("home.cards.languages.desc")}</p>
        </div>
      </section>

      <SectionDivider />

      {/* How it works — left-aligned, numbered because it IS a sequence */}
      <section>
        <span className="eyebrow">{t("home.how_works")}</span>
        <h2 className="text-3xl font-black text-blueberry mb-8">{t("home.how_works_title")}</h2>
        <div className="space-y-10">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-start gap-5">
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-blueberry text-white text-xl font-black flex items-center justify-center">
                {step}
              </span>
              <div className="max-w-2xl">
                <h4 className="font-semibold text-xl text-foreground mb-2">{t(`home.steps.${step}.title`)}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`home.steps.${step}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
