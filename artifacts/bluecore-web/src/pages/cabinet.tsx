import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useLogout } from "@workspace/api-client-react";
import { useAuth, clearStoredToken } from "@/lib/auth-context";
import { motion } from "framer-motion";
import {
  User, LogOut, Settings, MessageSquare, BarChart2,
  FileText, Bell, ChevronRight, CheckCircle, Clock, Star
} from "lucide-react";

const mockLeads = [
  { id: 1, service: "SMM Boshqaruv", status: "reviewing", date: "2026-03-20", message: "Instagram va TikTok uchun SMM kerak" },
  { id: 2, service: "Targetli Reklama", status: "in_progress", date: "2026-03-15", message: "Facebook reklama kampaniyasi" },
];

const statusMap: Record<string, { label: string; color: string }> = {
  new: { label: "Yangi", color: "bg-blue-100 text-blue-700" },
  reviewing: { label: "Ko'rib chiqilmoqda", color: "bg-yellow-100 text-yellow-700" },
  in_progress: { label: "Jarayonda", color: "bg-green-100 text-green-700" },
  done: { label: "Yakunlandi", color: "bg-gray-100 text-gray-600" },
};

export default function Cabinet() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "settings">("overview");

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Kirish talab qilinadi</h1>
          <p className="text-muted-foreground mb-8">
            Shaxsiy kabinetga kirish uchun avval tizimga kiring.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
              Kirish
            </Link>
            <Link href="/register" className="px-6 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors">
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as const, label: "Umumiy", icon: BarChart2 },
    { id: "leads" as const, label: "Mening arizalarim", icon: MessageSquare },
    { id: "settings" as const, label: "Sozlamalar", icon: Settings },
  ];

  return (
    <main className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logoutMutation.mutate({})}
            disabled={logoutMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Chiqish
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-background border border-border rounded-2xl p-1.5 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Arizalar", value: mockLeads.length, icon: MessageSquare, color: "bg-blue-50 text-blue-600" },
                { label: "Jarayondagi", value: mockLeads.filter(l => l.status === "in_progress").length, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
                { label: "Yakunlangan", value: 0, icon: CheckCircle, color: "bg-green-50 text-green-600" },
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

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                So'nggi arizalar
              </h2>
              <div className="space-y-3">
                {mockLeads.map(lead => {
                  const st = statusMap[lead.status] || { label: lead.status, color: "bg-gray-100 text-gray-600" };
                  return (
                    <div key={lead.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">{lead.service}</p>
                        <p className="text-xs text-muted-foreground truncate">{lead.message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${st.color}`}>{st.label}</span>
                        <span className="text-xs text-muted-foreground">{lead.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Yangi xizmat buyurtma qiling</h3>
                  <p className="text-white/80 text-sm">Biznesingizni rivojlantirish uchun biz bilan bog'laning.</p>
                </div>
                <Link href="/contact" className="shrink-0 px-5 py-2.5 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors text-sm">
                  Buyurtma berish
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leads Tab */}
        {activeTab === "leads" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-bold text-lg">Mening arizalarim</h2>
                <Link href="/contact" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                  + Yangi ariza
                </Link>
              </div>

              {mockLeads.length === 0 ? (
                <div className="p-16 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">Hali arizalar yo'q.</p>
                  <Link href="/contact" className="mt-4 inline-block text-primary font-semibold hover:underline text-sm">
                    Birinchi arizangizni yuboring →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {mockLeads.map(lead => {
                    const st = statusMap[lead.status] || { label: lead.status, color: "bg-gray-100 text-gray-600" };
                    return (
                      <div key={lead.id} className="p-6 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground">{lead.service}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{lead.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{lead.date}</p>
                        </div>
                        <span className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold ${st.color}`}>{st.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-6">Profil ma'lumotlari</h2>
              <div className="space-y-4 max-w-lg">
                {[
                  { label: "Ism", value: user?.name || "", type: "text" },
                  { label: "Email", value: user?.email || "", type: "email" },
                  { label: "Telefon", value: user?.phone || "", type: "tel" },
                  { label: "Kompaniya", value: user?.company || "", type: "text" },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="block text-sm font-semibold text-foreground mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                    />
                  </div>
                ))}
                <div className="pt-4">
                  <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm">
                    O'zgarishlarni saqlash
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
