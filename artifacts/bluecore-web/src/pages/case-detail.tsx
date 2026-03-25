import { useTranslation } from "react-i18next";
import { Link, useParams } from "wouter";
import { useGetCaseStudies } from "@workspace/api-client-react";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

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

interface CaseStudy {
  id: number;
  slug: string;
  client: string;
  platform: string;
  industry?: string;
  metrics?: Record<string, string>;
  content?: CaseStudyContent;
}

function getContent(content: CaseStudyContent | undefined, lang: string): LocalizedContent {
  if (!content) return { title: "", description: "" };
  const obj = content[lang] ?? content["uz"] ?? content["en"] ?? content["ru"];
  return { title: obj?.title || "", description: obj?.description || "" };
}

export default function CaseDetail() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const casesQuery = useGetCaseStudies();
  const cases = (casesQuery.data || []) as CaseStudy[];
  const cs = cases.find(c => c.slug === slug);

  if (casesQuery.isLoading) {
    return (
      <main className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  if (!cs) {
    return (
      <main className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold mb-6">{t('pages.notFound.title')}</h1>
          <Link href="/cases" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold">
            <ArrowLeft className="w-5 h-5" />
            {t('pages.cases.all')}
          </Link>
        </div>
      </main>
    );
  }

  const lc = getContent(cs.content, lang);
  const metrics = cs.metrics ? Object.entries(cs.metrics) : [];

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/cases" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-medium mb-10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            {t('pages.cases.all')}
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            {cs.industry && (
              <span className="px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest rounded-full">{cs.industry}</span>
            )}
            <span className="px-4 py-1.5 bg-muted text-muted-foreground text-sm font-semibold rounded-full capitalize">{cs.platform}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 text-foreground">{lc.title || cs.client}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">{lc.description}</p>

          <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl aspect-video relative">
            <img
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80"
              alt={cs.client}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
              <h2 className="text-3xl font-bold text-white">{cs.client}</h2>
            </div>
          </div>

          {metrics.length > 0 && (
            <div className="bg-card border border-border rounded-3xl p-8 mb-12">
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t('pages.cases.metrics', 'Natijalari')}</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {metrics.map(([key, val]) => (
                  <div key={key} className="text-center p-6 bg-muted rounded-2xl">
                    <div className="text-3xl font-black text-primary mb-2">{String(val)}</div>
                    <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Link href="/contact" className="flex-1 py-4 bg-primary text-white text-center font-bold rounded-2xl hover:bg-primary/90 transition-colors">
              {t('hero.cta1')}
            </Link>
            <Link href="/cases" className="flex-1 py-4 bg-muted text-foreground text-center font-bold rounded-2xl hover:bg-muted/70 transition-colors">
              {t('pages.cases.all')}
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
