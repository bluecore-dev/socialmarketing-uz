import { useState } from "react";
import { AdminLayout } from "./layout";
import { useGetAllServicesAdmin, useUpdateService } from "@workspace/api-client-react";
import { Package, Edit2, X, Save, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function getContent(content: any, lang = "uz") {
  if (!content) return { title: "", description: "", features: [] };
  const obj = content[lang] || content["uz"] || {};
  return { title: obj.title || "", description: obj.description || "", features: obj.features || [] };
}

interface ServiceFormProps {
  service: any;
  onSave: (data: any) => void;
  onClose: () => void;
  isSaving: boolean;
}

function ServiceForm({ service, onSave, onClose, isSaving }: ServiceFormProps) {
  const [lang, setLang] = useState("uz");
  const [form, setForm] = useState({
    icon: service.icon || "",
    active: service.active ?? true,
    content: service.content || {
      uz: { title: "", description: "", features: [] },
      ru: { title: "", description: "", features: [] },
      en: { title: "", description: "", features: [] },
    },
  });

  const lc = form.content[lang] || { title: "", description: "", features: [] };
  const features = Array.isArray(lc.features) ? lc.features : [];

  const updateLc = (field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      content: { ...prev.content, [lang]: { ...(prev.content[lang] || {}), [field]: value } }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Xizmatni tahrirlash: {service.slug}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Icon (emoji)</label>
              <input value={form.icon} onChange={e => setForm(p => ({...p, icon: e.target.value}))} placeholder="📱" className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-2xl focus:outline-none focus:border-primary" />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(p => ({...p, active: e.target.checked}))} className="w-4 h-4 accent-primary" />
              <label htmlFor="active" className="text-sm text-gray-300 font-medium">Faol</label>
            </div>
          </div>

          <div>
            <div className="flex gap-2 mb-3">
              {["uz", "ru", "en"].map(l => (
                <button key={l} type="button" onClick={() => setLang(l)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors ${lang === l ? "bg-primary text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>{l}</button>
              ))}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Sarlavha ({lang})</label>
                <input value={lc.title} onChange={e => updateLc("title", e.target.value)} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Tavsif ({lang})</label>
                <textarea value={lc.description} onChange={e => updateLc("description", e.target.value)} rows={3} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Xususiyatlar (har satrda bittadan)</label>
                <textarea
                  value={features.join("\n")}
                  onChange={e => updateLc("features", e.target.value.split("\n").filter(Boolean))}
                  rows={5}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary resize-none"
                />
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

export default function AdminServices() {
  const [editService, setEditService] = useState<any | null>(null);
  const qc = useQueryClient();

  const servicesQuery = useGetAllServicesAdmin();
  const services = servicesQuery.data || [];

  const updateService = useUpdateService({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/api/services"] });
        setEditService(null);
      },
    },
  });

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Xizmatlar</h1>
        <p className="text-gray-500 text-sm mt-1">{services.length} ta xizmat</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {servicesQuery.isLoading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-800 animate-pulse rounded-xl" />)}</div>
        ) : services.length === 0 ? (
          <div className="p-16 text-center text-gray-600"><Package className="w-10 h-10 mx-auto mb-3" /><p>Xizmatlar yo'q</p></div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {services.map((s: any) => {
              const lc = getContent(s.content, "uz");
              return (
                <div key={s.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/30 transition-colors">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    {s.icon || "🚀"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{lc.title || s.slug}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{lc.description?.slice(0, 80)}</p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium ${s.active ? "text-green-400 bg-green-500/20" : "text-gray-500 bg-gray-700/50"}`}>
                    {s.active ? "Faol" : "Nofaol"}
                  </span>
                  <button onClick={() => setEditService(s)} className="shrink-0 p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editService && (
        <ServiceForm
          service={editService}
          onSave={data => updateService.mutate({ id: editService.id, data })}
          onClose={() => setEditService(null)}
          isSaving={updateService.isPending}
        />
      )}
    </AdminLayout>
  );
}
