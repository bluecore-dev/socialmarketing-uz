import { useTranslation } from "react-i18next";
import { useGetBlogPosts } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { ArrowRight, Calendar, User } from "lucide-react";

function getLocalizedContent(content: any, lang: string) {
  if (!content) return { title: "", excerpt: "", body: "" };
  const obj = content[lang] || content["uz"] || content["en"] || content["ru"] || {};
  return { title: obj.title || "", excerpt: obj.excerpt || "", body: obj.body || "" };
}

export default function Blog() {
  const { t, i18n } = useTranslation();
  const blogQuery = useGetBlogPosts();

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6">BlueCore <span className="text-primary">Blog</span></h1>
          <p className="text-xl text-muted-foreground">SMM, marketing va biznes bo'yicha foydali maqolalar, trendlar va insaytlar.</p>
        </div>

        {blogQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[1,2,3].map(i => <div key={i} className="h-96 bg-muted animate-pulse rounded-3xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogQuery.data?.posts.map((post) => {
              const lc = getLocalizedContent((post as any).content, i18n.language);
              return (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="bg-card rounded-3xl overflow-hidden shadow-sm border border-border hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full cursor-pointer">
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80&sig=${post.id}`} 
                        alt="Blog cover" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-4">
                        <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md uppercase tracking-wider">{post.category || 'SMM'}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> 
                          {(post as any).publishedAt ? format(new Date((post as any).publishedAt), "MMM d, yyyy") : ''}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {lc.title}
                      </h3>
                      
                      <p className="text-muted-foreground line-clamp-3 mb-6 flex-1 text-sm">
                        {lc.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                         <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                           <User className="w-4 h-4 text-muted-foreground"/> {post.author || "BlueCore"}
                         </span>
                         <span className="text-primary group-hover:translate-x-1 transition-transform"><ArrowRight className="w-5 h-5"/></span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {blogQuery.data?.posts.length === 0 && (
          <div className="text-center py-20 bg-card rounded-3xl border border-border">
            <h3 className="text-2xl font-bold text-muted-foreground">Hozircha maqolalar yo'q.</h3>
          </div>
        )}
      </div>
    </main>
  );
}
