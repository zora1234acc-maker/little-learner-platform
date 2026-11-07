import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { QrCode, Pin, Image, Lock, AlertTriangle } from "lucide-react";

export function Login() {
  const { t } = useTranslation();
  const { login, tokenLogin, hasRole } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("password"); // password | pin | qr | picture
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
        else if (user.role === "teacher") navigate("/teacher");
        else if (user.role === "parent") navigate("/parent");
        else navigate("/student");
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
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-blueberry flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">📚</span>
          </div>
          <h2 className="text-2xl font-bold text-blueberry">{t("auth.login_title")}</h2>
          <p className="text-sm text-muted-foreground">{t("auth.no_typing")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-bubblegum/10 p-4 border border-bubblegum/50 text-bubblegum-700 flex items-center gap-3 text-sm">
              <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t("common.login")}</label>
            <div className="flex gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m.id ? "bg-blueberry text-white" : "border border-border bg-background hover:bg-accent"}`}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          {mode === "password" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blueberry focus:border-transparent outline-none"
                  placeholder="teacher@littlelearner.example"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blueberry focus:border-transparent outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          )}

          {(mode === "pin" || mode === "qr") && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{mode === "pin" ? "PIN Code" : "QR Code / Token"}</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blueberry focus:border-transparent outline-none text-center tracking-widest font-mono text-lg"
                placeholder="1234"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <p className="text-xs text-muted-foreground text-center">Ask your teacher or admin for your QR/PIN card</p>
            </div>
          )}

          {mode === "picture" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Choose Your Picture</label>
              <div className="grid grid-cols-4 gap-2">
                {["bear", "cat", "dog", "lion"].map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => {
                      setPin(avatar);
                      handleLogin({ preventDefault: () => {} });
                    }}
                    className={`aspect-square rounded-xl border transition-all ${pin === avatar ? "border-blueberry bg-blueberry/10" : "border-border hover:bg-accent/50"}`}
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
            className="w-full py-3 rounded-lg bg-blueberry text-white font-semibold hover:bg-blueberry/90 transition-colors disabled:opacity-50"
          >
            {t("common.submit")}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          {t("common.login")} • Little Learner
        </div>
      </div>
    </div>
  );
}
