import { useState, useCallback } from "react";
import { AdminLayout } from "./layout";
import {
  useGetAllTranslations,
  useUpsertTranslation,
  getGetAllTranslationsQueryKey,
} from "@workspace/api-client-react";
import type { Translation } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Globe, Search, Plus, Save, Loader2, Check, Filter } from "lucide-react";

const NAMESPACES = ["common", "home", "auth", "services", "blog", "cases", "about", "contact"];

export default function AdminTranslations() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [nsFilter, setNsFilter] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ uz: string; ru: string; en: string }>({ uz: "", ru: "", en: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [newRow, setNewRow] = useState({ namespace: "common", key: "", uz: "", ru: "", en: "" });
  const [savedId, setSavedId] = useState<number | null>(null);

  const translationsQuery = useGetAllTranslations();
  const translations: Translation[] = (translationsQuery.data as Translation[] | undefined) ?? [];

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: getGetAllTranslationsQueryKey() });
  }, [queryClient]);

  const upsertMutation = useUpsertTranslation({
    mutation: {
      onSuccess: (data) => {
        setSavedId((data as Translation)?.id ?? null);
        setTimeout(() => setSavedId(null), 2000);
        setEditingId(null);
        setShowAdd(false);
        setNewRow({ namespace: "common", key: "", uz: "", ru: "", en: "" });
        invalidate();
      },
    },
  });

  const filtered = translations.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.key.toLowerCase().includes(q) || (t.uz ?? "").toLowerCase().includes(q) || (t.ru ?? "").toLowerCase().includes(q) || (t.en ?? "").toLowerCase().includes(q);
    const matchNs = !nsFilter || t.namespace === nsFilter;
    return matchSearch && matchNs;
  });

  const grouped = filtered.reduce<Record<string, Translation[]>>((acc, t) => {
    if (!acc[t.namespace]) acc[t.namespace] = [];
    acc[t.namespace].push(t);
    return acc;
  }, {});

  const startEdit = (t: Translation) => {
    setEditingId(t.id);
    setEditValues({ uz: t.uz ?? "", ru: t.ru ?? "", en: t.en ?? "" });
  };

  const saveEdit = (t: Translation) => {
    upsertMutation.mutate({
      data: {
        namespace: t.namespace,
        key: t.key,
        uz: editValues.uz,
        ru: editValues.ru,
        en: editValues.en,
      },
    });
  };

  const saveNew = () => {
    if (!newRow.key.trim()) return;
    upsertMutation.mutate({
      data: {
        namespace: newRow.namespace,
        key: newRow.key.trim(),
        uz: newRow.uz,
        ru: newRow.ru,
        en: newRow.en,
      },
    });
  };

  const uniqueNamespaces = Array.from(new Set(translations.map(t => t.namespace)));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              Tarjimalar boshqaruvi
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {translations.length} ta kalit — UZ / RU / EN
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Yangi kalit
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Kalit yoki matn bo'yicha qidirish..."
              className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              value={nsFilter}
              onChange={e => setNsFilter(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary appearance-none min-w-[160px]"
            >
              <option value="">Barcha namespace</option>
              {uniqueNamespaces.map(ns => (
                <option key={ns} value={ns}>{ns}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add new row */}
        {showAdd && (
          <div className="bg-gray-900 border border-primary/40 rounded-2xl p-5 space-y-4">
            <h3 className="text-white font-semibold">Yangi tarjima kaliti</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Namespace</label>
                <select
                  value={newRow.namespace}
                  onChange={e => setNewRow(p => ({ ...p, namespace: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                >
                  {NAMESPACES.map(ns => <option key={ns} value={ns}>{ns}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Kalit *</label>
                <input
                  value={newRow.key}
                  onChange={e => setNewRow(p => ({ ...p, key: e.target.value }))}
                  placeholder="masalan: button.submit"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(["uz", "ru", "en"] as const).map(lang => (
                <div key={lang}>
                  <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">{lang}</label>
                  <textarea
                    value={newRow[lang]}
                    onChange={e => setNewRow(p => ({ ...p, [lang]: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowAdd(false); setNewRow({ namespace: "common", key: "", uz: "", ru: "", en: "" }); }}
                className="px-4 py-2 border border-gray-700 text-gray-400 rounded-xl text-sm hover:bg-gray-800 transition-all"
              >
                Bekor
              </button>
              <button
                onClick={saveNew}
                disabled={!newRow.key.trim() || upsertMutation.isPending}
                className="px-4 py-2 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {upsertMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Saqlash
              </button>
            </div>
          </div>
        )}

        {/* Translations Table */}
        {translationsQuery.isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-2xl">
            <Globe className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">Tarjimalar topilmadi</p>
          </div>
        ) : (
          Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([namespace, items]) => (
            <div key={namespace} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 bg-gray-800/50 border-b border-gray-700 flex items-center gap-2">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{namespace}</span>
                <span className="text-xs text-gray-500">({items.length} ta kalit)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-semibold w-1/4">Kalit</th>
                      <th className="text-left px-4 py-2.5 text-xs font-bold text-orange-400">UZ</th>
                      <th className="text-left px-4 py-2.5 text-xs font-bold text-blue-400">RU</th>
                      <th className="text-left px-4 py-2.5 text-xs font-bold text-green-400">EN</th>
                      <th className="w-16" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {items.map(t => (
                      <tr key={t.id} className="hover:bg-gray-800/30 transition-colors group">
                        <td className="px-4 py-3">
                          <code className="text-xs text-gray-300 bg-gray-800 px-1.5 py-0.5 rounded font-mono">{t.key}</code>
                        </td>
                        {editingId === t.id ? (
                          <>
                            {(["uz", "ru", "en"] as const).map(lang => (
                              <td key={lang} className="px-4 py-2">
                                <textarea
                                  value={editValues[lang]}
                                  onChange={e => setEditValues(p => ({ ...p, [lang]: e.target.value }))}
                                  rows={2}
                                  className="w-full px-2 py-1.5 bg-gray-800 border border-primary/50 rounded-lg text-white text-xs focus:outline-none focus:border-primary resize-none min-w-[140px]"
                                />
                              </td>
                            ))}
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => saveEdit(t)}
                                  disabled={upsertMutation.isPending}
                                  className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                                  title="Saqlash"
                                >
                                  {upsertMutation.isPending && editingId === t.id
                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    : <Save className="w-3.5 h-3.5" />
                                  }
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-1.5 text-gray-500 hover:text-white bg-gray-800 rounded-lg transition-all"
                                >
                                  <span className="text-xs">✕</span>
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-xs text-gray-300 max-w-[180px]">
                              <span className="line-clamp-2">{t.uz || <span className="text-gray-600 italic">bo'sh</span>}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-300 max-w-[180px]">
                              <span className="line-clamp-2">{t.ru || <span className="text-gray-600 italic">пусто</span>}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-300 max-w-[180px]">
                              <span className="line-clamp-2">{t.en || <span className="text-gray-600 italic">empty</span>}</span>
                            </td>
                            <td className="px-3 py-3">
                              {savedId === t.id ? (
                                <div className="p-1.5 text-green-400">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEdit(t)}
                                  className="p-1.5 text-gray-600 hover:text-white hover:bg-gray-700 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                  title="Tahrirlash"
                                >
                                  <span className="text-xs font-medium">Tahrirla</span>
                                </button>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
