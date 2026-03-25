import { useState } from "react";
import { Link } from "wouter";
import { AdminLayout } from "./layout";
import { useGetBlogPosts, useDeleteBlogPost, useCreateBlogPost, useUpdateBlogPost } from "@workspace/api-client-react";
import { FileText, Plus, Edit2, Trash2, Eye, X, Save, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function getContent(content: any, lang = "uz") {
  if (!content) return { title: "", excerpt: "", body: "" };
  const obj = content[lang] || content["uz"] || {};
  return { title: obj.title || "", excerpt: obj.excerpt || "", body: obj.body || "" };
}

interface BlogFormProps {
  initial?: any;
  onSave: (data: any) => void;
  onClose: () => void;
  isSaving: boolean;
}

function BlogForm({ initial, onSave, onClose, isSaving }: BlogFormProps) {
  const [lang, setLang] = useState("uz");
  const [form, setForm] = useState({
    slug: initial?.slug || "",
    status: initial?.status || "draft",
    category: initial?.category || "smm",
    image: initial?.image || "",
    content: initial?.content || {
      uz: { title: "", excerpt: "", body: "" },
      ru: { title: "", excerpt: "", body: "" },
      en: { title: "", excerpt: "", body: "" },
    },
  });

  const lc = form.content[lang] || { title: "", excerpt: "", body: "" };

  const updateLc = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: { ...(prev.content[lang] || {}), [field]: value }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      publishedAt: form.status === "published" ? new Date().toISOString() : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">{initial ? "Blog tahrirlash" : "Yangi blog yaratish"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Slug</label>
              <input
                value={form.slug}
                onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                placeholder="blog-post-slug"
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              >
                <option value="draft">Qoralama</option>
                <option value="published">Nashr etilgan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Kategoriya</label>
              <input
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                placeholder="smm, trends, guide..."
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Rasm URL</label>
              <input
                value={form.image}
                onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                placeholder="https://..."
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <div className="flex gap-2 mb-4">
              {["uz", "ru", "en"].map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold uppercase transition-colors ${lang === l ? "bg-primary text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Sarlavha ({lang})</label>
                <input
                  value={lc.title}
                  onChange={e => updateLc("title", e.target.value)}
                  placeholder="Blog maqolasi sarlavhasi"
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Qisqa tavsif ({lang})</label>
                <textarea
                  value={lc.excerpt}
                  onChange={e => updateLc("excerpt", e.target.value)}
                  placeholder="Blog maqolasining qisqa tavsifi..."
                  rows={2}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Matn ({lang})</label>
                <textarea
                  value={lc.body}
                  onChange={e => updateLc("body", e.target.value)}
                  placeholder="Blog maqolasi asosiy matni. **bold** formatini qo'llash mumkin."
                  rows={8}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary resize-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-800 text-gray-400 font-semibold rounded-xl hover:bg-gray-700 transition-colors">
              Bekor qilish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBlog() {
  const [editPost, setEditPost] = useState<any | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const qc = useQueryClient();

  const blogQuery = useGetBlogPosts({ limit: "50" });
  const posts = (blogQuery.data as any)?.posts || [];

  const createPost = useCreateBlogPost({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/api/blog"] });
        setShowCreate(false);
      },
    },
  });

  const updatePost = useUpdateBlogPost({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/api/blog"] });
        setEditPost(null);
      },
    },
  });

  const deletePost = useDeleteBlogPost({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/api/blog"] });
      },
    },
  });

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} ta maqola</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Yangi maqola
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {blogQuery.isLoading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-800 animate-pulse rounded-xl" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center text-gray-600">
            <FileText className="w-10 h-10 mx-auto mb-3" />
            <p className="font-medium">Maqolalar yo'q</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {posts.map((post: any) => {
              const lc = getContent(post.content, "uz");
              return (
                <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/30 transition-colors">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{lc.title || post.slug}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${post.status === "published" ? "text-green-400" : "text-gray-500"}`}>
                        {post.status === "published" ? "Nashr etilgan" : "Qoralama"}
                      </span>
                      <span>{post.category}</span>
                      <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{post.views}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditPost(post)}
                      className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`"${lc.title}" maqolasini o'chirmoqchimisiz?`)) {
                          deletePost.mutate({ id: post.id });
                        }
                      }}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreate && (
        <BlogForm
          onSave={data => createPost.mutate({ data })}
          onClose={() => setShowCreate(false)}
          isSaving={createPost.isPending}
        />
      )}

      {editPost && (
        <BlogForm
          initial={editPost}
          onSave={data => updatePost.mutate({ id: editPost.id, data })}
          onClose={() => setEditPost(null)}
          isSaving={updatePost.isPending}
        />
      )}
    </AdminLayout>
  );
}
