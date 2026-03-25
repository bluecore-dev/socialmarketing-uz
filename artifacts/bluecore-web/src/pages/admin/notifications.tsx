import { useState } from "react";
import { AdminLayout } from "./layout";
import {
  useGetNotifications,
  useSendNotification,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from "@workspace/api-client-react";
import type { Notification, NotificationInput } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetNotificationsQueryKey } from "@workspace/api-client-react";
import { Bell, Send, Trash2, Check, CheckCheck, Loader2, X, User, Globe } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "info", label: "Ma'lumot" },
  { value: "success", label: "Muvaffaqiyat" },
  { value: "warning", label: "Ogohlantirish" },
  { value: "error", label: "Xato" },
  { value: "promo", label: "Aktsiya" },
];

const TYPE_COLORS: Record<string, string> = {
  info: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  success: "bg-green-500/20 text-green-300 border-green-500/30",
  warning: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  error: "bg-red-500/20 text-red-300 border-red-500/30",
  promo: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

export default function AdminNotifications() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NotificationInput>({
    title: "",
    body: "",
    type: "info",
    link: "",
    userId: undefined,
  });
  const [formError, setFormError] = useState("");

  const notifQuery = useGetNotifications();
  const notifications: Notification[] = (notifQuery.data as Notification[] | undefined) ?? [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey() });

  const sendMutation = useSendNotification({
    mutation: {
      onSuccess: () => {
        setShowForm(false);
        setForm({ title: "", body: "", type: "info", link: "", userId: undefined });
        setFormError("");
        invalidate();
      },
      onError: () => setFormError("Yuborishda xatolik yuz berdi."),
    },
  });

  const markReadMutation = useMarkNotificationRead({
    mutation: { onSuccess: invalidate },
  });

  const markAllMutation = useMarkAllNotificationsRead({
    mutation: { onSuccess: invalidate },
  });

  const deleteMutation = useDeleteNotification({
    mutation: { onSuccess: invalidate },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.title.trim() || !form.body.trim()) {
      setFormError("Sarlavha va matn majburiy.");
      return;
    }
    sendMutation.mutate({
      data: {
        title: form.title.trim(),
        body: form.body.trim(),
        type: form.type || "info",
        link: form.link?.trim() || undefined,
        userId: form.userId || undefined,
      },
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" />
              Xabarnomalar
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} ta o'qilmagan` : "Hammasi o'qilgan"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllMutation.mutate(undefined as unknown as void)}
                disabled={markAllMutation.isPending}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all"
              >
                {markAllMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                Barchasini o'qildi
              </button>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all"
            >
              <Send className="w-4 h-4" />
              Xabarnoma yuborish
            </button>
          </div>
        </div>

        {/* Send Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="flex items-center justify-between p-5 border-b border-gray-700">
                <h2 className="text-lg font-bold text-white">Yangi xabarnoma</h2>
                <button onClick={() => { setShowForm(false); setFormError(""); }} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSend} className="p-5 space-y-4">
                {formError && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-sm">{formError}</div>
                )}

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Sarlavha *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                    placeholder="Xabarnoma sarlavhasi"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Matn *</label>
                  <textarea
                    value={form.body}
                    onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary resize-none"
                    placeholder="Xabarnoma matni..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Tur</label>
                    <select
                      value={form.type}
                      onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                    >
                      {TYPE_OPTIONS.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Foydalanuvchi ID (ixtiyoriy)</label>
                    <input
                      type="number"
                      value={form.userId ?? ""}
                      onChange={e => setForm(p => ({ ...p, userId: e.target.value ? Number(e.target.value) : undefined }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                      placeholder="Barcha foydalanuvchilar"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Havola (ixtiyoriy)</label>
                  <input
                    value={form.link ?? ""}
                    onChange={e => setForm(p => ({ ...p, link: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setFormError(""); }}
                    className="flex-1 py-2 border border-gray-700 text-gray-400 rounded-xl text-sm hover:bg-gray-800 transition-all"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={sendMutation.isPending}
                    className="flex-1 py-2 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    {sendMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Yuborish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {notifQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-2xl">
              <Bell className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">Xabarnomalar yo'q</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  notif.read
                    ? "bg-gray-900 border-gray-800"
                    : "bg-gray-900/80 border-primary/30 shadow-sm shadow-primary/10"
                }`}
              >
                <div className={`p-2 rounded-lg border shrink-0 ${TYPE_COLORS[notif.type] ?? TYPE_COLORS.info}`}>
                  <Bell className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-semibold text-sm ${notif.read ? "text-gray-300" : "text-white"}`}>
                        {notif.title}
                        {!notif.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full" />
                        )}
                      </h3>
                      <p className="text-gray-400 text-sm mt-0.5">{notif.body}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${TYPE_COLORS[notif.type] ?? TYPE_COLORS.info}`}>
                      {TYPE_OPTIONS.find(t => t.value === notif.type)?.label ?? notif.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    {notif.userId ? (
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> ID: {notif.userId}</span>
                    ) : (
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Hammaga</span>
                    )}
                    {notif.createdAt && (
                      <span>{new Date(notif.createdAt).toLocaleString("uz-UZ")}</span>
                    )}
                    {notif.link && (
                      <a href={notif.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Havola
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => markReadMutation.mutate({ id: String(notif.id) })}
                      disabled={markReadMutation.isPending}
                      title="O'qildi"
                      className="p-1.5 text-gray-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate({ id: String(notif.id) })}
                    disabled={deleteMutation.isPending}
                    title="O'chirish"
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
