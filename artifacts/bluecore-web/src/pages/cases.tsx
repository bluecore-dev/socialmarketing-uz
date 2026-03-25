import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetCaseStudies } from "@workspace/api-client-react";
import { ArrowUpRight, Filter } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface LocalizedContent {
  title: string;
  description: string;
}

interface CaseStudyContent {
  uz?: LocalizedContent;
  ru?: LocalizedContent;
  en?: LocalizedContent;
  [key: string]: LocalizedContent | undefined;
}

interface CaseMetrics {
  [key: string]: string;
}

interface CaseStudy {
  id: number;
  slug: string;
  client: string;
  platform: string;
  industry?: string;
  metrics?: CaseMetrics;
  content?: CaseStudyContent;
}

function getLocalizedContent(content: CaseStudyContent | undefined, lang: string): LocalizedContent {
  if (!content) return { title: "", description: "" };
  const obj = content[lang] ?? content["uz"] ?? content["en"] ?? content["ru"];
  return { title: obj?.title || "", description: obj?.description || "" };
}

export default function Cases() {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState<string>("all");
  const casesQuery = useGetCaseStudies();

  const platforms = ["all", "instagram", "tiktok", "facebook", "youtube"];

  const cases = (casesQuery.data || []) as CaseStudy[];
  const filteredCases = cases.filter(c => filter === "all" || c.platform === filter);

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6">
            {t('pages.cases.title').split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-primary">{t('pages.cases.title').split(' ').slice(-1)}</span>
          </h1>
          <p className="text-xl text-muted-foreground">{t('pages.cases.subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <div className="flex items-center gap-2 mr-4 text-muted-foreground">
            <Filter className="w-5 h-5" /> {t('pages.cases.filterBy')}:
          </div>
          {platforms.map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-5 py-2 rounded-full font-medium capitalize transition-all ${filter === p ? 'bg-primary text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              {p === "all" ? t('pages.cases.all') : p}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCases.map(cs => {
              const lc = getLocalizedContent(cs.content, i18n.language);
              return (
                <motion.div
                  key={cs.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-card rounded-3xl overflow-hidden shadow-lg border border-border flex flex-col"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                    <img
                      src={`https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80&sig=${cs.id}`}
                      alt={cs.client}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur text-primary text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                        {cs.industry || cs.platform || "SMM"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-foreground mb-3">{cs.client}</h3>
                    <p className="text-muted-foreground line-clamp-2 mb-6 flex-1">
                      {lc.description}
                    </p>

                    {cs.metrics && Object.keys(cs.metrics).length > 0 && (
                      <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-border">
                        {Object.entries(cs.metrics).slice(0, 2).map(([key, val]) => (
                          <div key={key}>
                            <div className="text-xl font-black text-primary">{String(val)}</div>
                            <div className="text-xs text-muted-foreground uppercase">{key}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <Link href={`/cases/${cs.slug}`} className="flex items-center justify-between w-full py-3 px-4 bg-muted text-foreground font-semibold rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                      <span>{t('common.readMore')}</span>
                      <ArrowUpRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredCases.length === 0 && !casesQuery.isLoading && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-muted-foreground">{t('pages.cases.noResults')}</h3>
          </div>
        )}

      </div>
    </main>
  );
}
