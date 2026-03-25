import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Section, staggerContainer, staggerItem } from "@/components/ui/Section";
import { LeadForm } from "@/components/LeadForm";
import { useGetServices, useGetCaseStudies } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle, Users, Zap, TrendingUp, Play, Star } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

function getServiceContent(content: unknown, lang: string) {
  if (!content) return { title: "", description: "", features: [] };
  const obj = content as Record<string, Record<string, unknown>>;
  const loc = obj[lang] || obj["uz"] || obj["en"] || obj["ru"] || {};
  return {
    title: (loc.title as string) || "",
    description: (loc.description as string) || "",
    features: (loc.features as string[]) || [],
  };
}

function getCaseContent(content: unknown, lang: string) {
  if (!content) return { title: "", description: "" };
  const obj = content as Record<string, Record<string, unknown>>;
  const loc = obj[lang] || obj["uz"] || obj["en"] || obj["ru"] || {};
  return {
    title: (loc.title as string) || "",
    description: (loc.description as string) || "",
  };
}

interface SolutionItem {
  title: string;
  desc: string;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const servicesQuery = useGetServices();
  const casesQuery = useGetCaseStudies({ featured: "true" });

  const [timeLeft, setTimeLeft] = useState({ d: 5, h: 12, m: 30, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        if (prev.d > 0) return { ...prev, d: prev.d - 1, h: 23, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const problems = t('home.problems', { returnObjects: true }) as string[];
  const solutions = t('home.solutions', { returnObjects: true }) as SolutionItem[];

  return (
    <main className="min-h-screen pt-20">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Hero background"
            className="w-full h-full object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-background/80 dark:bg-background/90 backdrop-blur-[2px]"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold mb-8 border border-primary/20"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              {t('hero.badge')}
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 leading-tight"
            >
              {t('hero.title')} <br/>
              <span className="text-gradient inline-block mt-2">
                {t('hero.titleHighlight')}
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link 
                href="/contact" 
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all text-lg flex items-center justify-center gap-2"
              >
                {t('hero.cta1')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/cases" 
                className="w-full sm:w-auto px-8 py-4 bg-background border-2 border-border text-foreground font-bold rounded-xl hover:border-primary/50 hover:bg-muted transition-all text-lg flex items-center justify-center"
              >
                {t('hero.cta2')}
              </Link>
            </motion.div>
          </div>

          {/* Floating Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { label: t('hero.stat1'), value: "500+", icon: TrendingUp },
              { label: t('hero.stat2'), value: "98%", icon: Users },
              { label: t('hero.stat3'), value: "5+", icon: Zap }
            ].map((stat, i) => (
              <div key={i} className="glass-panel rounded-2xl p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-foreground">{stat.value}</h4>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="py-10 bg-muted/50 border-y border-border overflow-hidden flex relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10"></div>
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          className="flex whitespace-nowrap items-center gap-16 px-8"
        >
          {Array(10).fill(["Korzinka", "MacCoffee", "Payme", "Artel", "Uzum"]).flat().map((brand, i) => (
            <span key={i} className="text-2xl font-black text-muted-foreground/40 uppercase tracking-widest">{brand}</span>
          ))}
        </motion.div>
      </div>

      {/* PROBLEM / SOLUTION */}
      <Section className="bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t('home.problemTitle')} <span className="text-destructive">{t('home.problemTitleHighlight')}</span> {t('home.problemTitleSuffix')}
              </h2>
              <ul className="space-y-4">
                {Array.isArray(problems) && problems.map((text, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                    <div className="w-6 h-6 rounded-full bg-destructive/20 text-destructive flex items-center justify-center shrink-0 mt-0.5">✕</div>
                    <span className="font-medium text-foreground">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 md:p-10 rounded-3xl border border-primary/10 relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 blur-2xl rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t('home.solutionTitle')} <span className="text-primary">{t('home.solutionTitleHighlight')}</span>
              </h2>
              <ul className="space-y-6">
                {Array.isArray(solutions) && solutions.map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground mb-1">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* SERVICES */}
      <Section className="bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t('sections.services')}</h2>
            <p className="text-lg text-muted-foreground">{t('home.servicesSubtitle')}</p>
          </div>

          {servicesQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-card animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {servicesQuery.data?.map((service) => {
                const sc = getServiceContent(service.content, i18n.language);
                return (
                  <motion.div key={service.id} variants={staggerItem}>
                    <Link href={`/services#${service.slug}`}>
                      <div className="group bg-card h-full p-8 rounded-2xl shadow-sm border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
                        <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                          {service.icon || '📱'}
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-3">{sc.title}</h3>
                        <p className="text-muted-foreground line-clamp-3 mb-6">
                          {sc.description}
                        </p>
                        <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                          {t('common.readMore')} <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </Section>

      {/* CASE STUDIES */}
      <Section className="bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{t('sections.cases')}</h2>
              <p className="text-lg text-muted-foreground">{t('home.casesSubtitle')}</p>
            </div>
            <Link href="/cases" className="px-6 py-3 border-2 border-border font-semibold rounded-xl hover:border-primary hover:text-primary transition-all">
              {t('home.allCases')}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {(casesQuery.data?.slice(0, 3) || []).map((cs) => {
              const csWithContent = cs as typeof cs & { content?: unknown; industry?: string };
              const cc = getCaseContent(csWithContent.content, i18n.language);
              return (
              <div
                key={cs.id}
                className="group relative h-[400px] rounded-3xl cursor-pointer"
                style={{ perspective: "1200px" }}
              >
                {/* Inner flip container */}
                <div
                  className="relative w-full h-full rounded-3xl overflow-visible"
                  style={{
                    transformStyle: "preserve-3d",
                    transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = "rotateY(180deg)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = "rotateY(0deg)";
                  }}
                >
                  {/* Front face */}
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <img src={"https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"} alt={cs.client} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                      <div className="uppercase text-xs font-bold text-accent mb-2 tracking-wider">{csWithContent.industry}</div>
                      <h3 className="text-2xl font-bold text-white mb-1">{cs.client}</h3>
                      <p className="text-white/80 line-clamp-1">{cc.description}</p>
                    </div>
                  </div>

                  {/* Back face: Metrics */}
                  <div
                    className="absolute inset-0 rounded-3xl bg-primary p-8 flex flex-col justify-center text-white overflow-hidden"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <h3 className="text-2xl font-bold mb-6 border-b border-white/20 pb-4">{cs.client} {t('home.caseResults')}</h3>
                    <div className="space-y-4">
                      {Object.entries(cs.metrics || {}).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-white/70 capitalize">{key}</span>
                          <span className="text-xl font-bold text-accent">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/cases" className="mt-8 py-3 bg-white text-primary text-center font-bold rounded-xl hover:bg-accent hover:text-white transition-colors">
                      {t('home.caseReadMore')}
                    </Link>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* MOCK GRID (YouTube/Insta) */}
      <Section className="bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">{t('home.contentTitle')}</h2>
            <p className="text-muted-foreground">{t('home.contentSubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className={cn("relative group rounded-2xl overflow-hidden bg-card/10 aspect-square", i === 1 || i === 4 ? "md:col-span-2 md:row-span-2" : "")}>
                <img src={`https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80&random=${i}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt="Portfolio item" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40">
                    <Play className="w-6 h-6 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="bg-muted/50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="absolute -left-40 top-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -right-40 bottom-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
          
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t('sections.testimonials')}</h2>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              className="pb-16"
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <SwiperSlide key={i}>
                  <div className="bg-card p-8 rounded-3xl shadow-lg border border-border h-full flex flex-col">
                    <div className="flex gap-1 text-accent mb-6">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
                    </div>
                    <p className="text-foreground text-lg mb-8 flex-1">"{t('home.testimonialQuote')}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                        <img src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80&random=${i}`} alt="Avatar" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">Sardor Alimov</h4>
                        <p className="text-sm text-muted-foreground">CEO, TechStore</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </Section>

      {/* FINAL CTA & CONTACT FORM */}
      <Section className="py-0" id="contact">
        <div className="bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="container mx-auto px-4 md:px-6 py-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <div className="text-white">
                <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                  {t('home.ctaTitle')}
                </h2>
                <p className="text-xl text-white/80 mb-10 max-w-lg">
                  {t('home.ctaSubtitle')}
                </p>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-sm">
                  <p className="text-sm text-white/70 font-bold uppercase tracking-wider mb-3">{t('home.countdownLabel')}</p>
                  <div className="flex gap-4">
                    {[
                      { l: t('home.countdown.days'), v: timeLeft.d },
                      { l: t('home.countdown.hours'), v: timeLeft.h },
                      { l: t('home.countdown.minutes'), v: timeLeft.m },
                      { l: t('home.countdown.seconds'), v: timeLeft.s },
                    ].map((time, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-black text-white shadow-inner mb-1">
                          {time.v.toString().padStart(2, '0')}
                        </div>
                        <span className="text-xs text-white/70">{time.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <LeadForm source="home_footer" />
              </div>
              
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
