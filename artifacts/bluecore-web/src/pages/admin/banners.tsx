import { useState } from "react";
import { AdminLayout } from "./layout";
import { useGetAllBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from "@workspace/api-client-react";
import { Image, Plus, Edit2, Trash2, X, Save, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface BannerFormProps {
  initial?: any;
  onSave: (data: any) => void;
  onClose: () => void;
  isSaving: boolean;
}

function BannerForm({ initial, onSave, onClose, isSaving }: BannerFormProps) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    subtitle: initial?.subtitle || "",
    imageUrl: initial?.imageUrl || "",
    linkUrl: initial?.linkUrl || "",
    linkText: initial?.linkText || "",
    active: initial?.active ?? true,
    order: initial?.order || 0,
    bgColor: initial?.bgColor || "#1A4F8A",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">{initial ? "Banner tahrirlash" : "Yangi banner"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="p-6 space-y-4">
          {[
            { key: "title", label: "Sarlavha" },
            { key: "subtitle", label: "Tavsif" },
            { key: "imageUrl", label: "Rasm URL" },
            { key: "linkUrl", label: "Havola URL" },
            { key: "linkText", label: "Havola matni" },
            { key: "bgColor", label: "Fon rangi (hex)" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
              <input
                value={(form as any)[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Tartib</label>
              <input type="number" value={form.order} onChange={e => setForm(p => ({...p, order: Number(e.target.value)}))} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <input type="checkbox" id="bannerActive" checked={form.active} onChange={e => setForm(p => ({...p, active: e.target.checked}))} className="w-4 h-4 accent-primary" />
              <label htmlFor="bannerActive" className="text-sm text-gray-300 font-medium">Faol</label>
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

export default function AdminBanners() {
  const [editBanner, setEditBanner] = useState<any | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const qc = useQueryClient();

  const bannersQuery = useGetAllBanners();
  const banners = bannersQuery.data || [];

  const createBanner = useCreateBanner({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/banners"] }); setShowCreate(false); } } });
  const updateBanner = useUpdateBanner({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/banners"] }); setEditBanner(null); } } });
  const deleteBanner = useDeleteBanner({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/banners"] }); } } });

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bannerlar</h1>
          <p className="text-gray-500 text-sm mt-1">{banners.length} ta banner</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Yangi banner
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {bannersQuery.isLoading ? (
          <div className="p-6 space-y-3">{[1,2].map(i => <div key={i} className="h-16 bg-gray-800 animate-pulse rounded-xl" />)}</div>
        ) : banners.length === 0 ? (
          <div className="p-16 text-center text-gray-600"><Image className="w-10 h-10 mx-auto mb-3" /><p>Bannerlar yo'q</p></div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {banners.map((b: any) => (
              <div key={b.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/30 transition-colors">
                <div className="w-12 h-8 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: b.bgColor || '#1A4F8A' }}>
                  {b.imageUrl && <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{b.title || `Banner #${b.id}`}</p>
                  <p className="text-xs text-gray-500 truncate">{b.subtitle}</p>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium ${b.active ? "text-green-400 bg-green-500/20" : "text-gray-500 bg-gray-700/50"}`}>
                  {b.active ? "Faol" : "Nofaol"}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setEditBanner(b)} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => { if (confirm("Bu bannerni o'chirmoqchimisiz?")) deleteBanner.mutate({ id: b.id }); }} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && <BannerForm onSave={data => createBanner.mutate({ data })} onClose={() => setShowCreate(false)} isSaving={createBanner.isPending} />}
      {editBanner && <BannerForm initial={editBanner} onSave={data => updateBanner.mutate({ id: editBanner.id, data })} onClose={() => setEditBanner(null)} isSaving={updateBanner.isPending} />}
    </AdminLayout>
  );
}
