import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useRegister } from "@workspace/api-client-react";
import type { AuthResponse } from "@workspace/api-client-react";
import type { ErrorType } from "@workspace/api-client-react";
import { useAuth, storeToken } from "@/lib/auth-context";
import { Eye, EyeOff, Loader2, Lock, Mail, User, Phone, CheckCircle2, XCircle } from "lucide-react";

interface ApiErrorData {
  error?: string;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"] as const;
const STRENGTH_COLORS = ["bg-red-400", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"] as const;

function getPasswordStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return { score, label: STRENGTH_LABELS[score] };
}

export default function Register() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { refetch } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const registerMutation = useRegister<ErrorType<ApiErrorData>>({
    mutation: {
      onSuccess: (data: AuthResponse) => {
        if (data?.accessToken) {
          storeToken(data.accessToken, false);
        }
        refetch();
        setLocation("/cabinet");
      },
      onError: (err: ErrorType<ApiErrorData>) => {
        setError(err?.data?.error ?? t("common.error"));
      },
    },
  });

  const updateForm = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
    setTouched(prev => ({ ...prev, [key]: true }));
  };

  const markTouched = (key: string) => () => setTouched(prev => ({ ...prev, [key]: true }));

  const { score } = getPasswordStrength(form.password);

  const strengthLabels = [
    "",
    t("auth.register.passwordStrengthWeak"),
    t("auth.register.passwordStrengthFair"),
    t("auth.register.passwordStrengthGood"),
    t("auth.register.passwordStrengthStrong"),
    t("auth.register.passwordStrengthStrong"),
  ];

  const getFieldError = (key: string): string => {
    if (!touched[key]) return "";
    if (key === "name" && !form.name) return t("auth.register.errorRequired").split(",")[0];
    if (key === "email" && !form.email) return t("auth.register.errorRequired");
    if (key === "password" && form.password.length > 0 && form.password.length < 8) return t("auth.register.errorPasswordShort");
    if (key === "confirmPassword" && form.confirmPassword && form.password !== form.confirmPassword) return t("auth.register.errorPasswordMismatch");
    return "";
  };

  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (!form.name || !form.email || !form.password) {
      setError(t("auth.register.errorRequired"));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t("auth.register.errorPasswordMismatch"));
      return;
    }
    if (form.password.length < 8) {
      setError(t("auth.register.errorPasswordShort"));
      return;
    }
    registerMutation.mutate({
      data: {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      },
    });
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
          <h1 className="text-3xl font-bold text-foreground">{t("auth.register.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.register.subtitle")}</p>
        </div>

        <div className="bg-card border border-border rounded-3xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {t("auth.register.name")} *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.name}
                  onChange={updateForm("name")}
                  onBlur={markTouched("name")}
                  placeholder={t("auth.register.namePlaceholder")}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm ${
                    getFieldError("name") ? "border-red-400" : "border-border"
                  }`}
                  disabled={registerMutation.isPending}
                />
              </div>
              {getFieldError("name") && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {getFieldError("name")}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {t("auth.register.email")} *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={updateForm("email")}
                  onBlur={markTouched("email")}
                  placeholder="sizning@email.com"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm ${
                    getFieldError("email") ? "border-red-400" : "border-border"
                  }`}
                  disabled={registerMutation.isPending}
                  autoComplete="email"
                />
              </div>
              {getFieldError("email") && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {getFieldError("email")}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {t("auth.register.phone")}
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={updateForm("phone")}
                  placeholder={t("auth.register.phonePlaceholder")}
                  className="w-full pl-11 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                  disabled={registerMutation.isPending}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {t("auth.register.password")} *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={updateForm("password")}
                  onBlur={markTouched("password")}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm ${
                    getFieldError("password") ? "border-red-400" : "border-border"
                  }`}
                  disabled={registerMutation.isPending}
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
              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5">
                    {[0, 1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          i < score ? STRENGTH_COLORS[score] : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 font-medium ${
                    score <= 1 ? "text-red-500" : score <= 2 ? "text-orange-500" : score <= 3 ? "text-yellow-600" : "text-green-600"
                  }`}>
                    {strengthLabels[score]}
                  </p>
                </div>
              )}
              {getFieldError("password") && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {getFieldError("password")}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {t("auth.register.confirmPassword")} *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={updateForm("confirmPassword")}
                  onBlur={markTouched("confirmPassword")}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm ${
                    getFieldError("confirmPassword") ? "border-red-400" : passwordsMatch ? "border-green-400" : "border-border"
                  }`}
                  disabled={registerMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {getFieldError("confirmPassword") ? (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {getFieldError("confirmPassword")}
                </p>
              ) : passwordsMatch ? (
                <p className="text-green-600 text-xs mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Parollar mos
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("auth.register.submitting")}
                </>
              ) : (
                t("auth.register.submit")
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.register.hasAccount")}{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              {t("auth.register.login")}
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link href="/" className="hover:text-primary transition-colors">
            {t("auth.register.backHome")}
          </Link>
        </p>
      </div>
    </main>
  );
}
