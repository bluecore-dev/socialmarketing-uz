import { useState } from "react";
import { AdminLayout } from "./layout";
import { useGetCaseStudies, useDeleteCaseStudy, useCreateCaseStudy, useUpdateCaseStudy } from "@workspace/api-client-react";
import { BarChart2, Plus, Edit2, Trash2, Star, X, Save, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function getContent(content: any, lang = "uz") {
  if (!content) return { title: "", description: "" };
  const obj = content[lang] || content["uz"] || {};
  return { title: obj.title || "", description: obj.description || "" };
}

interface CaseFormProps {
  initial?: any;
  onSave: (data: any) => void;
  onClose: () => void;
  isSaving: boolean;
}

function CaseForm({ initial, onSave, onClose, isSaving }: CaseFormProps) {
  const [lang, setLang] = useState("uz");
  const [form, setForm] = useState({
    slug: initial?.slug || "",
    client: initial?.client || "",
    platform: initial?.platform || "instagram",
    status: initial?.status || "draft",
    featured: initial?.featured || false,
    metrics: initial?.metrics ? JSON.stringify(initial.metrics, null, 2) : '{"followers": "+10,000", "reach": "+200%"}',
    content: initial?.content || {
      uz: { title: "", description: "" },
      ru: { title: "", description: "" },
      en: { title: "", description: "" },
    },
  });

  const lc = form.content[lang] || { title: "", description: "" };
  const updateLc = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      content: { ...prev.content, [lang]: { ...(prev.content[lang] || {}), [field]: value } }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let parsedMetrics = {};
    try { parsedMetrics = JSON.parse(form.metrics); } catch {}
    onSave({ ...form, metrics: parsedMetrics });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">{initial ? "Keys tahrirlash" : "Yangi keys"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Slug</label>
              <input value={form.slug} onChange={e => setForm(p => ({...p, slug: e.target.value}))} placeholder="fayz-burger" className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Mijoz</label>
              <input value={form.client} onChange={e => setForm(p => ({...p, client: e.target.value}))} placeholder="Fayz Burger" className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Platforma</label>
              <select value={form.platform} onChange={e => setForm(p => ({...p, platform: e.target.value}))} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary">
                {["instagram", "tiktok", "facebook", "youtube", "linkedin"].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary">
                <option value="draft">Qoralama</option>
                <option value="published">Nashr etilgan</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(p => ({...p, featured: e.target.checked}))} className="w-4 h-4 accent-primary" />
            <label htmlFor="featured" className="text-sm text-gray-300 font-medium">Tavsiya etilgan (featured)</label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Metriklar (JSON)</label>
            <textarea value={form.metrics} onChange={e => setForm(p => ({...p, metrics: e.target.value}))} rows={4} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary font-mono resize-none" />
          </div>

          <div>
            <div className="flex gap-2 mb-3">
              {["uz", "ru", "en"].map(l => (
                <button key={l} type="button" onClick={() => setLang(l)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors ${lang === l ? "bg-primary text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>{l}</button>
              ))}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Sarlavha ({lang})</label>
                <input value={lc.title} onChange={e => updateLc("title", e.target.value)} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Tavsif ({lang})</label>
                <textarea value={lc.description} onChange={e => updateLc("description", e.target.value)} rows={3} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary resize-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-800 text-gray-400 font-semibold rounded-xl hover:bg-gray-700 transition-colors">Bekor qilish</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCases() {
  const [editCase, setEditCase] = useState<any | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const qc = useQueryClient();

  const casesQuery = useGetCaseStudies();
  const cases = casesQuery.data || [];

  const createCase = useCreateCaseStudy({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/cases"] }); setShowCreate(false); } } });
  const updateCase = useUpdateCaseStudy({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/cases"] }); setEditCase(null); } } });
  const deleteCase = useDeleteCaseStudy({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/cases"] }); } } });

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Keyslar</h1>
          <p className="text-gray-500 text-sm mt-1">{cases.length} ta keys</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm">
          <Plus className="w-4 h-4" />
          Yangi keys
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {casesQuery.isLoading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-800 animate-pulse rounded-xl" />)}</div>
        ) : cases.length === 0 ? (
          <div className="p-16 text-center text-gray-600"><BarChart2 className="w-10 h-10 mx-auto mb-3" /><p className="font-medium">Keyslar yo'q</p></div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {cases.map((c: any) => {
              const lc = getContent(c.content, "uz");
              return (
                <div key={c.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/30 transition-colors">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <BarChart2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white text-sm">{c.client}</p>
                      {c.featured && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{lc.title || c.slug} · {c.platform}</p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium ${c.status === "published" ? "text-green-400 bg-green-500/20" : "text-gray-500 bg-gray-700/50"}`}>
                    {c.status === "published" ? "Nashr" : "Qoralama"}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setEditCase(c)} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => { if (confirm(`"${c.client}" keysini o'chirmoqchimisiz?`)) deleteCase.mutate({ id: c.id }); }} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreate && <CaseForm onSave={data => createCase.mutate({ data })} onClose={() => setShowCreate(false)} isSaving={createCase.isPending} />}
      {editCase && <CaseForm initial={editCase} onSave={data => updateCase.mutate({ id: editCase.id, data })} onClose={() => setEditCase(null)} isSaving={updateCase.isPending} />}
    </AdminLayout>
  );
}
