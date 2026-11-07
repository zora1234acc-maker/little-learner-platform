import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Play,
  BookOpen,
  Globe,
  Users,
  Star,
  ShieldCheck,
  Lock,
  GraduationCap,
  Mail,
  User,
  HandHeart,
  Shield,
  Sparkles,
  Award,
  Trophy,
  Heart,
  CheckCircle2,
  ChevronDown,
  Lightbulb,
  Rocket,
  Clock,
  BookMarked,
  Brain,
  PartyPopper,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SectionDivider } from "@/components/SectionDivider";

export function Home() {
  const { t, i18n } = useTranslation();

  const lang = i18n.language?.split("-")[0] || "en";

  const stats = [
    {
      number: "3",
      label: t("home.stats.subjects"),
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
    },
    {
      number: "15",
      label: t("home.stats.lessons"),
      icon: Play,
      color: "bg-amber-100 text-amber-600",
    },
    {
      number: "10",
      label: t("home.stats.quizzes"),
      icon: Star,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      number: "3",
      label: t("home.stats.languages"),
      icon: Globe,
      color: "bg-sky-100 text-sky-600",
    },
    {
      number: "100%",
      label: t("home.stats.free"),
      icon: HandHeart,
      color: "bg-pink-100 text-pink-600",
    },
    {
      number: "0",
      label: t("home.stats.ads"),
      icon: Shield,
      color: "bg-teal-100 text-teal-600",
    },
  ];

  const features = [
    {
      icon: User,
      color: "bg-blue-100 text-blue-600",
      bg: "from-blue-50 to-indigo-50",
      title: t("home.features.kid_login.title"),
      desc: t("home.features.kid_login.desc"),
    },
    {
      icon: ShieldCheck,
      color: "bg-emerald-100 text-emerald-600",
      bg: "from-emerald-50 to-green-50",
      title: t("home.features.privacy.title"),
      desc: t("home.features.privacy.desc"),
    },
    {
      icon: Globe,
      color: "bg-sky-100 text-sky-600",
      bg: "from-sky-50 to-cyan-50",
      title: t("home.features.multilingual.title"),
      desc: t("home.features.multilingual.desc"),
    },
    {
      icon: GraduationCap,
      color: "bg-purple-100 text-purple-600",
      bg: "from-purple-50 to-fuchsia-50",
      title: t("home.features.admin_cms.title"),
      desc: t("home.features.admin_cms.desc"),
    },
    {
      icon: Mail,
      color: "bg-amber-100 text-amber-600",
      bg: "from-amber-50 to-orange-50",
      title: t("home.features.parent_view.title"),
      desc: t("home.features.parent_view.desc"),
    },
    {
      icon: Lock,
      color: "bg-pink-100 text-pink-600",
      bg: "from-pink-50 to-rose-50",
      title: t("home.features.no_ads.title"),
      desc: t("home.features.no_ads.desc"),
    },
  ];

  const featuredSubjects = [
    {
      id: "sub1",
      title: {
        en: "Khmer Language",
        km: "ភាសាខ្មែរ",
        ar: "اللغة الخميرية",
      },
      icon: "📖",
      bg: "from-blue-100 to-indigo-50",
      accent: "text-blue-700",
      emoji: "🔤",
      desc: t("home.subj_desc.khmer"),
    },
    {
      id: "sub2",
      title: {
        en: "Mathematics",
        km: "គណិតវិជ្ជា",
        ar: "الرياضيات",
      },
      icon: "🔢",
      bg: "from-amber-100 to-yellow-50",
      accent: "text-amber-700",
      emoji: "➕",
      desc: t("home.subj_desc.math"),
    },
    {
      id: "sub3",
      title: {
        en: "Science",
        km: "វិទ្យាសាស្ត្រ",
        ar: "العلوم",
      },
      icon: "🔬",
      bg: "from-emerald-100 to-green-50",
      accent: "text-emerald-700",
      emoji: "🌱",
      desc: t("home.subj_desc.science"),
    },
  ];

  const recentLessons = [
    {
      id: "l1",
      title: {
        en: "First Consonant: ក",
        km: "អក្សរដើម៖ ក",
      },
      type: "reading",
      emoji: "📚",
      bg: "from-blue-50 to-indigo-50",
      color: "text-blue-600",
    },
    {
      id: "l2",
      title: {
        en: "Counting 1 to 5",
        km: "គណនា 1 ដល់ 5",
      },
      type: "video",
      emoji: "🎬",
      bg: "from-pink-50 to-rose-50",
      color: "text-pink-600",
    },
    {
      id: "l3",
      title: {
        en: "Parts of a Plant",
        km: "ផ្នែកផ្សេងៗរបស់រុក្ខជាតិ",
      },
      type: "reading",
      emoji: "🌱",
      bg: "from-emerald-50 to-green-50",
      color: "text-emerald-600",
    },
  ];

  const roles = [
    {
      role: "admin",
      emoji: "👨‍💻",
      bg: "from-blue-50 to-indigo-100",
      icon: User,
      color: "text-blue-600",
      title: t("home.roles.admin.title"),
      desc: t("home.roles.admin.desc"),
      link: "/login",
      linkText: t("home.roles.admin.link"),
    },
    {
      role: "teacher",
      emoji: "👩‍🏫",
      bg: "from-amber-50 to-yellow-100",
      icon: GraduationCap,
      color: "text-amber-600",
      title: t("home.roles.teacher.title"),
      desc: t("home.roles.teacher.desc"),
      link: "/login",
      linkText: t("home.roles.teacher.link"),
    },
    {
      role: "student",
      emoji: "🧒",
      bg: "from-emerald-50 to-green-100",
      icon: User,
      color: "text-emerald-600",
      title: t("home.roles.student.title"),
      desc: t("home.roles.student.desc"),
      link: "/login",
      linkText: t("home.roles.student.link"),
    },
    {
      role: "parent",
      emoji: "👨‍👩‍👧",
      bg: "from-sky-50 to-cyan-100",
      icon: Users,
      color: "text-sky-600",
      title: t("home.roles.parent.title"),
      desc: t("home.roles.parent.desc"),
      link: "/login",
      linkText: t("home.roles.parent.link"),
    },
  ];

  const testimonials = [
    {
      name: "Mrs. Sreynith",
      role: t("home.testimonials.teacher_role"),
      quote: t("home.testimonials.teacher_quote"),
      rating: 5,
      emoji: "👩‍🏫",
    },
    {
      name: "Mr. Somchai",
      role: t("home.testimonials.parent_role"),
      quote: t("home.testimonials.parent_quote"),
      rating: 5,
      emoji: "👨",
    },
    {
      name: "Teacher Chan",
      role: t("home.testimonials.teacher2_role"),
      quote: t("home.testimonials.teacher2_quote"),
      rating: 5,
      emoji: "👨‍🏫",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      emoji: "👨‍👩‍👧",
      bg: "bg-blue-50",
      title: t("home.how_steps.1.title"),
      desc: t("home.how_steps.1.desc"),
    },
    {
      step: 2,
      emoji: "📚",
      bg: "bg-amber-50",
      title: t("home.how_steps.2.title"),
      desc: t("home.how_steps.2.desc"),
    },
    {
      step: 3,
      emoji: "🎬",
      bg: "bg-emerald-50",
      title: t("home.how_steps.3.title"),
      desc: t("home.how_steps.3.desc"),
    },
    {
      step: 4,
      emoji: "🏆",
      bg: "bg-pink-50",
      title: t("home.how_steps.4.title"),
      desc: t("home.how_steps.4.desc"),
    },
  ];

  const faqs = [
    { q: t("home.faqs.q1"), a: t("home.faqs.a1") },
    { q: t("home.faqs.q2"), a: t("home.faqs.a2") },
    { q: t("home.faqs.q3"), a: t("home.faqs.a3") },
    { q: t("home.faqs.q4"), a: t("home.faqs.a4") },
  ];

  const badges = [
    { name: "COPPA Compliant", emoji: "🛡️", bg: "bg-blue-50" },
    { name: "Kid Safe Certified", emoji: "🔒", bg: "bg-emerald-50" },
    { name: "No Ads", emoji: "🚫", bg: "bg-pink-50" },
    { name: "No Trackers", emoji: "👁️", bg: "bg-sky-50" },
    { name: "Free Forever", emoji: "🏆", bg: "bg-amber-50" },
    { name: "Khmer Supported", emoji: "❤️", bg: "bg-purple-50" },
  ];

  return (
    <div className="overflow-hidden space-y-16 md:space-y-24 pb-8">
      {/* ================= HERO ================= */}
      <section className="relative pt-8 md:pt-14">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 rounded-full bg-amber-100/60 blur-3xl" />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-6">
          {/* Hero Content */}
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
              <Sparkles className="h-4 w-4" />
              {t("home.eyebrow")}
            </div>

            <h1 className="mb-6 text-4xl font-black leading-[1.15] tracking-tight text-blueberry sm:text-5xl lg:text-6xl xl:text-7xl">
              {t("home.hero_title")}
            </h1>

            <p className="mb-8 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg md:text-xl">
              {t("home.hero_subtitle")}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/subjects"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-blueberry px-7 py-4 font-bold text-white shadow-lg shadow-blueberry/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blueberry/90 hover:shadow-xl"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Play className="h-4 w-4 fill-current" />
                </span>
                {t("home.cta_start")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-blueberry/15 bg-white px-7 py-4 font-bold text-blueberry transition-all duration-300 hover:-translate-y-1 hover:border-blueberry hover:bg-blue-50"
              >
                {t("nav.login")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {t("home.stats.free")}
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                {t("home.features.privacy.title")}
              </span>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="relative min-h-[320px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-blue-50 to-purple-100 p-6 sm:min-h-[400px] sm:p-10">
              {/* Decorative circles */}
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/50" />
              <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-amber-200/40" />
              <div className="absolute right-10 top-16 h-16 w-16 rounded-full bg-amber-200/60 blur-xl" />

              {/* Floating icons */}
              <div className="absolute left-8 top-10 animate-bounce text-4xl">
                ⭐
              </div>
              <div className="absolute right-12 top-8 text-4xl">☀️</div>
              <div className="absolute bottom-16 left-8 text-3xl">🌈</div>
              <div className="absolute bottom-10 right-8 animate-pulse text-4xl">
                ✨
              </div>

              {/* Main illustration */}
              <div className="relative z-10 flex h-full min-h-[280px] flex-col items-center justify-center">
                <div className="mb-3 rounded-full bg-white/80 px-5 py-2 text-sm font-black text-blueberry shadow-sm">
                  🌟 Let's Learn Together!
                </div>

                <div className="flex items-end justify-center gap-2 sm:gap-6">
                  <div className="flex flex-col items-center">
                    <div className="mb-2 rounded-3xl bg-blue-500 p-4 text-6xl shadow-xl shadow-blue-500/20 sm:text-8xl">
                      👦🏻
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-2 text-2xl shadow-md">
                      📘
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="mb-2 rounded-3xl bg-pink-400 p-4 text-6xl shadow-xl shadow-pink-400/20 sm:text-8xl">
                      👧🏻
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-2 text-2xl shadow-md">
                      🖍️
                    </div>
                  </div>
                </div>

                {/* Learning floating cards */}
                <div className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-2xl bg-white p-3 shadow-lg sm:block">
                  <div className="text-2xl">🔢</div>
                  <div className="text-xs font-bold text-blueberry">123</div>
                </div>

                <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-2xl bg-white p-3 shadow-lg sm:block">
                  <div className="text-2xl">🧪</div>
                  <div className="text-xs font-bold text-emerald-600">
                    Explore
                  </div>
                </div>

                <div className="mt-5 rounded-full bg-white/80 px-5 py-2 text-sm font-bold text-blueberry shadow-sm">
                  📚 Learn • Play • Grow
                </div>
              </div>
            </div>

            {/* Floating achievement */}
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl sm:-left-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-2xl">
                🏆
              </div>
              <div>
                <div className="text-sm font-black text-blueberry">
                  Great Job!
                </div>
                <div className="text-xs text-muted-foreground">
                  Keep learning every day
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={`${stat.label}-${index}`}
                className="group rounded-3xl border border-border/60 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5"
              >
                <div
                  className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="text-2xl font-black text-blueberry sm:text-3xl">
                  {stat.number}
                </div>

                <div className="mt-1 text-xs font-semibold text-muted-foreground sm:text-sm">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <SectionDivider />

      {/* ================= FEATURES ================= */}
      <section>
        <div className="mb-9 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600">
            <Sparkles className="h-4 w-4" />
            {t("home.features.title")}
          </span>

          <h2 className="text-3xl font-black text-blueberry sm:text-4xl">
            {t("home.features.subtitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className={`group rounded-3xl border border-white bg-gradient-to-br ${feature.bg} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color} transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mb-2 text-lg font-bold text-foreground">
                  {feature.title}
                </h3>

                <p className="text-sm leading-7 text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <SectionDivider />

      {/* ================= HOW IT WORKS ================= */}
      <section>
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-600">
            <Lightbulb className="h-4 w-4" />
            {t("home.how_works.title")}
          </span>

          <h2 className="text-3xl font-black text-blueberry sm:text-4xl">
            {t("home.how_works.subtitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step) => (
            <div
              key={step.step}
              className={`relative rounded-3xl border border-border/50 ${step.bg} p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="absolute -top-3 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-blueberry text-sm font-black text-white shadow-md">
                {step.step}
              </div>

              <div className="mb-5 mt-3 text-5xl transition-transform duration-300 hover:scale-110">
                {step.emoji}
              </div>

              <h3 className="mb-3 text-lg font-bold text-foreground">
                {step.title}
              </h3>

              <p className="text-sm leading-7 text-muted-foreground">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* ================= SUBJECTS ================= */}
      <section>
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600">
              <BookOpen className="h-4 w-4" />
              {t("home.featured")}
            </span>

            <h2 className="text-3xl font-black text-blueberry sm:text-4xl">
              {t("home.featured_subjects")}
            </h2>
          </div>

          <Link
            to="/subjects"
            className="group inline-flex items-center gap-2 font-bold text-blueberry transition-colors hover:text-sky-600"
          >
            {t("home.view_all")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {featuredSubjects.map((sub) => {
            const title = sub.title[lang] || sub.title.en;

            return (
              <Link
                key={sub.id}
                to={`/courses/${sub.id}`}
                className={`group relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${sub.bg} p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-8`}
              >
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/40 transition-transform duration-500 group-hover:scale-150" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm transition-transform duration-300 group-hover:rotate-6">
                      {sub.icon}
                    </div>

                    <h3 className={`mb-2 text-xl font-black ${sub.accent}`}>
                      {title}
                    </h3>

                    <p className="max-w-[220px] text-sm leading-6 text-muted-foreground">
                      {sub.desc}
                    </p>
                  </div>

                  <div className="text-6xl opacity-80 transition-transform duration-300 group-hover:scale-110">
                    {sub.emoji}
                  </div>
                </div>

                <div className="relative mt-6 flex items-center justify-between">
                  <span className={`text-sm font-bold ${sub.accent}`}>
                    {t("home.start")}
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-all group-hover:bg-blueberry group-hover:text-white">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <SectionDivider />

      {/* ================= RECENT LESSONS ================= */}
      <section>
        <div className="mb-9">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-bold text-purple-600">
            <Clock className="h-4 w-4" />
            {t("home.recent")}
          </span>

          <h2 className="text-3xl font-black text-blueberry sm:text-4xl">
            {t("home.recent_lessons")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {recentLessons.map((lesson) => {
            const title = lesson.title[lang] || lesson.title.en;

            return (
              <div
                key={lesson.id}
                className={`group overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br ${lesson.bg} p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-muted-foreground shadow-sm">
                    {lesson.type === "video"
                      ? t("home.video")
                      : t("home.reading")}
                  </span>

                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white ${lesson.color}`}
                  >
                    {lesson.type === "video" ? (
                      <Play className="h-5 w-5 fill-current" />
                    ) : (
                      <BookOpen className="h-5 w-5" />
                    )}
                  </span>
                </div>

                <div className="mb-5 flex items-center gap-4">
                  <div className="text-5xl transition-transform duration-300 group-hover:scale-110">
                    {lesson.emoji}
                  </div>

                  <h3 className="text-lg font-bold leading-7 text-foreground">
                    {title}
                  </h3>
                </div>

                <Link
                  to={`/lesson/${lesson.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blueberry shadow-sm transition-all hover:bg-blueberry hover:text-white"
                >
                  <Play className="h-4 w-4" />
                  {t("home.start")}
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <SectionDivider />

      {/* ================= ROLES ================= */}
      <section>
        <div className="mb-9 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-bold text-pink-600">
            <Users className="h-4 w-4" />
            {t("home.roles.title")}
          </span>

          <h2 className="text-3xl font-black text-blueberry sm:text-4xl">
            {t("home.roles.subtitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <div
                key={role.role}
                className={`group rounded-3xl border border-white bg-gradient-to-br ${role.bg} p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg`}
              >
                <div className="mb-5 flex flex-col items-center">
                  <div className="mb-3 text-5xl transition-transform duration-300 group-hover:scale-110">
                    {role.emoji}
                  </div>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white ${role.color} shadow-sm`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="mb-3 text-lg font-black text-foreground">
                  {role.title}
                </h3>

                <p className="mb-6 min-h-12 text-sm leading-6 text-muted-foreground">
                  {role.desc}
                </p>

                <Link
                  to={role.link}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blueberry shadow-sm transition-all hover:bg-blueberry hover:text-white"
                >
                  {role.linkText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <SectionDivider />

      {/* ================= TESTIMONIALS ================= */}
      <section>
        <div className="mb-9 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-600">
            <Heart className="h-4 w-4" />
            {t("home.testimonials.title")}
          </span>

          <h2 className="text-3xl font-black text-blueberry sm:text-4xl">
            {t("home.testimonials.subtitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-3xl border border-border/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 flex gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-current" />
                ))}
              </div>

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-3xl">
                💬
              </div>

              <p className="mb-7 text-sm leading-7 text-muted-foreground">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-3 border-t border-border/50 pt-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl">
                  {testimonial.emoji}
                </div>

                <div>
                  <div className="font-bold text-foreground">
                    {testimonial.name}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* ================= TRUST BADGES ================= */}
      <section>
        <div className="mb-9 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
            {t("home.badges.title")}
          </span>

          <h2 className="text-3xl font-black text-blueberry sm:text-4xl">
            {t("home.badges.subtitle")}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className={`flex flex-col items-center justify-center gap-3 rounded-2xl ${badge.bg} p-5 text-center transition-transform duration-300 hover:-translate-y-1`}
            >
              <span className="text-3xl">{badge.emoji}</span>

              <span className="text-xs font-bold text-foreground sm:text-sm">
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* ================= FAQ ================= */}
      <section>
        <div className="mb-9 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-600">
            <Lightbulb className="h-4 w-4" />
            {t("home.faqs.title")}
          </span>

          <h2 className="text-3xl font-black text-blueberry sm:text-4xl">
            {t("home.faqs.subtitle")}
          </h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all open:border-blue-200 open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold text-foreground marker:hidden">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blueberry">
                    {index + 1}
                  </span>

                  <span className="text-sm sm:text-base">{faq.q}</span>
                </div>

                <ChevronDown className="h-5 w-5 shrink-0 text-blueberry transition-transform duration-300 group-open:rotate-180" />
              </summary>

              <div className="px-5 pb-5 pl-16 text-sm leading-7 text-muted-foreground">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blueberry via-blue-700 to-indigo-800 px-6 py-14 text-white shadow-xl sm:px-12 sm:py-16">
        {/* Decorative elements */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-sky-300/10" />
        <div className="absolute right-10 top-10 text-4xl">⭐</div>
        <div className="absolute bottom-10 left-10 text-4xl">✨</div>
        <div className="absolute right-1/4 bottom-8 text-3xl">🎈</div>

        <div className="relative z-10 grid items-center gap-10 md:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
              <PartyPopper className="h-4 w-4" />
              Let's start the adventure!
            </div>

            <h2 className="mb-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              {t("home.cta_title")}
            </h2>

            <p className="mb-8 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
              {t("home.cta_desc")}
            </p>

            <Link
              to="/subjects"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-amber-400 px-7 py-4 font-black text-blueberry shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-amber-300 hover:shadow-xl"
            >
              <Play className="h-5 w-5 fill-current" />
              {t("home.cta_start")}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="hidden text-center md:block">
            <div className="text-8xl lg:text-9xl">🎓</div>
            <div className="mt-3 rounded-full bg-white/15 px-5 py-2 text-sm font-bold text-white">
              Learn Something New!
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
