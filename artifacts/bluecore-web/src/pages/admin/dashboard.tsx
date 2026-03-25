import { AdminLayout } from "./layout";
import { useGetAdminStats, useGetLeads } from "@workspace/api-client-react";
import { TrendingUp, TrendingDown, Users, MessageSquare, FileText, BarChart2, Eye, Clock } from "lucide-react";
import { Link } from "wouter";

function StatCard({ label, value, change, icon: Icon, color }: any) {
  const isPositive = change >= 0;
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </span>
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm text-gray-500 font-medium">{label}</div>
    </div>
  );
}

const statusMap: Record<string, { label: string; color: string }> = {
  new: { label: "Yangi", color: "bg-blue-500/20 text-blue-400" },
  reviewing: { label: "Ko'rilmoqda", color: "bg-yellow-500/20 text-yellow-400" },
  in_progress: { label: "Jarayonda", color: "bg-purple-500/20 text-purple-400" },
  done: { label: "Yakunlandi", color: "bg-green-500/20 text-green-400" },
  rejected: { label: "Rad etildi", color: "bg-red-500/20 text-red-400" },
};

export default function AdminDashboard() {
  const statsQuery = useGetAdminStats();
  const leadsQuery = useGetLeads({ limit: "5" });

  const stats = statsQuery.data as any;
  const leads = (leadsQuery.data as any)?.leads || [];

  const todayChange = stats
    ? stats.yesterdayLeads > 0
      ? Math.round(((stats.todayLeads - stats.yesterdayLeads) / stats.yesterdayLeads) * 100)
      : stats.todayLeads > 0 ? 100 : 0
    : 0;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">BlueCore boshqaruv paneli</p>
      </div>

      {statsQuery.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl h-36 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Bugungi arizalar"
            value={stats?.todayLeads || 0}
            change={todayChange}
            icon={MessageSquare}
            color="bg-blue-500/20 text-blue-400"
          />
          <StatCard
            label="Oylik arizalar"
            value={stats?.monthLeads || 0}
            change={12}
            icon={TrendingUp}
            color="bg-green-500/20 text-green-400"
          />
          <StatCard
            label="Jami foydalanuvchilar"
            value={stats?.totalUsers || 0}
            change={8}
            icon={Users}
            color="bg-purple-500/20 text-purple-400"
          />
          <StatCard
            label="Faol foydalanuvchilar"
            value={stats?.activeUsers || 0}
            change={5}
            icon={Eye}
            color="bg-orange-500/20 text-orange-400"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Yangi blog", href: "/admin/blog/new", icon: FileText, color: "bg-blue-600 hover:bg-blue-500" },
          { label: "Yangi keys", href: "/admin/cases/new", icon: BarChart2, color: "bg-purple-600 hover:bg-purple-500" },
          { label: "Arizalar", href: "/admin/leads", icon: MessageSquare, color: "bg-green-600 hover:bg-green-500" },
          { label: "Foydalanuvchilar", href: "/admin/users", icon: Users, color: "bg-orange-600 hover:bg-orange-500" },
        ].map(action => (
          <Link
            key={action.href}
            href={action.href}
            className={`${action.color} text-white rounded-xl p-4 flex items-center gap-3 font-semibold text-sm transition-colors`}
          >
            <action.icon className="w-5 h-5" />
            {action.label}
          </Link>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            So'nggi arizalar
          </h2>
          <Link href="/admin/leads" className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors">
            Barchasini ko'rish →
          </Link>
        </div>

        {leadsQuery.isLoading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-14 bg-gray-800 animate-pulse rounded-xl" />)}
          </div>
        ) : leads.length === 0 ? (
          <div className="p-16 text-center text-gray-600">
            <MessageSquare className="w-10 h-10 mx-auto mb-3" />
            <p className="font-medium">Hali arizalar yo'q</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {leads.map((lead: any) => {
              const st = statusMap[lead.status] || { label: lead.status, color: "bg-gray-700 text-gray-400" };
              return (
                <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/50 transition-colors group">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm group-hover:text-primary transition-colors">{lead.name}</p>
                    <p className="text-xs text-gray-500 truncate">{lead.service || lead.message?.slice(0, 60)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${st.color}`}>{st.label}</span>
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(lead.createdAt).toLocaleDateString('uz')}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
