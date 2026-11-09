import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Globe,
  HandHeart,
  Image as ImageIcon,
  KeyRound,
  Play,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  GraduationCap,
  Heart,
  Lightbulb,
  PartyPopper,
  Palette,
  Calculator,
  Sprout,
  LibraryBig,
  LockKeyhole,
  Rocket,
  Route,
  Compass,
  PencilLine,
  Trophy,
  PawPrint,
  Cat,
  Dog,
  Bird,
  Video,
} from "lucide-react";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext";

/* =========================================================
   LITTLE LEARNER — PLAYFUL MODERN DESIGN
   React + Vite + Tailwind CSS
   ========================================================= */

const PICTURES = [PawPrint, Cat, Dog, Bird];
const PIN_DIGITS = ["4", "2", "7", "1"];

const GLYPHS = [
  "ក",
  "ខ",
  "គ",
  "ឃ",
  "ង",
  "ច",
  "ឆ",
  "ជ",
  "ឈ",
  "ញ",
  "ដ",
  "ឋ",
  "ឌ",
  "ឍ",
  "ណ",
  "១",
  "២",
  "៣",
  "៤",
  "៥",
  "៦",
  "៧",
  "៨",
  "៩",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
];

const COVERS = [
  {
    bg: "bg-[#EDEBFF]",
    iconBg: "bg-[#DCD7FF]",
    ink: "text-[#4648A0]",
    Icon: Palette,
    decoration: "bg-[#C9C2FF]",
  },
  {
    bg: "bg-[#FFF4D9]",
    iconBg: "bg-[#FFE6A5]",
    ink: "text-[#A66A00]",
    Icon: Calculator,
    decoration: "bg-[#FFD875]",
  },
  {
    bg: "bg-[#E1F7EF]",
    iconBg: "bg-[#C4EDDD]",
    ink: "text-[#16785D]",
    Icon: Sprout,
    decoration: "bg-[#9DDFC7]",
  },
  {
    bg: "bg-[#FFE8EF]",
    iconBg: "bg-[#FFD0DE]",
    ink: "text-[#B3324F]",
    Icon: LibraryBig,
    decoration: "bg-[#FFB9CD]",
  },
];

const QR_CELLS = Array.from({ length: 81 }, (_, index) => {
  const row = Math.floor(index / 9);
  const col = index % 9;

  const inFinder = (startRow, startCol) =>
    row >= startRow &&
    row < startRow + 3 &&
    col >= startCol &&
    col < startCol + 3;

  if (inFinder(0, 0) || inFinder(0, 6) || inFinder(6, 0)) {
    return true;
  }

  return (row * 7 + col * 5 + row * col) % 5 < 2;
});

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4648A0] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const sectionSpacing = "space-y-4";

/* =========================================================
   REVEAL ANIMATION
   ========================================================= */

function useInView(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      options || { threshold: 0.15 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    rootMargin: "0px 0px -5% 0px",
  });

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

/* =========================================================
   SECTION HEADER
   ========================================================= */

function SectionHeader({ label, title, description, action, emoji }) {
  const isIconComponent =
    emoji && (typeof emoji === "function" || typeof emoji === "object");
  const SectionIcon = isIconComponent ? emoji : null;

  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <div className="mb-3 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#777A91]">
          <span className="h-px w-8 bg-[#B7B4E8]" />
          {SectionIcon ? (
            <SectionIcon className="h-4 w-4 text-[#514BFF]" />
          ) : (
            emoji && <span className="text-base tracking-normal">{emoji}</span>
          )}
          <span>{label}</span>
        </div>

        <h2 className="text-balance text-2xl font-extrabold tracking-[-0.03em] text-[#2B2D4F] sm:text-3xl lg:text-[2.2rem]">
          {title}
        </h2>

        {description && (
          <p className="mt-3 text-sm leading-7 text-[#737793] sm:text-base">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

/* =========================================================
   BUTTONS
   ========================================================= */

function PrimaryButton({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[4px] bg-[#4648A0] px-6 py-3 text-sm font-extrabold text-white shadow-[0_4px_0_#353780] transition duration-200 hover:-translate-y-0.5 hover:bg-[#353780] hover:shadow-[0_6px_0_#292B68] active:translate-y-0.5 active:shadow-[0_2px_0_#353780] ${focusRing} ${className}`}
    >
      {children}
    </Link>
  );
}

function SecondaryButton({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[4px] border border-[#D9DBE8] bg-white px-6 py-3 text-sm font-extrabold text-[#353780] transition hover:-translate-y-0.5 hover:border-[#B9B5E9] hover:bg-[#F8F7FF] ${focusRing} ${className}`}
    >
      {children}
    </Link>
  );
}

/* =========================================================
   SIGN-IN PREVIEW
   ========================================================= */

function SignInPreview({ t }) {
  const [mode, setMode] = useState("picture");
  const cardRef = useRef(null);
  const canTilt = useRef(false);

  useEffect(() => {
    canTilt.current =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  const handleMove = (event) => {
    const card = cardRef.current;
    if (!canTilt.current || !card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.setProperty("--rx", `${-y * 4}deg`);
    card.style.setProperty("--ry", `${x * 5}deg`);
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  const tabs = [
    {
      id: "picture",
      label: t("home.signin.tabs.picture"),
      Icon: ImageIcon,
    },
    {
      id: "pin",
      label: t("home.signin.tabs.pin"),
      Icon: KeyRound,
    },
    {
      id: "qr",
      label: t("home.signin.tabs.qr"),
      Icon: QrCode,
    },
  ];

  return (
    <div
      className="relative mx-auto w-full max-w-[410px]"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Decorative background */}
      <div className="absolute -right-5 -top-7 z-0 h-24 w-24 rounded-[4px] bg-[#FFD75E] rotate-12" />
      <div className="absolute -bottom-5 -left-6 z-0 h-20 w-20 rounded-[4px] bg-[#FFC9DA]" />

      <div
        ref={cardRef}
        className="tilt-card relative z-10 rounded-[4px] border border-[#E2E3EE] bg-white p-5 shadow-[0_18px_45px_-28px_rgba(43,45,79,0.4)] transition-transform duration-200 sm:p-7"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#9699B2]">
              LITTLE LEARNER
            </span>
            <h2 className="mt-1 text-xl font-extrabold text-[#2B2D4F]">
              {t("home.signin.title")}
            </h2>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-[4px] bg-[#FFF4D9] text-2xl">
            <LockKeyhole className="h-6 w-6 text-[#8A650C]" />
          </div>
        </div>

        <div
          role="group"
          aria-label={t("home.signin.title")}
          className="flex gap-1 border-b border-[#ECECF4] bg-white p-1"
        >
          {tabs.map((tab) => {
            const active = mode === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMode(tab.id)}
                aria-pressed={active}
                className={`flex min-h-[43px] flex-1 items-center justify-center gap-1.5 rounded-[4px] px-1 text-xs font-extrabold transition ${
                  active
                    ? "bg-[#F0EFFF] text-[#4648A0]"
                    : "text-[#9295AE] hover:text-[#4648A0]"
                } ${focusRing}`}
              >
                <tab.Icon aria-hidden="true" className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          key={mode}
          className="mt-5 flex min-h-[150px] animate-pane-in items-center justify-center"
        >
          {mode === "picture" && (
            <div className="grid w-full grid-cols-4 gap-2.5" aria-hidden="true">
              {PICTURES.map((picture, index) => {
                const Picture = picture;
                return (
                  <span
                    key={index}
                    className={`flex aspect-square items-center justify-center rounded-[4px] text-4xl transition hover:-translate-y-1 ${
                      [
                        "bg-[#EDEBFF]",
                        "bg-[#FFE8EF]",
                        "bg-[#E1F7EF]",
                        "bg-[#FFF4D9]",
                      ][index]
                    }`}
                  >
                    <Picture className="h-8 w-8 text-[#4648A0]" />
                  </span>
                );
              })}
            </div>
          )}

          {mode === "pin" && (
            <div
              className="flex w-full items-center justify-center gap-2"
              aria-hidden="true"
            >
              {PIN_DIGITS.map((digit, index) => (
                <span
                  key={index}
                  className="flex h-14 w-12 items-center justify-center rounded-[4px] border-2 border-[#DCD9F3] bg-[#F8F7FF] text-2xl font-black text-[#4648A0]"
                >
                  {digit}
                </span>
              ))}
            </div>
          )}

          {mode === "qr" && (
            <div
              aria-hidden="true"
              className="rounded-[4px] border border-[#E8E6F6] bg-white p-3 shadow-sm"
            >
              <div className="grid w-[124px] grid-cols-9 gap-[2px]">
                {QR_CELLS.map((filled, index) => (
                  <span
                    key={index}
                    className={`aspect-square rounded-[4px] ${
                      filled ? "bg-[#353780]" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="min-h-[42px] text-center text-[13px] leading-6 text-[#777B96]">
          {t(`home.signin.hints.${mode}`)}
        </p>

        <Link
          to="/login"
          className={`mt-4 flex min-h-[50px] items-center justify-center gap-2 rounded-[4px] bg-[#FFF4D9] text-sm font-extrabold text-[#8A650C] transition hover:bg-[#FFE9AF] ${focusRing}`}
        >
          {t("home.signin.link")}
          <ArrowRight className="flip-rtl h-4 w-4" />
        </Link>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#8B8EA7]">
          <ShieldCheck className="h-4 w-4 text-[#1B9A75]" />
          {t("home.stats.ads")}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SUBJECT CARD
   ========================================================= */

function SubjectCard({ href, cover, title, description, actionLabel }) {
  const cardRef = useRef(null);

  const handleMove = (event) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    card.style.setProperty(
      "--mx",
      `${((event.clientX - rect.left) / rect.width) * 100}%`,
    );

    card.style.setProperty(
      "--my",
      `${((event.clientY - rect.top) / rect.height) * 100}%`,
    );
  };

  return (
    <Link
      ref={cardRef}
      to={href}
      onMouseMove={handleMove}
      className={`group relative flex min-h-[270px] flex-col overflow-hidden rounded-[4px] border border-black/[0.04] ${cover.bg} transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_-22px_rgba(43,45,79,0.3)] ${focusRing}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.65), transparent 65%)",
        }}
      />

      <div className="relative flex items-start justify-between px-6 pt-6">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-[4px] ${cover.iconBg} text-3xl transition duration-300 group-hover:rotate-6 group-hover:scale-110`}
        >
          <cover.Icon className={`h-7 w-7 ${cover.ink}`} />
        </div>

        <span
          className={`h-12 w-12 rounded-[4px] ${cover.decoration} opacity-50 transition duration-300 group-hover:scale-125`}
        />
      </div>

      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-5">
        <h3 className={`text-xl font-extrabold ${cover.ink}`}>{title}</h3>

        <p className="mt-2 flex-1 text-sm leading-7 text-[#666B83]">
          {description}
        </p>

        <span
          className={`mt-5 inline-flex items-center gap-2 text-sm font-extrabold ${cover.ink}`}
        >
          {actionLabel}
          <ArrowRight className="flip-rtl h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/* =========================================================
   QUIZ DEMO
   ========================================================= */

function QuizDemo({ t, text, questions }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);

  if (!questions.length) return null;

  const question = questions[index];
  const pickedOption = question.options?.find((option) => option.id === picked);

  const answered = Boolean(pickedOption);
  const correct = Boolean(pickedOption?.is_correct);
  const isLast = index === questions.length - 1;

  const advance = () => {
    setPicked(null);
    setIndex((current) => (current === questions.length - 1 ? 0 : current + 1));
  };

  const stateClasses = (option) => {
    if (!answered) {
      return "border-white/15 bg-white/[0.06] text-white hover:border-[#FFD75E]/70 hover:bg-white/10";
    }

    if (option.is_correct) {
      return "border-[#5CC8AF] bg-[#5CC8AF]/20 text-white";
    }

    if (option.id === picked) {
      return "border-[#FF91B1] bg-[#FF91B1]/15 text-white";
    }

    return "border-white/10 bg-white/[0.03] text-white/50";
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-extrabold text-white/80">
          {t("home.quiz_demo.progress", {
            current: index + 1,
            total: questions.length,
          })}
        </span>

        <div className="h-2 w-24 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-[#FFD75E] transition-all duration-500"
            style={{
              width: `${((index + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <p className="mt-6 text-lg font-extrabold leading-8 text-white sm:text-xl">
        {text(question.text)}
      </p>

      <div
        role="group"
        aria-label={text(question.text)}
        className="mt-5 grid gap-3 sm:grid-cols-2"
      >
        {question.options?.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              if (answered && correct) return;
              setPicked(option.id);
            }}
            aria-pressed={picked === option.id}
            className={`flex min-h-[56px] items-center justify-between gap-3 rounded-xl border px-4 py-3 text-start text-sm font-bold transition ${stateClasses(option)} ${focusRing}`}
          >
            <span>{text(option.text)}</span>

            {answered && option.is_correct && (
              <Check
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-[#5CC8AF]"
                strokeWidth={3}
              />
            )}

            {answered && !option.is_correct && option.id === picked && (
              <RotateCcw aria-hidden="true" className="h-4 w-4 shrink-0" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-[60px]" aria-live="polite">
        {answered && (
          <div
            key={`${index}-${picked}`}
            className={`flex flex-wrap items-center gap-3 rounded-xl px-4 py-3 ${
              correct ? "bg-[#5CC8AF]/15" : "bg-[#FF91B1]/10"
            }`}
          >
            <span
              className={`flex items-center gap-2 text-sm font-extrabold ${
                correct ? "text-[#A9EEDC]" : "text-[#FFC2D2]"
              }`}
            >
              {correct ? (
                <Check className="h-4 w-4" strokeWidth={3} />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}

              {correct ? t("home.quiz_demo.right") : t("home.quiz_demo.again")}
            </span>

            {correct && (
              <button
                type="button"
                onClick={advance}
                className="ms-auto inline-flex min-h-[42px] items-center gap-2 rounded-[4px] bg-[#FFD75E] px-4 text-sm font-extrabold text-[#2B2D4F] transition hover:bg-[#FFCB36]"
              >
                {isLast
                  ? t("home.quiz_demo.restart")
                  : t("home.quiz_demo.next")}

                <ArrowRight className="flip-rtl h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   TESTIMONIAL CARD
   ========================================================= */

function TestimonialCard({ item, index }) {
  const colors = [
    "bg-[#EDEBFF] text-[#4648A0]",
    "bg-[#FFE8EF] text-[#B3324F]",
    "bg-[#E1F7EF] text-[#16785D]",
  ];

  return (
    <figure className="flex h-full flex-col rounded-[4px] border border-[#ECEBF5] bg-white p-6 shadow-[0_8px_30px_-25px_rgba(43,45,79,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-25px_rgba(43,45,79,0.25)]">
      <div className="mb-4 flex gap-1 text-[#F4B83F]" aria-label="5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>

      <blockquote className="flex-1 text-[15px] leading-7 text-[#555A77]">
        “{item.quote}”
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-[#F0EFF6] pt-5">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-12 w-12 rounded-[4px] object-cover ring-2 ring-[#F0EFF6]"
          />
        ) : (
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-[4px] text-lg font-black ${colors[index % colors.length]}`}
          >
            {item.name.charAt(0)}
          </span>
        )}

        <span className="min-w-0">
          <span className="block truncate text-sm font-extrabold text-[#2B2D4F]">
            {item.name}
          </span>
          <span className="mt-0.5 block text-xs font-semibold text-[#9295AE]">
            {item.role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/* =========================================================
   MAIN HOMEPAGE
   ========================================================= */

export function Home() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  const lang = (i18n.language || "en").split("-")[0];

  const [subjects, setSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [stepsRef, stepsInView] = useInView({
    threshold: 0.35,
  });

  /* Load dynamic homepage content from existing APIs */
  useEffect(() => {
    let live = true;

    const load = async () => {
      try {
        const [subjectRes, lessonRes, quizRes] = await Promise.all([
          api.content.subjects.list(),
          api.content.lessons.list(),
          api.content.quizzes.list(),
        ]);

        const quiz = (quizRes.data || []).find(
          (item) => item.is_published !== false,
        );

        const questionRes = quiz
          ? await api.content.questions.list(quiz.id)
          : { data: [] };

        if (!live) return;

        setSubjects(
          (subjectRes.data || []).filter((item) => item.is_published !== false),
        );

        setLessons(
          (lessonRes.data || [])
            .filter((item) => item.is_published !== false)
            .slice(0, 3),
        );

        setQuestions(questionRes.data || []);
      } catch (error) {
        console.error("Unable to load homepage content:", error);
      }
    };

    load();

    return () => {
      live = false;
    };
  }, []);

  /* Localized dynamic API content */
  const text = (field) =>
    typeof field === "string" ? field : field?.[lang] || field?.en || "";

  /* How it works */
  const steps = [1, 2, 3, 4].map((step) => ({
    step,
    title: t(`home.how_steps.${step}.title`),
    desc: t(`home.how_steps.${step}.desc`),
  }));

  /* Privacy promises */
  const promises = [1, 2, 3, 4].map((point) => t(`home.privacy.point${point}`));

  /* FAQ */
  const faqs = [1, 2, 3, 4].map((item) => ({
    question: t(`home.faqs.q${item}`),
    answer: t(`home.faqs.a${item}`),
  }));

  /* Existing role-based destinations */
  const dashboardPath =
    {
      admin: "/admin",
      teacher: "/teacher/library",
      parent: "/parent",
      student: "/student/todo",
    }[user?.role] || "/login";

  const primaryTo = isAuthenticated ? dashboardPath : "/subjects";

  const primaryLabel = isAuthenticated
    ? t("home.continue")
    : t("home.cta_start");

  const secondaryTo = isAuthenticated ? "/subjects" : "/login";

  const secondaryLabel = isAuthenticated ? t("home.browse") : t("nav.login");

  return (
    <div className="home-page overflow-hidden space-y-20 pb-8 sm:space-y-24 lg:space-y-28">
      {/* =====================================================
          01. HERO SECTION
      ===================================================== */}

      <section className="relative isolate overflow-hidden rounded-[2rem] border border-[#E6E6F0] bg-gradient-to-br from-[#FFFFFF] via-[#FCFCFF] to-[#F0EEFF] px-5 py-10 shadow-[0_24px_70px_-38px_rgba(70,72,160,0.45)] sm:px-9 sm:py-14 lg:px-14 lg:py-16">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-10 -z-0 h-64 w-64 rounded-[4px] bg-[#EDEBFF] blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-0 -z-0 h-72 w-72 rounded-[4px] bg-[#FFF2CD] blur-3xl"
        />

        <div className="relative z-10 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="relative">
            <div className="mb-5 inline-flex animate-rise-in items-center gap-2 border-b-2 border-[#FFD75E] pb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#4648A0] sm:text-sm">
              <Sparkles className="h-4 w-4 text-[#E9A92D]" />
              {t("home.eyebrow")}
            </div>

            <h1
              style={{ animationDelay: "70ms" }}
              className="animate-rise-in max-w-[11ch] text-balance text-[2.75rem] font-black leading-[1.04] tracking-[-0.045em] text-[#2B2D4F] sm:text-5xl lg:text-[4.15rem]"
            >
              {t("home.hero_title")}
              <span className="ms-2 inline-block text-[#B3324F]">✦</span>
            </h1>

            <p
              style={{ animationDelay: "140ms" }}
              className="mt-6 max-w-xl animate-rise-in text-base leading-8 text-[#666B85] sm:text-lg"
            >
              {t("home.hero_subtitle")}
            </p>

            <div
              style={{ animationDelay: "210ms" }}
              className="mt-8 flex animate-rise-in flex-col gap-4 sm:flex-row"
            >
              <PrimaryButton to={primaryTo}>
                <Play className="h-4 w-4 fill-current" />
                {primaryLabel}
                <ArrowRight className="flip-rtl h-4 w-4 transition-transform group-hover:translate-x-1" />
              </PrimaryButton>

              <SecondaryButton to={secondaryTo}>
                {secondaryLabel}
              </SecondaryButton>
            </div>

            {/* Feature highlights */}
            <ul
              style={{ animationDelay: "280ms" }}
              className="mt-9 flex animate-rise-in flex-wrap gap-x-6 gap-y-4"
            >
              <li className="flex items-center gap-2 text-sm font-bold text-[#555A77]">
                <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#EDEBFF] text-[#4648A0]">
                  <Globe className="h-4 w-4" />
                </span>
                {t("home.cards.languages.title")}
              </li>

              <li className="flex items-center gap-2 text-sm font-bold text-[#555A77]">
                <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#FFE8EF] text-[#B3324F]">
                  <Heart className="h-4 w-4" />
                </span>
                {t("home.stats.free")}
              </li>

              <li className="flex items-center gap-2 text-sm font-bold text-[#555A77]">
                <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#E1F7EF] text-[#1B7F66]">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                {t("home.stats.ads")}
              </li>
            </ul>
          </div>

          <div
            style={{ animationDelay: "120ms" }}
            className="animate-rise-in py-4"
          >
            <SignInPreview t={t} />
          </div>
        </div>
      </section>

      {/* =====================================================
          02. ALPHABET RAIL
      ===================================================== */}

      <section className="-mx-4 border-y border-[#EAE8F4] bg-[#F8F9FF] py-5 sm:-mx-6 lg:-mx-8">
        <div className="mx-auto flex max-w-[1320px] items-center gap-5 px-4 sm:px-6 lg:px-8">
          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#FFF1B8] text-[#A66A00]">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#30325F]">
                Letter practice
              </p>
              <p className="text-xs text-[#777A91]">Khmer + English</p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="min-w-0 flex-1 overflow-hidden rounded-[4px] border border-white bg-white py-2.5 shadow-[0_8px_24px_-22px_rgba(48,50,95,0.7)]"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            }}
          >
            <div className="marquee-track flex w-max animate-marquee">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="flex shrink-0 items-center gap-2 pe-2"
                >
                  {GLYPHS.map((glyph, index) => (
                    <span
                      key={`${copy}-${index}`}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-[4px] px-2 text-xl font-extrabold leading-none ${
                        [
                          "bg-[#F0EFFF] text-[#8D89DF]",
                          "bg-[#FFF0F4] text-[#D985A2]",
                          "bg-[#FFF6D8] text-[#C08D27]",
                          "bg-[#E8F8F1] text-[#67A98E]",
                        ][index % 4]
                      }`}
                    >
                      {glyph}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          03. FEATURED SUBJECTS
      ===================================================== */}

      <Reveal>
        <section>
          <SectionHeader
            emoji={Palette}
            label={t("home.featured")}
            title={t("home.featured_subjects")}
            description={t("home.featured_desc")}
            action={
              <Link
                to="/subjects"
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-[4px] px-4 text-sm font-extrabold text-[#4648A0] transition hover:bg-[#F0EFFF] ${focusRing}`}
              >
                {t("home.view_all")}
                <ArrowRight className="flip-rtl h-4 w-4" />
              </Link>
            }
          />

          {subjects.length === 0 ? (
            <div className="rounded-[4px] border-2 border-dashed border-[#E4E1F3] bg-[#FAF9FF] px-5 py-12 text-center">
              <LibraryBig className="mx-auto h-9 w-9 text-[#4648A0]" />
              <p className="mt-3 text-sm font-semibold text-[#777B96]">
                {t("home.empty_subjects")}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject, index) => (
                <SubjectCard
                  key={subject.id}
                  href={`/courses/${subject.id}`}
                  cover={COVERS[index % COVERS.length]}
                  title={text(subject.title)}
                  description={text(subject.description)}
                  actionLabel={t("home.open_subject")}
                />
              ))}
            </div>
          )}
        </section>
      </Reveal>

      {/* =====================================================
          04. LEARNING FEATURES
      ===================================================== */}

      <Reveal>
        <section>
          <SectionHeader
            emoji={Sparkles}
            label="Made for growing minds"
            title="Everything children need to keep learning"
            description="A calm, playful space for practice at home, in class, or anywhere curiosity takes them."
          />

          <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
            <Link
              to="/subjects"
              className="group relative min-h-[230px] overflow-hidden rounded-[4px] bg-[#2B2D4F] p-6 text-white transition hover:-translate-y-1 hover:shadow-[0_18px_35px_-24px_rgba(43,45,79,0.8)] lg:col-span-2"
            >
              <BookOpen className="h-8 w-8 text-[#FFD75E]" />
              <h3 className="mt-8 max-w-sm text-2xl font-black">Learn at your own pace</h3>
              <p className="mt-2 max-w-md text-sm leading-7 text-white/70">
                Explore lessons and subjects that turn small steps into confident progress.
              </p>
              <ArrowRight className="absolute bottom-6 end-6 h-5 w-5 text-[#FFD75E] transition group-hover:translate-x-1" />
              <div className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full border-[24px] border-white/[0.06]" />
            </Link>

            <Link
              to="/videos"
              className="group min-h-[230px] rounded-[4px] border border-[#E6E4F3] bg-[#EDEBFF] p-6 text-[#4648A0] transition hover:-translate-y-1 hover:shadow-[0_18px_35px_-24px_rgba(70,72,160,0.45)]"
            >
              <Video className="h-8 w-8" />
              <h3 className="mt-8 text-xl font-black">Watch and discover</h3>
              <p className="mt-2 text-sm leading-7 text-[#666B85]">
                Short videos make new ideas easier to understand and remember.
              </p>
            </Link>

            <div className="min-h-[210px] rounded-[4px] border border-[#E6E8F4] bg-white p-6 shadow-[0_14px_32px_-28px_rgba(48,50,95,0.6)]">
              <ShieldCheck className="h-8 w-8 text-[#1B9A75]" />
              <h3 className="mt-7 text-xl font-black text-[#2B2D4F]">A safer place to learn</h3>
              <p className="mt-2 text-sm leading-7 text-[#777A91]">
                Child-friendly content with privacy at the center.
              </p>
            </div>

            <Link
              to={primaryTo}
              className="group min-h-[210px] rounded-[4px] bg-[#E1F7EF] p-6 text-[#16785D] transition hover:-translate-y-1 hover:shadow-[0_18px_35px_-24px_rgba(27,154,117,0.45)]"
            >
              <Trophy className="h-8 w-8" />
              <h3 className="mt-7 text-xl font-black">Celebrate progress</h3>
              <p className="mt-2 text-sm leading-7 text-[#567A70]">
                Every completed activity is a reason to feel proud.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black">
                Keep going <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </section>
      </Reveal>

      {/* =====================================================
          05. LEARNING PATH
      ===================================================== */}

      <Reveal>
        <section className="relative overflow-hidden rounded-[4px] border border-[#E6E4F3] bg-white px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#FFF4D9]" />
          <div className="relative">
            <SectionHeader
              emoji={Route}
              label="Your learning path"
              title="One small step at a time"
              description="Pick a subject, practice a little, and watch your confidence grow."
            />

            <div className="grid gap-3 md:grid-cols-4 md:gap-0">
              {[
                { number: "01", title: "Choose", text: "Find a subject you enjoy.", icon: Compass, color: "bg-[#EDEBFF] text-[#4648A0]" },
                { number: "02", title: "Explore", text: "Learn with a clear lesson.", icon: BookOpen, color: "bg-[#FFF4D9] text-[#A66A00]" },
                { number: "03", title: "Practice", text: "Try a quiz or activity.", icon: PencilLine, color: "bg-[#E1F7EF] text-[#16785D]" },
                { number: "04", title: "Celebrate", text: "See your progress grow.", icon: PartyPopper, color: "bg-[#FFE8EF] text-[#B3324F]" },
              ].map((item, index, path) => {
                const Icon = item.icon;
                return (
                  <div key={item.number} className="relative flex gap-4 md:block md:px-4 md:first:ps-0 md:last:pe-0">
                    {index < path.length - 1 && (
                      <span className="absolute start-5 top-14 hidden h-px w-[calc(100%-1.5rem)] border-t-2 border-dashed border-[#DCD7FF] md:start-1/2 md:block md:w-full" />
                    )}
                    <div className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="relative z-10 md:mt-5">
                      <span className="text-[11px] font-black tracking-[0.16em] text-[#A2A4B8]">{item.number}</span>
                      <h3 className="mt-1 text-base font-black text-[#2B2D4F]">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#777A91]">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* =====================================================
          06. HOW IT WORKS
      ===================================================== */}

      <Reveal>
        <section className="relative overflow-hidden rounded-[4px] bg-[#F2F0FF] px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-12 h-40 w-40 rounded-[4px] bg-[#DCD7FF] opacity-60"
          />

          <div className="relative">
            <SectionHeader
              emoji={Rocket}
              label={t("home.how_works")}
              title={t("home.how_works_title")}
            />

            <ol
              ref={stepsRef}
              className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >
              {steps.map((step, index) => (
                <li key={step.step} className="relative">
                  {index < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      style={{ transitionDelay: `${index * 140}ms` }}
                      className={`absolute top-7 start-[3.5rem] end-[-2rem] hidden border-t-2 border-dashed border-[#BEB8EF] transition-transform duration-700 lg:block ${
                        stepsInView ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  )}

                  <span className="relative flex h-14 w-14 items-center justify-center rounded-[4px] border-4 border-white bg-[#4648A0] text-xl font-black text-white shadow-md">
                    {step.step}
                  </span>

                  <h3 className="mt-5 text-base font-extrabold text-[#2B2D4F]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-[#6B6F89]">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </Reveal>

      {/* =====================================================
          07. RECENT LESSONS
      ===================================================== */}

      <Reveal>
        <section>
          <SectionHeader
            emoji={BookOpen}
            label={t("home.recent")}
            title={t("home.recent_lessons")}
          />

          {lessons.length === 0 ? (
            <div className="rounded-[4px] border-2 border-dashed border-[#E4E1F3] bg-[#FAF9FF] px-5 py-12 text-center">
              <Sprout className="mx-auto h-9 w-9 text-[#1B7F66]" />
              <p className="mt-3 text-sm font-semibold text-[#777B96]">
                {t("home.empty_lessons")}
              </p>
            </div>
          ) : (
            <ul className="overflow-hidden rounded-[4px] border border-[#ECEBF5] bg-white">
              {lessons.map((lesson, index) => {
                const isVideo = lesson.type === "video";

                return (
                  <li
                    key={lesson.id}
                    className="border-b border-[#F0EFF6] last:border-b-0"
                  >
                    <Link
                      to={`/lesson/${lesson.id}`}
                      className={`group flex items-center gap-4 px-4 py-5 transition hover:bg-[#FAF9FF] sm:px-6 ${focusRing}`}
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] transition group-hover:scale-105 ${
                          isVideo
                            ? "bg-[#FFE8EF] text-[#B3324F]"
                            : "bg-[#EDEBFF] text-[#4648A0]"
                        }`}
                      >
                        {isVideo ? (
                          <Play className="h-5 w-5 fill-current" />
                        ) : (
                          <BookOpen className="h-5 w-5" />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="mb-1 flex items-center gap-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#9699B2]">
                            {isVideo ? t("home.video") : t("home.reading")}
                          </span>

                          <span className="h-1 w-1 rounded-[4px] bg-[#D5D4E2]" />

                          <span className="text-[11px] font-semibold text-[#B2B4C5]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </span>

                        <span className="block truncate text-[15px] font-extrabold text-[#2B2D4F] transition group-hover:text-[#4648A0]">
                          {text(lesson.title)}
                        </span>
                      </span>

                      <span className="ms-auto flex shrink-0 items-center gap-2 text-sm font-extrabold text-[#4648A0]">
                        <span className="hidden sm:inline">
                          {t("home.start")}
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#F0EFFF] transition group-hover:bg-[#4648A0] group-hover:text-white">
                          <ArrowRight className="flip-rtl h-4 w-4" />
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </Reveal>

      {/* =====================================================
          08. TESTIMONIALS
      ===================================================== */}

      <Reveal>
        <section>
          <SectionHeader
            emoji={Heart}
            label={t("home.testimonials.title")}
            title={t("home.testimonials.subtitle")}
          />

          <div className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8">
            <div className="group flex overflow-hidden px-4 py-2 sm:px-6 lg:px-8">
              <div className="flex w-max shrink-0 gap-4 animate-marquee group-hover:[animation-play-state:paused] sm:gap-5">
                {[0, 1, 2, 3].map((setIndex) =>
                  [
                    {
                      name: "Ms. Sreynith",
                      role: t("home.testimonials.teacher_role"),
                      quote: t("home.testimonials.teacher_quote"),
                      image: "/asset/images/user2.png",
                    },
                    {
                      name: "Mr. Somchai",
                      role: t("home.testimonials.parent_role"),
                      quote: t("home.testimonials.parent_quote"),
                      image: "/asset/images/user.png",
                    },
                    {
                      name: "Mr. Dara",
                      role: t("home.testimonials.teacher2_role"),
                      quote: t("home.testimonials.teacher2_quote"),
                      image: null,
                    },
                  ].map((item, index) => (
                    <div
                      key={`${setIndex}-${item.name}`}
                      className="w-[280px] shrink-0 sm:w-[320px]"
                    >
                      <TestimonialCard item={item} index={index} />
                    </div>
                  )),
                )}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-20 bg-gradient-to-r from-[#F8F9FF] to-transparent sm:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-20 bg-gradient-to-l from-[#F8F9FF] to-transparent sm:block" />
          </div>
        </section>
      </Reveal>

      {/* =====================================================
          09. INTERACTIVE QUIZ
      ===================================================== */}

      {questions.length > 0 && (
        <Reveal>
          <section className="relative overflow-hidden rounded-[4px] bg-[#2B2D4F] px-5 py-10 text-white sm:px-9 sm:py-12 lg:px-12">
            {/* Decorative circles */}
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-64 w-64 rounded-[4px] border-[35px] border-white/[0.04]"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-16 -left-16 h-48 w-48 rounded-[4px] bg-[#4648A0]/40 blur-2xl"
            />

            <div className="relative grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-[4px] bg-[#FFD75E]/15 px-4 py-2 text-xs font-extrabold text-[#FFD75E]">
                  <Lightbulb className="h-4 w-4" />
                  {t("home.quiz_demo.label")}
                </div>

                <h2 className="text-balance text-3xl font-black leading-tight sm:text-4xl">
                  {t("home.quiz_demo.title")}
                  <span className="ms-2 text-[#FFD75E]">✦</span>
                </h2>

                <p className="mt-4 text-[15px] leading-8 text-white/70">
                  {t("home.quiz_demo.desc")}
                </p>

                <p className="mt-6 flex items-start gap-3 rounded-[4px] bg-white/[0.06] p-4 text-sm leading-7 text-white/70">
                  <ShieldCheck
                    aria-hidden="true"
                    className="mt-1 h-5 w-5 shrink-0 text-[#5CC8AF]"
                  />
                  {t("home.quiz_demo.note")}
                </p>

                <div className="mt-6 flex items-center gap-3 text-sm font-bold text-[#FFD75E]">
                  <PartyPopper className="h-5 w-5" />
                  <span>{t("home.quiz_demo.label")}</span>
                </div>
              </div>

              <QuizDemo t={t} text={text} questions={questions} />
            </div>
          </section>
        </Reveal>
      )}

      {/* =====================================================
          10. PRIVACY AND FAQ
      ===================================================== */}

      <Reveal>
        <section className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Privacy */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-[4px] bg-[#E1F7EF] px-3 py-1.5 text-xs font-extrabold text-[#16785D]">
              <ShieldCheck className="h-4 w-4" />
              {t("home.privacy.title")}
            </div>

            <h2 className="text-2xl font-black leading-tight text-[#2B2D4F] sm:text-3xl">
              {t("home.privacy.title")}
            </h2>

            <ul className="mt-6 divide-y divide-[#ECEBF5] rounded-[4px] border border-[#ECEBF5] bg-white px-5">
              {promises.map((promise, index) => (
                <li key={index} className="flex gap-3 py-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-[#E1F7EF]">
                    <Check
                      aria-hidden="true"
                      strokeWidth={3}
                      className="h-4 w-4 text-[#16785D]"
                    />
                  </span>

                  <span className="text-sm leading-7 text-[#555A77]">
                    {promise}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              to="/about"
              className={`mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-extrabold text-[#4648A0] hover:underline ${focusRing}`}
            >
              {t("home.privacy.link")}
              <ArrowRight className="flip-rtl h-4 w-4" />
            </Link>
          </div>

          {/* FAQ */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-[4px] bg-[#FFF4D9] px-3 py-1.5 text-xs font-extrabold text-[#986A0B]">
              <Lightbulb className="h-4 w-4" />
              {t("home.faqs.title")}
            </div>

            <h2 className="text-2xl font-black leading-tight text-[#2B2D4F] sm:text-3xl">
              {t("home.faqs.title")}
            </h2>

            <div className="mt-6 space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-[4px] border border-[#ECEBF5] bg-white px-5 transition open:border-[#DCD7FF] open:bg-[#FAF9FF]"
                >
                  <summary
                    className={`flex min-h-[66px] cursor-pointer list-none items-center justify-between gap-4 text-sm font-extrabold text-[#2B2D4F] [&::-webkit-details-marker]:hidden ${focusRing}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#F0EFFF] text-xs font-black text-[#4648A0]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {faq.question}
                    </span>

                    <ChevronDown
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-[#4648A0] transition-transform duration-300 group-open:rotate-180"
                    />
                  </summary>

                  <p className="pb-5 ps-11 text-sm leading-7 text-[#737793]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* =====================================================
          09. FINAL CALL TO ACTION
      ===================================================== */}

      <Reveal>
        <section className="relative overflow-hidden rounded-[4px] bg-[#FFD75E] px-6 py-11 sm:px-10 sm:py-14 lg:px-14">
          {/* Decorative shapes */}
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-12 h-44 w-44 rounded-[4px] border-[24px] border-[#F6C746] opacity-70"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-12 right-1/3 h-32 w-32 rounded-[4px] bg-[#FFEA9E] opacity-70"
          />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-[4px] bg-white/50 px-4 py-2 text-xs font-extrabold text-[#796018]">
                <GraduationCap className="h-4 w-4" />
                LITTLE LEARNER
              </div>

              <h2 className="text-balance text-3xl font-black leading-tight text-[#2B2D4F] sm:text-4xl lg:text-[2.8rem]">
                {t("home.cta_title")}
              </h2>

              <p className="mt-4 max-w-lg text-[15px] leading-8 text-[#65572D]">
                {t("home.cta_desc")}
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                to={primaryTo}
                className={`inline-flex min-h-[54px] items-center justify-center gap-2 rounded-[4px] bg-[#2B2D4F] px-7 py-4 text-sm font-extrabold text-white shadow-[0_6px_0_#191A37] transition hover:-translate-y-1 hover:bg-[#4648A0] hover:shadow-[0_8px_0_#191A37] ${focusRing}`}
              >
                {primaryLabel}
                <ArrowRight className="flip-rtl h-5 w-5" />
              </Link>

              <Link
                to={secondaryTo}
                className={`inline-flex min-h-[54px] items-center justify-center rounded-[4px] border-2 border-[#2B2D4F]/25 bg-white/40 px-7 py-4 text-sm font-extrabold text-[#2B2D4F] transition hover:border-[#2B2D4F]/50 hover:bg-white/70 ${focusRing}`}
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
