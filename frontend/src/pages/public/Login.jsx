import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/api/client";
import { Avatar } from "@/components/Avatar";
import { QrCode, KeyRound, Image as ImageIcon, Lock, AlertTriangle, ShieldCheck, BookOpen } from "lucide-react";

const modes = [
  { id: "password", labelKey: "auth.login_title", icon: Lock },
  { id: "pin", labelKey: "auth.pin_login", icon: KeyRound },
  { id: "qr", labelKey: "auth.qr_login", icon: QrCode },
  { id: "picture", labelKey: "auth.picture_login", icon: ImageIcon },
];

const demoAccounts = [
  { role: "Admin", email: "admin@littlelearner.example" },
  { role: "Teacher", email: "teacher@littlelearner.example" },
  { role: "Student", email: "student1@littlelearner.example", pin: "1234" },
  { role: "Parent", email: "parent1@littlelearner.example" },
];

const routeFor = (user) => {
  if (user?.role === "admin") return "/admin";
  if (user?.role === "teacher") return "/teacher/library";
  if (user?.role === "parent") return "/parent";
  return "/student/todo";
};

export function Login() {
  const { t } = useTranslation();
  const { login, tokenLogin, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.users
      .list()
      .then((result) =>
        setStudents(result.data.filter((item) => item.role === "student" && item.is_active))
      )
      .catch(() => setStudents([]));
  }, []);

  // If a signed-in user opens /login, send them to their dashboard.
  useEffect(() => {
    if (user) navigate(routeFor(user), { replace: true });
  }, [user, navigate]);

  const finish = (signedInUser) => {
    if (signedInUser) navigate(routeFor(signedInUser), { replace: true });
  };

  const run = async (action) => {
    setError("");
    setBusy(true);
    try {
      const result = await action();
      finish(result?.user);
    } catch (err) {
      setError(
        err?.response?.data?.error?.message ||
          "We could not sign you in. Check the details and try again."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === "password") {
      run(() => login({ email, password: password || "demo" }));
    } else {
      run(() => tokenLogin(pin));
    }
  };

  const loginWithPicture = (student) => {
    setPin(student.login_pin || "");
    run(() => tokenLogin(student.id));
  };

  const loginDemo = (account) => {
    if (account.pin) {
      setMode("pin");
      setPin(account.pin);
      run(() => tokenLogin(account.pin));
      return;
    }
    setMode("password");
    setEmail(account.email);
    setPassword("demo");
    run(() => login({ email: account.email, password: "demo" }));
  };

  return (
    <div className="relative mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center overflow-hidden px-0 py-4 sm:py-8">
      <div className="pointer-events-none absolute -left-20 top-8 h-64 w-64 rounded-full bg-[#514BFF]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#FFD75E]/[0.16] blur-3xl" />

      <div className="relative grid w-full gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
        <div className="rounded-[2rem] border border-[#E6E8F4] bg-white p-5 shadow-[0_24px_70px_-42px_rgba(48,50,95,0.5)] sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#514BFF] text-white shadow-[0_6px_0_#353780]">
              <BookOpen className="h-6 w-6" />
            </span>
            <div>
              <p className="mb-0.5 text-xs font-bold uppercase tracking-[0.14em] text-[#777A91]">
                Welcome back
              </p>
              <h1 className="text-2xl font-black text-[#30325F]">{t("auth.login_title")}</h1>
              <p className="text-sm text-[#777A91]">{t("auth.no_typing")}</p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {modes.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMode(item.id);
                    setError("");
                  }}
                  className={`flex min-h-[68px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 py-2 text-[11px] font-bold transition ${
                    mode === item.id
                    ? "border-[#514BFF] bg-[#514BFF] text-white shadow-[0_5px_0_#353780]"
                    : "border-[#E6E8F4] bg-[#F8F9FF] text-[#777A91] hover:border-[#C8C5F2] hover:bg-[#F0EFFF] hover:text-[#514BFF]"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                  {t(item.labelKey)}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? (
              <div className="flex items-start gap-2 rounded-2xl border border-[#F3B1C5] bg-[#FFF4F7] px-4 py-3 text-sm text-[#B74468]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </div>
            ) : null}

            {mode === "password" ? (
              <>
                <div>
                  <label className="field-label">Email</label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    placeholder="teacher@littlelearner.example"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">Password</label>
                  <input
                    type="password"
                    required
                    className="input-field"
                    placeholder="Any password works in the demo"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
              </>
            ) : null}

            {mode === "pin" || mode === "qr" ? (
              <div>
                <label className="field-label">
                  {mode === "pin" ? "PIN code" : "QR code / token"}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  className="input-field text-center font-mono text-lg tracking-[0.4em]"
                  placeholder="1234"
                  value={pin}
                  onChange={(event) => setPin(event.target.value)}
                />
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Ask your teacher for your printed card. Student PINs: 1234, 5678, 2468.
                </p>
              </div>
            ) : null}

            {mode === "picture" ? (
              <div>
                <label className="field-label">Choose your picture</label>
                <div className="grid grid-cols-3 gap-3">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => loginWithPicture(student)}
                      className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-3 transition hover:border-blueberry hover:bg-blueberry/5"
                    >
                      <Avatar src={student.avatar_url} name={student.avatar} size="xl" />
                      <span className="w-full truncate text-center text-xs font-bold text-foreground">
                        {student.full_name}
                      </span>
                    </button>
                  ))}
                </div>
                {students.length === 0 ? (
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    No student pictures available yet.
                  </p>
                ) : null}
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Tap your picture to sign in — no typing needed.
                </p>
              </div>
            ) : null}

            {mode === "password" || mode === "pin" || mode === "qr" ? (
              <button type="submit" disabled={busy} className="btn-primary w-full">
                {busy ? "Signing in..." : t("common.submit")}
              </button>
            ) : null}
          </form>
        </div>

        <aside className="rounded-[2rem] border border-[#E6E8F4] bg-[#F8F9FF] p-5 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#777A91]">
                Explore the platform
              </p>
              <h2 className="flex items-center gap-2 text-2xl font-black text-[#30325F]">
                <ShieldCheck className="h-6 w-6 text-[#1B7F66]" /> Demo accounts
              </h2>
            </div>
            <span className="hidden rounded-full bg-[#E3F7F1] px-3 py-1 text-xs font-bold text-[#1B7F66] sm:inline-flex">
              Ready to try
            </span>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#777A91]">
            One tap signs you in. Any non-empty password works for these seeded accounts.
          </p>

          <div className="mt-5 grid gap-3">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => loginDemo(account)}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[#E6E8F4] bg-white px-4 py-3.5 text-left shadow-[0_8px_24px_-22px_rgba(48,50,95,0.6)] transition hover:-translate-y-0.5 hover:border-[#C8C5F2] hover:shadow-[0_14px_28px_-22px_rgba(48,50,95,0.6)]"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-[#30325F]">{account.role}</span>
                  <span className="block truncate text-xs text-[#777A91]">{account.email}</span>
                </span>
                <span className="shrink-0 rounded-full bg-[#EEF0FF] px-3 py-1.5 text-[11px] font-bold text-[#514BFF] transition group-hover:bg-[#514BFF] group-hover:text-white">
                  Sign in
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[#DDE1F5] bg-white p-4 text-xs leading-6 text-[#777A91]">
            <p className="font-bold text-[#30325F]">Student PINs</p>
            <p>Sophal 1234 · Sophea 5678 · Dara 2468</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
