import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import {
  useLogout, useGetLeads, useUpdateMe, useChangePassword,
} from "@workspace/api-client-react";
import { useAuth, clearStoredToken } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, LogOut, MessageSquare, BarChart2, Bell, BookMarked,
  Shield, FileText, CheckCircle, Clock, Star, Loader2,
  ChevronRight, XCircle, Eye, EyeOff, AlertTriangle,
} from "lucide-react";

type TabId = "overview" | "leads" | "notifications" | "saved" | "security";

export default function Cabinet() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { user, isLoading, isAuthenticated, refetch } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        clearStoredToken();
        window.location.href = "/";
      },
      onError: () => {
        clearStoredToken();
        window.location.href = "/";
      },
    },
  });

  const leadsQuery = useGetLeads(
    { page: "1", limit: "20" },
    { query: { enabled: isAuthenticated } }
  );
  const leads = (leadsQuery.data as any)?.leads || [];

  const getStatusMeta = (status: string) => {
    const key = `auth.cabinet.status.${status}` as const;
    const label = t(key as any);
    const colors: Record<string, string> = {
      new: "bg-blue-100 text-blue-700",
      reviewing: "bg-yellow-100 text-yellow-700",
      in_progress: "bg-green-100 text-green-700",
      done: "bg-gray-100 text-gray-600",
      rejected: "bg-red-100 text-red-600",
    };
    return { label, color: colors[status] || "bg-gray-100 text-gray-600" };
  };

  const tabs = [
    { id: "overview" as const, label: t("auth.cabinet.tabs.overview"), icon: BarChart2 },
    { id: "leads" as const, label: t("auth.cabinet.tabs.leads"), icon: MessageSquare },
    { id: "notifications" as const, label: t("auth.cabinet.tabs.notifications"), icon: Bell },
    { id: "saved" as const, label: t("auth.cabinet.tabs.saved"), icon: BookMarked },
    { id: "security" as const, label: t("auth.cabinet.tabs.security"), icon: Shield },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logoutMutation.mutate(undefined as unknown as void)}
            disabled={logoutMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            {t("auth.cabinet.logout")}
          </button>
        </div>

        {/* Tabs - scroll on mobile */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 bg-background border border-border rounded-2xl p-1.5 w-fit min-w-full md:min-w-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "overview" && <OverviewTab leads={leads} getStatusMeta={getStatusMeta} t={t} />}
            {activeTab === "leads" && <LeadsTab leads={leads} isLoading={leadsQuery.isLoading} getStatusMeta={getStatusMeta} t={t} />}
            {activeTab === "notifications" && <NotificationsTab t={t} />}
            {activeTab === "saved" && <SavedTab t={t} />}
            {activeTab === "security" && <SecurityTab user={user} refetch={refetch} t={t} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

function OverviewTab({ leads, getStatusMeta, t }: any) {
  const inProgress = leads.filter((l: any) => l.status === "in_progress").length;
  const done = leads.filter((l: any) => l.status === "done").length;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: t("auth.cabinet.overview.applications"), value: leads.length, icon: MessageSquare, color: "bg-blue-50 text-blue-600" },
          { label: t("auth.cabinet.overview.inProgress"), value: inProgress, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
          { label: t("auth.cabinet.overview.completed"), value: done, icon: CheckCircle, color: "bg-green-50 text-green-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          {t("auth.cabinet.overview.recentLeads")}
        </h2>
        {leads.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">{t("auth.cabinet.leads.empty")}</p>
        ) : (
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead: any) => {
              const st = getStatusMeta(lead.status);
              return (
                <div key={lead.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{lead.service || lead.message?.slice(0, 30)}</p>
                    <p className="text-xs text-muted-foreground truncate">{lead.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${st.color}`}>{st.label}</span>
                    <span className="text-xs text-muted-foreground">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ""}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Star className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{t("auth.cabinet.overview.newOrder")}</h3>
            <p className="text-white/80 text-sm">{t("auth.cabinet.overview.newOrderDesc")}</p>
          </div>
          <Link href="/contact" className="shrink-0 px-5 py-2.5 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors text-sm">
            {t("auth.cabinet.overview.orderNow")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function LeadsTab({ leads, isLoading, getStatusMeta, t }: any) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="font-bold text-lg">{t("auth.cabinet.leads.title")}</h2>
        <Link href="/contact" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">
          {t("auth.cabinet.leads.newLead")}
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : leads.length === 0 ? (
        <div className="p-16 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">{t("auth.cabinet.leads.empty")}</p>
          <Link href="/contact" className="mt-4 inline-block text-primary font-semibold hover:underline text-sm">
            {t("auth.cabinet.leads.emptyLink")}
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {leads.map((lead: any) => {
            const st = getStatusMeta(lead.status);
            return (
              <div key={lead.id} className="p-6 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground">{lead.service || "—"}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{lead.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
                <span className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold ${st.color}`}>{st.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NotificationsTab({ t }: { t: any }) {
  const mockNotifications = [
    { id: 1, title: "Arizangiz qabul qilindi", body: "SMM boshqaruv arizangiz muvaffaqiyatli qabul qilindi. Tez orada siz bilan bog'lanamiz.", date: "2026-03-24", read: false },
    { id: 2, title: "Yangi blog maqolasi", body: "Instagram marketing bo'yicha yangi maqola e'lon qilindi.", date: "2026-03-22", read: true },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="font-bold text-lg">{t("auth.cabinet.notifications.title")}</h2>
      </div>
      {mockNotifications.length === 0 ? (
        <div className="p-16 text-center">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">{t("auth.cabinet.notifications.empty")}</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {mockNotifications.map(n => (
            <div key={n.id} className={`p-6 flex items-start gap-4 hover:bg-muted/20 transition-colors ${!n.read ? "bg-primary/5" : ""}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${!n.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-foreground text-sm">{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SavedTab({ t }: { t: any }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-8">
      <div className="text-center py-8">
        <BookMarked className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground font-medium mb-4">{t("auth.cabinet.saved.empty")}</p>
        <Link href="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm">
          {t("auth.cabinet.saved.goToBlog")} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function SecurityTab({ user, refetch, t }: any) {
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    company: user?.company || "",
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const updateMeMutation = useUpdateMe({
    mutation: {
      onSuccess: () => {
        setProfileSaved(true);
        refetch();
        setTimeout(() => setProfileSaved(false), 3000);
      },
    },
  });

  const changePasswordMutation = useChangePassword({
    mutation: {
      onSuccess: () => {
        setPwSuccess(true);
        setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setPwSuccess(false), 3000);
      },
      onError: (err: any) => {
        setPwError(err?.response?.data?.error || t("common.error"));
      },
    },
  });

  const handleProfileSave = () => {
    updateMeMutation.mutate({ data: profileForm });
  };

  const handlePasswordSave = () => {
    setPwError("");
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError(t("auth.resetPassword.errorMismatch"));
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError(t("auth.resetPassword.errorShort"));
      return;
    }
    changePasswordMutation.mutate({
      data: {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile section */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          {t("auth.cabinet.profile.title")}
        </h2>
        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t("auth.cabinet.profile.name")}</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t("auth.cabinet.profile.email")}</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 border border-border rounded-xl bg-muted text-muted-foreground text-sm cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t("auth.cabinet.profile.phone")}</label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t("auth.cabinet.profile.company")}</label>
            <input
              type="text"
              value={profileForm.company}
              onChange={e => setProfileForm(p => ({ ...p, company: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
            />
          </div>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleProfileSave}
              disabled={updateMeMutation.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
            >
              {updateMeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {t("auth.cabinet.profile.saveChanges")}
            </button>
            {profileSaved && (
              <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> {t("auth.cabinet.profile.saved")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          {t("auth.cabinet.security.changePassword")}
        </h2>
        {pwError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" /> {pwError}
          </div>
        )}
        {pwSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" /> {t("auth.resetPassword.successTitle")}
          </div>
        )}
        <div className="space-y-4 max-w-lg">
          {[
            { key: "currentPassword" as const, label: t("auth.cabinet.security.currentPassword"), show: showPw.current, toggleKey: "current" as const },
            { key: "newPassword" as const, label: t("auth.cabinet.security.newPassword"), show: showPw.new, toggleKey: "new" as const },
            { key: "confirmPassword" as const, label: t("auth.cabinet.security.confirmPassword"), show: showPw.confirm, toggleKey: "confirm" as const },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-foreground mb-2">{field.label}</label>
              <div className="relative">
                <input
                  type={field.show ? "text" : "password"}
                  value={pwForm[field.key]}
                  onChange={e => setPwForm(p => ({ ...p, [field.key]: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-4 pr-12 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => ({ ...p, [field.toggleKey]: !p[field.toggleKey] }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <div className="pt-2">
            <button
              onClick={handlePasswordSave}
              disabled={changePasswordMutation.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
            >
              {changePasswordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {t("auth.cabinet.security.savePassword")}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-card border border-red-200 rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-2 flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          {t("auth.cabinet.security.deleteAccount")}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">{t("auth.cabinet.security.deleteWarning")}</p>
        <button className="px-6 py-3 border border-red-300 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors text-sm">
          {t("auth.cabinet.security.deleteConfirm")}
        </button>
      </div>
    </div>
  );
}
