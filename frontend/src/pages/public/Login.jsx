import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { QrCode, Pin, Image, Lock, AlertTriangle } from "lucide-react";
import { SectionDivider } from "@/components/SectionDivider";

export function Login() {
  const { t } = useTranslation();
  const { login, tokenLogin } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "password") {
        await login({ email, password });
      } else {
        await tokenLogin(pin || email);
      }
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (user) {
        if (user.role === "admin") navigate("/admin");
        else if (user.role === "teacher") navigate("/teacher/library");
        else if (user.role === "parent") navigate("/parent");
        else navigate("/student/todo");
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || t("common.error"));
    }
  };

  const modes = [
    { id: "password", label: t("common.login"), icon: <Lock className="w-5 h-5" /> },
    { id: "pin", label: t("auth.pin_login"), icon: <Pin className="w-5 h-5" /> },
    { id: "qr", label: t("auth.qr_login"), icon: <QrCode className="w-5 h-5" /> },
    { id: "picture", label: t("auth.picture_login"), icon: <Image className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-10">
        <div className="text-left">
          <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-blueberry flex items-center justify-center mb-6">
            <span className="text-white text-2xl">📚</span>
          </div>
          <h2 className="text-3xl font-black text-blueberry">{t("auth.login_title")}</h2>
          <p className="text-muted-foreground mt-3">{t("auth.no_typing")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="rounded-[var(--radius-lg)] bg-bubblegum/10 p-5 border border-bubblegum/50 text-bubblegum-700 flex items-start gap-3 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <div className="space-y-3">
            <label className="field-label">{t("common.login")}</label>
            <div className="flex gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex-1 px-5 py-2.5 rounded-[var(--radius-lg)] text-sm font-medium transition-colors ${mode === m.id ? "bg-blueberry text-white border-blueberry" : "border border-border bg-background hover:bg-accent"} touch-target`}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          {mode === "password" && (
            <>
              <div className="space-y-2">
                <label className="field-label">Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="teacher@littlelearner.example"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="field-label">Password</label>
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          )}

          {(mode === "pin" || mode === "qr") && (
            <div className="space-y-2">
              <label className="field-label">{mode === "pin" ? "PIN Code" : "QR Code / Token"}</label>
              <input
                type="text"
                required
                className="w-full px-5 py-3.5 rounded-[var(--radius-lg)] border border-border bg-background text-foreground focus:ring-2 focus:ring-blueberry focus:border-transparent outline-none text-center tracking-widest font-mono text-lg"
                placeholder="1234"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <p className="text-xs text-muted-foreground text-center">Ask your teacher or admin for your QR/PIN card</p>
            </div>
          )}

          {mode === "picture" && (
            <div className="space-y-2">
              <label className="field-label">Choose Your Picture</label>
              <div className="grid grid-cols-4 gap-3">
                {["bear", "cat", "dog", "lion"].map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => {
                      setPin(avatar);
                      handleLogin({ preventDefault: () => {} });
                    }}
                    className={`aspect-square rounded-[var(--radius-lg)] border border-border transition-all ${pin === avatar ? "border-blueberry bg-blueberry/10" : "hover:bg-accent/50"} touch-target`}
                  >
                    {avatar === "bear" ? "🐻" : avatar === "cat" ? "🐱" : avatar === "dog" ? "🐶" : "🦁"}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">Pick your animal avatar to log in</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-primary"
          >
            {t("common.submit")}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Little Learner
        </div>
      </div>
    </div>
  );
}
