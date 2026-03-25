import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetCaseStudies } from "@workspace/api-client-react";
import { ArrowUpRight, Filter, TrendingUp, TrendingDown } from "lucide-react";
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

const BEFORE_AFTER_IMAGES = [
  {
    before: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&q=80",
    after: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80",
  },
  {
    before: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
    after: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  },
  {
    before: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=600&q=80",
    after: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&q=80",
  },
];

function getLocalizedContent(content: CaseStudyContent | undefined, lang: string): LocalizedContent {
  if (!content) return { title: "", description: "" };
  const obj = content[lang] ?? content["uz"] ?? content["en"] ?? content["ru"];
  return { title: obj?.title || "", description: obj?.description || "" };
}

function BeforeAfterCard({ cs, idx, lang }: { cs: CaseStudy; idx: number; lang: string }) {
  const { t } = useTranslation();
  const lc = getLocalizedContent(cs.content, lang);
  const imgs = BEFORE_AFTER_IMAGES[idx % BEFORE_AFTER_IMAGES.length];

  const metricEntries = cs.metrics ? Object.entries(cs.metrics) : [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.35 }}
      className="bg-card rounded-3xl overflow-hidden border border-border shadow-lg flex flex-col"
    >
      {/* Client + platform badge */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">{cs.client}</h3>
        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
          {cs.industry || cs.platform || "SMM"}
        </span>
      </div>

      {/* Before / After images */}
      <div className="grid grid-cols-2 gap-2 mx-6 mb-4 rounded-2xl overflow-hidden">
        <div className="relative">
          <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-red-400" />
            {t('pages.cases.before', 'Oldin')}
          </div>
          <img src={imgs.before} alt="before" className="w-full aspect-[4/3] object-cover" />
        </div>
        <div className="relative">
          <div className="absolute top-2 left-2 z-10 bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-300" />
            {t('pages.cases.after', 'Keyin')}
          </div>
          <img src={imgs.after} alt="after" className="w-full aspect-[4/3] object-cover" />
        </div>
      </div>

      <div className="px-6 pb-6 flex-1 flex flex-col">
        {lc.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{lc.description}</p>
        )}

        {/* Metrics */}
        {metricEntries.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-5 py-4 border-y border-border">
            {metricEntries.slice(0, 4).map(([key, val]) => (
              <div key={key} className="flex flex-col">
                <span className="text-2xl font-black text-primary">{String(val)}</span>
                <span className="text-xs text-muted-foreground uppercase font-medium tracking-wide">{key}</span>
              </div>
            ))}
          </div>
        )}

        <Link
          href={`/cases/${cs.slug}`}
          className="flex items-center justify-between w-full py-3 px-4 bg-muted text-foreground font-semibold rounded-xl hover:bg-primary hover:text-white transition-colors mt-auto"
        >
          <span>{t('common.readMore')}</span>
          <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
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

        {casesQuery.isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-3xl border border-border h-96 animate-pulse" />
            ))}
          </div>
        )}

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCases.map((cs, idx) => (
              <BeforeAfterCard key={cs.id} cs={cs} idx={idx} lang={i18n.language.split('-')[0]} />
            ))}
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
