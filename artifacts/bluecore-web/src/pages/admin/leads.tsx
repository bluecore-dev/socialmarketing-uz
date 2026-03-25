import { useState } from "react";
import { Link } from "wouter";
import { AdminLayout } from "./layout";
import { useGetLeads, useUpdateLead } from "@workspace/api-client-react";
import { MessageSquare, Search, Filter, Clock, ChevronDown, Eye } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const statusMap: Record<string, { label: string; color: string }> = {
  new: { label: "Yangi", color: "bg-blue-500/20 text-blue-400" },
  reviewing: { label: "Ko'rilmoqda", color: "bg-yellow-500/20 text-yellow-400" },
  in_progress: { label: "Jarayonda", color: "bg-purple-500/20 text-purple-400" },
  done: { label: "Yakunlandi", color: "bg-green-500/20 text-green-400" },
  rejected: { label: "Rad etildi", color: "bg-red-500/20 text-red-400" },
};

const allStatuses = ["new", "reviewing", "in_progress", "done", "rejected"];

export default function AdminLeads() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const leadsQuery = useGetLeads({
    status: statusFilter || undefined,
    page: String(page),
    limit: "20",
  });

  const qc = useQueryClient();
  const updateLead = useUpdateLead({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/api/leads"] });
      },
    },
  });

  const data = leadsQuery.data as any;
  const leads = data?.leads || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const filtered = leads.filter((l: any) =>
    !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase()) || l.phone?.includes(search)
  );

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Arizalar</h1>
          <p className="text-gray-500 text-sm mt-1">Jami: {total} ta ariza</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Ism, email yoki telefon bo'yicha qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary placeholder:text-gray-600"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="pl-9 pr-8 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
          >
            <option value="">Barchasi</option>
            {allStatuses.map(s => (
              <option key={s} value={s}>{statusMap[s]?.label || s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Leads table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ism</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Aloqa</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Xizmat</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Sana</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {leadsQuery.isLoading ? (
                Array.from({length: 5}).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-8 bg-gray-800 animate-pulse rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-gray-600">
                    <MessageSquare className="w-10 h-10 mx-auto mb-3" />
                    <p className="font-medium">Arizalar topilmadi</p>
                  </td>
                </tr>
              ) : filtered.map((lead: any) => {
                const st = statusMap[lead.status] || { label: lead.status, color: "bg-gray-700 text-gray-400" };
                return (
                  <tr key={lead.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white text-sm">{lead.name}</div>
                      <div className="text-xs text-gray-500 sm:hidden">{lead.phone}</div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <div className="text-sm text-gray-300">{lead.phone}</div>
                      <div className="text-xs text-gray-600">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-gray-400">{lead.service || '—'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={lead.status}
                        onChange={e => updateLead.mutate({ id: lead.id, data: { status: e.target.value } })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border-0 cursor-pointer focus:outline-none ${st.color} bg-transparent`}
                        style={{ background: 'transparent' }}
                        onClick={e => e.stopPropagation()}
                      >
                        {allStatuses.map(s => (
                          <option key={s} value={s} className="bg-gray-800 text-white">{statusMap[s]?.label || s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(lead.createdAt).toLocaleDateString('uz')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link href={`/admin/leads/${lead.id}`} className="text-primary hover:text-primary/80 transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-4 border-t border-gray-800 flex items-center justify-between">
            <span className="text-sm text-gray-500">{total} dan {leads.length} ta ko'rsatilmoqda</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-700 transition-colors">
                ← Oldingi
              </button>
              <span className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-sm font-semibold">{page}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-700 transition-colors">
                Keyingi →
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
