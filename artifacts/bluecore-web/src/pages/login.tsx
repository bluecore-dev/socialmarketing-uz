import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useLogin } from "@workspace/api-client-react";
import type { AuthResponse } from "@workspace/api-client-react";
import type { ErrorType } from "@workspace/api-client-react";
import { useAuth, storeToken } from "@/lib/auth-context";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

interface ApiErrorData {
  error?: string;
}

export default function Login() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { refetch } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = useLogin<ErrorType<ApiErrorData>>({
    mutation: {
      onSuccess: (data: AuthResponse) => {
        if (data?.accessToken) {
          storeToken(data.accessToken, rememberMe);
        }
        refetch();
        setLocation("/cabinet");
      },
      onError: (err: ErrorType<ApiErrorData>) => {
        setError(err?.data?.error ?? t("auth.login.errorInvalid"));
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError(t("auth.login.errorRequired"));
      return;
    }
    loginMutation.mutate({ data: { email, password } });
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
          <h1 className="text-3xl font-bold text-foreground">{t("auth.login.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.login.subtitle")}</p>
        </div>

        <div className="bg-card border border-border rounded-3xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t("auth.login.email")}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="sizning@email.com"
                  className="w-full pl-11 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                  disabled={loginMutation.isPending}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-foreground">{t("auth.login.password")}</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                  disabled={loginMutation.isPending}
                  autoComplete="current-password"
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer select-none">
                {t("auth.login.rememberMe")}
              </label>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("auth.login.submitting")}
                </>
              ) : (
                t("auth.login.submit")
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.login.noAccount")}{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              {t("auth.login.register")}
            </Link>
          </div>
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
