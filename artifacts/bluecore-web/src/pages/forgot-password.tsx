import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useForgotPassword } from "@workspace/api-client-react";
import type { ErrorType } from "@workspace/api-client-react";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";

interface ApiErrorData {
  error?: string;
}

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const forgotMutation = useForgotPassword<ErrorType<ApiErrorData>>({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
      },
      onError: (err: ErrorType<ApiErrorData>) => {
        setError(err?.data?.error ?? t("common.error"));
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError(t("auth.forgotPassword.noEmail"));
      return;
    }
    forgotMutation.mutate({ data: { email } });
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
          <h1 className="text-3xl font-bold text-foreground">{t("auth.forgotPassword.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.forgotPassword.subtitle")}</p>
        </div>

        <div className="bg-card border border-border rounded-3xl shadow-xl p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">{t("auth.forgotPassword.successTitle")}</h2>
              <p className="text-muted-foreground text-sm mb-6">{t("auth.forgotPassword.successMessage")}</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm"
              >
                {t("auth.forgotPassword.backToLogin")}
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {t("auth.forgotPassword.email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="sizning@email.com"
                      className="w-full pl-11 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                      disabled={forgotMutation.isPending}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotMutation.isPending}
                  className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {forgotMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("auth.forgotPassword.submitting")}
                    </>
                  ) : (
                    t("auth.forgotPassword.submit")
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
