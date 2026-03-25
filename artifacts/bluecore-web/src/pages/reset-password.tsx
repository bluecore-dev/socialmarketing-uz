import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useResetPassword } from "@workspace/api-client-react";
import type { ErrorType } from "@workspace/api-client-react";
import { Eye, EyeOff, Loader2, Lock, CheckCircle2 } from "lucide-react";

interface ApiErrorData {
  error?: string;
}

export default function ResetPassword() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const params = new URLSearchParams(location.includes("?") ? location.split("?")[1] : "");
  const token = params.get("token") || new URLSearchParams(window.location.search).get("token") || "";

  const resetMutation = useResetPassword<ErrorType<ApiErrorData>>({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
      },
      onError: (err: ErrorType<ApiErrorData>) => {
        setError(err?.data?.error ?? t("auth.resetPassword.invalidToken"));
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError(t("auth.resetPassword.errorMismatch"));
      return;
    }
    if (password.length < 8) {
      setError(t("auth.resetPassword.errorShort"));
      return;
    }
    if (!token) {
      setError(t("auth.resetPassword.invalidToken"));
      return;
    }
    resetMutation.mutate({ data: { token, password } });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background pt-20 pb-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/">
            <span className="inline-flex items-center gap-2 text-2xl font-black text-primary mb-6 cursor-pointer">
              <span className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-lg">B</span>
              BlueCore
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{t("auth.resetPassword.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.resetPassword.subtitle")}</p>
        </div>

        <div className="bg-card border border-border rounded-3xl shadow-xl p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">{t("auth.resetPassword.successTitle")}</h2>
              <p className="text-muted-foreground text-sm mb-6">{t("auth.resetPassword.successMessage")}</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm"
              >
                {t("auth.resetPassword.goToLogin")}
              </Link>
            </div>
          ) : (
            <>
              {!token && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                  {t("auth.resetPassword.invalidToken")}
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {t("auth.resetPassword.password")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                      disabled={resetMutation.isPending || !token}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {t("auth.resetPassword.confirmPassword")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm ${
                        confirmPassword && password !== confirmPassword ? "border-red-400" : "border-border"
                      }`}
                      disabled={resetMutation.isPending || !token}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetMutation.isPending || !token}
                  className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {resetMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("auth.resetPassword.submitting")}
                    </>
                  ) : (
                    t("auth.resetPassword.submit")
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  {t("auth.forgotPassword.backToLogin")}
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link href="/" className="hover:text-primary transition-colors">
            {t("auth.login.backHome")}
          </Link>
        </p>
      </div>
    </main>
  );
}
