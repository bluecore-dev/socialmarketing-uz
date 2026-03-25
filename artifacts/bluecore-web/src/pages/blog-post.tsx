import { useRoute } from "wouter";
import { useTranslation } from "react-i18next";
import { useGetBlogPost } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Calendar, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

function getLocalizedContent(content: any, lang: string) {
  if (!content) return { title: "", excerpt: "", body: "" };
  const obj = content[lang] || content["uz"] || content["en"] || content["ru"] || {};
  return { title: obj.title || "", excerpt: obj.excerpt || "", body: obj.body || "" };
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const { t, i18n } = useTranslation();
  
  const postQuery = useGetBlogPost(params?.slug || "", {
    query: { enabled: !!params?.slug, queryKey: ["/api/blog", params?.slug] }
  });

  if (postQuery.isLoading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const post = postQuery.data;

  if (!post) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Maqola topilmadi</h1>
        <Link href="/blog" className="text-primary hover:underline">Blogga qaytish</Link>
      </div>
    );
  }

  const lc = getLocalizedContent((post as any).content, i18n.language);

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Barcha maqolalar
        </Link>

        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold uppercase tracking-wider rounded-lg text-sm mb-4">
            {post.category || 'SMM'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-tight">
            {lc.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {(post as any).publishedAt ? format(new Date((post as any).publishedAt), "d MMMM yyyy") : ''}
            </span>
            {(post as unknown as Record<string, string>).author && <span>Muallif: <strong className="text-foreground">{(post as unknown as Record<string, string>).author}</strong></span>}
          </div>
        </div>

        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-12 shadow-xl">
          <img 
            src={`https://images.unsplash.com/photo-1557838923-2985c318be48?w=1200&q=80`}
            alt={lc.title}
            className="w-full h-full object-cover"
          />
        </div>

        <article className="prose prose-lg max-w-none dark:prose-invert">
          {lc.body ? (
            <div dangerouslySetInnerHTML={{ __html: lc.body }} />
          ) : (
            <p className="text-muted-foreground">{lc.excerpt}</p>
          )}
        </article>

        <div className="mt-16 pt-8 border-t border-border">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Barcha maqolalarga qaytish
          </Link>
        </div>
      </div>
    </main>
  );
}
