import { useTranslation } from "react-i18next";
import { ArrowRight, Play, BookOpen, Globe, Users, Star, Clock, ShieldCheck, Lock, GraduationCap, Mail, Palette, User } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionDivider } from "@/components/SectionDivider";

export function Home() {
  const { t } = useTranslation();
  const lang = localStorage.getItem("lang") || "en";

  const stats = [
    { number: "3", label: t("home.stats.subjects"), icon: <BookOpen className="w-5 h-5 text-blueberry" /> },
    { number: "15", label: t("home.stats.lessons"), icon: <Play className="w-5 h-5 text-sunshine" /> },
    { number: "10", label: t("home.stats.quizzes"), icon: <Star className="w-5 h-5 text-mint-600" /> },
    { number: "3", label: t("home.stats.languages"), icon: <Globe className="w-5 h-5 text-sky-600" /> },
  ];

  const features = [
    {
      icon: <User className="w-6 h-6 text-blueberry" />,
      title: t("home.features.kid_login.title"),
      desc: t("home.features.kid_login.desc"),
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-mint-600" />,
      title: t("home.features.privacy.title"),
      desc: t("home.features.privacy.desc"),
    },
    {
      icon: <Globe className="w-6 h-6 text-sky-600" />,
      title: t("home.features.multilingual.title"),
      desc: t("home.features.multilingual.desc"),
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-bubblegum" />,
      title: t("home.features.admin_cms.title"),
      desc: t("home.features.admin_cms.desc"),
    },
    {
      icon: <Mail className="w-6 h-6 text-sunshine" />,
      title: t("home.features.parent_view.title"),
      desc: t("home.features.parent_view.desc"),
    },
    {
      icon: <Lock className="w-6 h-6 text-blueberry" />,
      title: t("home.features.no_ads.title"),
      desc: t("home.features.no_ads.desc"),
    },
  ];

  const featuredSubjects = [
    { id: "sub1", title: { en: "Khmer Language", km: "ភាសាខ្មែរ", ar: "اللغة الخميرية" }, icon: "📖", color: "border-blueberry", desc: t("home.subj_desc.khmer") },
    { id: "sub2", title: { en: "Mathematics", km: "គណិតវិជ្ជា", ar: "الرياضيات" }, icon: "🔢", color: "border-sunshine", desc: t("home.subj_desc.math") },
    { id: "sub3", title: { en: "Science", km: "វិទ្យាសាស្ត្រ", ar: "العلوم" }, icon: "🔬", color: "border-mint", desc: t("home.subj_desc.science") },
  ];

  const recentLessons = [
    { id: "l1", title: { en: "First Consonant: ក", km: "អក្សរដើម៖ ក" }, type: "reading", icon: <BookOpen className="w-5 h-5 text-blueberry" /> },
    { id: "l2", title: { en: "Counting 1 to 5", km: "គណនា 1 ដល់ 5" }, type: "video", icon: <Play className="w-5 h-5 text-sunshine" /> },
    { id: "l3", title: { en: "Parts of a Plant", km: "បច្ចុប្បន្នភាពរបស់ស្លឹង" }, type: "reading", icon: <Globe className="w-5 h-5 text-mint-600" /> },
  ];

  const roles = [
    {
      role: "admin",
      title: t("home.roles.admin.title"),
      desc: t("home.roles.admin.desc"),
      icon: <User className="w-6 h-6 text-blueberry" />,
      link: "/login",
      linkText: t("home.roles.admin.link"),
    },
    {
      role: "teacher",
      title: t("home.roles.teacher.title"),
      desc: t("home.roles.teacher.desc"),
      icon: <GraduationCap className="w-6 h-6 text-sunshine" />,
      link: "/login",
      linkText: t("home.roles.teacher.link"),
    },
    {
      role: "student",
      title: t("home.roles.student.title"),
      desc: t("home.roles.student.desc"),
      icon: <User className="w-6 h-6 text-mint-600" />,
      link: "/login",
      linkText: t("home.roles.student.link"),
    },
    {
      role: "parent",
      title: t("home.roles.parent.title"),
      desc: t("home.roles.parent.desc"),
      icon: <User className="w-6 h-6 text-sky-600" />,
      link: "/login",
      linkText: t("home.roles.parent.link"),
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero */}
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
        <div className="absolute top-[-20%] right-[-10%] w-72 h-72 rounded-full bg-blueberry/8 -z-10" />
        <div className="absolute bottom-[-15%] left-[-10%] w-64 h-64 rounded-full bg-sunshine/8 -z-10" />
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.number} className="card-sm text-center p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                {stat.icon}
              </div>
              <div className="text-3xl font-black text-blueberry">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* Features Grid */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <span className="eyebrow">{t("home.features.title")}</span>
            <h2 className="text-3xl font-black text-blueberry">{t("home.features.subtitle")}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="card-sm p-6 text-center">
              <div className="icon-md bg-muted/50 text-muted-foreground mb-4 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* Featured Subjects */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <span className="eyebrow">{t("home.featured")}</span>
            <h2 className="text-3xl font-black text-blueberry">{t("home.featured_subjects")}</h2>
          </div>
          <Link to="/subjects" className="link-primary">
            {t("home.view_all")} <ArrowRight className="w-3 h-3 inline ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSubjects.map((sub) => {
            const title = sub.title[lang] || sub.title.en;
            return (
              <a
                key={sub.id}
                href={`/courses/${sub.id}`}
                className="card group border-l-4 border-blueberry hover:border-sunshine transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="icon-md bg-blueberry/10 text-blueberry">
                    {sub.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground">{sub.desc}</p>
              </a>
            );
          })}
        </div>
      </section>

      <SectionDivider />

      {/* Recent Lessons */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <span className="eyebrow">{t("home.recent")}</span>
            <h2 className="text-3xl font-black text-blueberry">{t("home.recent_lessons")}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentLessons.map((lesson) => {
            const title = lesson.title[lang] || lesson.title.en;
            return (
              <div key={lesson.id} className="card-sm">
                <div className="flex items-center gap-3 mb-4">
                  {lesson.icon}
                  <span className="text-xs font-semibold tracking-normal text-muted-foreground uppercase">
                    {lesson.type === "video" ? t("home.video") : t("home.reading")}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
                <Link to={`/lesson/${lesson.id}`} className="btn-secondary w-full">
                  {t("home.start")}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <SectionDivider />

      {/* Roles */}
      <section className="py-12">
        <span className="eyebrow">{t("home.roles.title")}</span>
        <h2 className="text-3xl font-black text-blueberry mb-8">{t("home.roles.subtitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <div key={role.role} className="card-sm p-6 text-center border-l-4 border-blueberry">
              <div className="icon-md bg-blueberry/10 text-blueberry mb-4 mx-auto flex items-center justify-center">
                {role.icon}
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-3">{role.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{role.desc}</p>
              <Link to={role.link} className="btn-secondary w-full">
                {role.linkText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* CTA */}
      <section className="rounded-[var(--radius-xl)] bg-blueberry text-white p-8 md:p-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-6">{t("home.cta_title")}</h2>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">{t("home.cta_desc")}</p>
          <Link to="/subjects" className="btn-primary inline-flex items-center justify-center gap-2">
            <Play className="w-5 h-5" /> {t("home.cta_start")}
          </Link>
        </div>
      </section>
    </div>
  );
}
