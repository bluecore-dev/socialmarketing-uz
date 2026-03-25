import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { LeadForm } from "@/components/LeadForm";
import { useGetServices, useGetCaseStudies } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle, Users, Zap, TrendingUp, Play, Star, ChevronDown } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ANIMATION_VARIANTS } from "@/lib/constants";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { useVideoFallback } from "@/hooks/useVideoFallback";
import { useMagneticHover } from "@/hooks/useMagneticHover";

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

function CounterStat({ end, suffix = "", label, icon: Icon }: { end: number; suffix?: string; label: string; icon: React.ElementType }) {
  const { count, ref } = useCounterAnimation({ end, duration: 2000 });
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="glass-panel rounded-2xl p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
      <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-3xl font-black text-foreground tabular-nums">{count}{suffix}</h4>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  );
}

function MagneticLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const ref = useMagneticHover<HTMLDivElement>({ strength: 12 });
  return (
    <div ref={ref}>
      <Link href={href} className={cn(className)}>
        {children}
      </Link>
    </div>
  );
}

function ParallaxSection({ children, className, speed = 0.3 }: { children: React.ReactNode; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 80}px`, `${speed * 80}px`]);
  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={prefersReducedMotion ? {} : { y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={ANIMATION_VARIANTS.fadeSlideUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PortfolioGrid() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const categories = ["all", "instagram", "youtube", "targetad", "content"];

  const items = [
    { id: 1, cat: "instagram", img: "photo-1611162617474-5b21e879e113", size: "large" },
    { id: 2, cat: "youtube", img: "photo-1611162616305-c69b3fa7fbe0", size: "small" },
    { id: 3, cat: "targetad", img: "photo-1551288049-bebda4e38f71", size: "small" },
    { id: 4, cat: "content", img: "photo-1633671475485-9bd1ff9c87c5", size: "large" },
    { id: 5, cat: "instagram", img: "photo-1542744095-fcf48d80b0fd", size: "small" },
    { id: 6, cat: "youtube", img: "photo-1633356122102-3fe601e05bd2", size: "small" },
    { id: 7, cat: "targetad", img: "photo-1585829365295-ab7cd400c167", size: "small" },
    { id: 8, cat: "content", img: "photo-1581276879432-15e50529f34b", size: "small" },
  ];

  const filtered = activeFilter === "all" ? items : items.filter(i => i.cat === activeFilter);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-semibold font-mono uppercase tracking-wide transition-all",
              activeFilter === cat
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative group break-inside-avoid mb-4 rounded-2xl overflow-hidden bg-card cursor-pointer",
                item.size === "large" ? "aspect-[4/5]" : "aspect-square"
              )}
            >
              <img
                src={`https://images.unsplash.com/${item.img}?w=600&q=75`}
                alt=""
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="font-mono text-xs text-accent uppercase tracking-widest mb-1">{item.cat}</span>
                <div className="flex items-center gap-2 text-white">
                  <Play className="w-5 h-5" />
                  <span className="text-sm font-semibold">{t('home.viewProject', 'Ko\'rish')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const HERO_VIDEO_DESKTOP = "https://www.w3schools.com/html/mov_bbb.mp4";
const HERO_VIDEO_MOBILE = "https://www.w3schools.com/html/mov_bbb.mp4";

function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { shouldUseVideo, isSlowConnection } = useVideoFallback();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldUseVideo) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.load();
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [shouldUseVideo]);

  return (
    <div className="absolute inset-0 z-0">
      <AnimatePresence>
        {!videoLoaded && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20"
          />
        )}
      </AnimatePresence>

      {shouldUseVideo && !isSlowConnection ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload={isMobile ? "none" : "metadata"}
          onCanPlay={() => setVideoLoaded(true)}
          poster={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-1000",
            videoLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Mobile: 720p equivalent source */}
          <source
            src={HERO_VIDEO_MOBILE}
            type="video/mp4"
            media="(max-width: 767px)"
          />
          {/* Desktop: 1080p equivalent source */}
          <source
            src={HERO_VIDEO_DESKTOP}
            type="video/mp4"
          />
        </video>
      ) : (
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt=""
          className="w-full h-full object-cover object-center"
        />
      )}

      <div className="absolute inset-0 cinematic-overlay" />
      <div className="absolute inset-0 vignette" />
      <div className="absolute inset-0 bg-background/50 dark:bg-background/70" />
    </div>
  );
}

function ScrollIndicator() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    import("gsap").then(({ gsap }) => {
      const tl = gsap.timeline({ delay: 1.3 });
      if (lineRef.current) {
        tl.fromTo(lineRef.current,
          { scaleY: 0, opacity: 0, transformOrigin: "top center" },
          { scaleY: 1, opacity: 1, duration: 0.7, ease: "power2.out" }
        );
        gsap.to(lineRef.current, {
          y: 8,
          repeat: -1,
          yoyo: true,
          duration: 0.9,
          ease: "power1.inOut",
          delay: 2,
        });
      }
    }).catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/60"
    >
      <span className="font-mono text-xs uppercase tracking-widest">Scroll</span>
      <div ref={lineRef} className="w-px h-12 bg-gradient-to-b from-foreground/40 to-transparent" />
      <ChevronDown className="w-4 h-4 scroll-indicator" />
    </motion.div>
  );
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

  const ctaRef1 = useMagneticHover<HTMLDivElement>({ strength: 15 });
  const ctaRef2 = useMagneticHover<HTMLDivElement>({ strength: 15 });

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  return (
    <main className="min-h-screen pt-20">
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden">
        <HeroVideoBackground />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-4 md:px-6 relative z-10 py-24 flex flex-col items-center"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-primary font-semibold mb-8 border border-primary/20"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest">{t('hero.badge')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="fluid-text-hero font-display font-bold text-foreground mb-6 leading-[1.05] tracking-tight"
            >
              {t('hero.title')} <br />
              <span className="text-gradient glow-text inline-block mt-2">
                {t('hero.titleHighlight')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="fluid-text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <div ref={ctaRef1} className="w-full sm:w-auto">
                <Link
                  href="/contact"
                  className="shimmer-btn w-full px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 hover:-translate-y-1 transition-all text-lg flex items-center justify-center gap-2 glow-border"
                >
                  {t('hero.cta1')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div ref={ctaRef2} className="w-full sm:w-auto">
                <Link
                  href="/cases"
                  className="w-full px-8 py-4 glass-panel font-bold rounded-xl hover:border-primary/50 transition-all text-lg flex items-center justify-center text-foreground"
                >
                  {t('hero.cta2')}
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mx-auto"
          >
            <CounterStat end={500} suffix="+" label={t('hero.stat1')} icon={TrendingUp} />
            <CounterStat end={98} suffix="%" label={t('hero.stat2')} icon={Users} />
            <CounterStat end={5} suffix="+" label={t('hero.stat3')} icon={Zap} />
          </motion.div>
        </motion.div>

        <ScrollIndicator />
      </section>

      {/* MARQUEE */}
      <div className="py-8 bg-muted/30 border-y border-border overflow-hidden flex relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          className="flex whitespace-nowrap items-center gap-16 px-8"
        >
          {Array(10).fill(["Korzinka", "MacCoffee", "Payme", "Artel", "Uzum", "Beeline", "Alif"]).flat().map((brand, i) => (
            <span key={i} className="font-mono text-lg font-bold text-muted-foreground/30 uppercase tracking-[0.3em]">{brand}</span>
          ))}
        </motion.div>
      </div>

      {/* PROBLEM / SOLUTION */}
      <Section className="bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <h2 className="fluid-text-3xl font-display font-bold mb-6">
                {t('home.problemTitle')} <span className="text-destructive">{t('home.problemTitleHighlight')}</span> {t('home.problemTitleSuffix')}
              </h2>
              <ul className="space-y-4">
                {Array.isArray(problems) && problems.map((text, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/10 hover:border-destructive/25 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-destructive/20 text-destructive flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</div>
                    <span className="font-medium text-foreground">{text}</span>
                  </motion.li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 md:p-10 rounded-3xl border border-primary/10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/15 blur-3xl rounded-full pointer-events-none"></div>
                <h2 className="fluid-text-3xl font-display font-bold mb-6 relative z-10">
                  {t('home.solutionTitle')} <span className="text-primary">{t('home.solutionTitleHighlight')}</span>
                </h2>
                <ul className="space-y-6 relative z-10">
                  {Array.isArray(solutions) && solutions.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground mb-1">{item.title}</h4>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </Section>

      {/* SERVICES */}
      <Section className="bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-accent mb-3 block">{t('sections.services')}</span>
            <h2 className="fluid-text-4xl font-display font-bold mb-4">{t('sections.services')}</h2>
            <p className="fluid-text-lg text-muted-foreground">{t('home.servicesSubtitle')}</p>
          </AnimatedSection>

          {servicesQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-card animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={ANIMATION_VARIANTS.staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {servicesQuery.data?.map((service) => {
                const sc = getServiceContent(service.content, i18n.language.split('-')[0]);
                return (
                  <motion.div key={service.id} variants={ANIMATION_VARIANTS.staggerItem}>
                    <Link href={`/services#${service.slug}`}>
                      <div className="group bg-card h-full p-8 rounded-2xl shadow-sm border border-border hover:border-primary/40 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500 rounded-2xl" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150"></div>

                        <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                          {service.icon || '📱'}
                        </div>
                        <h3 className="text-2xl font-display font-bold text-foreground mb-3">{sc.title}</h3>
                        <p className="text-muted-foreground line-clamp-3 mb-6">{sc.description}</p>
                        <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
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
          <AnimatedSection className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-accent mb-3 block">{t('sections.cases')}</span>
              <h2 className="fluid-text-4xl font-display font-bold mb-4">{t('sections.cases')}</h2>
              <p className="fluid-text-lg text-muted-foreground">{t('home.casesSubtitle')}</p>
            </div>
            <Link href="/cases" className="px-6 py-3 border-2 border-border font-semibold rounded-xl hover:border-primary hover:text-primary transition-all whitespace-nowrap">
              {t('home.allCases')}
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {(casesQuery.data?.slice(0, 3) || []).map((cs, idx) => {
              const csWithContent = cs as typeof cs & { content?: unknown; industry?: string };
              const cc = getCaseContent(csWithContent.content, i18n.language.split('-')[0]);
              return (
                <motion.div
                  key={cs.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative h-[420px] rounded-3xl cursor-pointer"
                  style={{ perspective: "1200px" }}
                >
                  <div
                    className="relative w-full h-full rounded-3xl overflow-visible"
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "rotateY(180deg)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "rotateY(0deg)"; }}
                  >
                    <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
                      <img
                        src={`https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=75`}
                        alt={cs.client}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 cinematic-overlay flex flex-col justify-end p-8">
                        <div className="font-mono uppercase text-xs font-bold text-accent mb-2 tracking-wider">{csWithContent.industry}</div>
                        <h3 className="text-2xl font-display font-bold text-white mb-1">{cs.client}</h3>
                        <p className="text-white/80 line-clamp-2">{cc.description}</p>
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 rounded-3xl bg-primary p-8 flex flex-col justify-center text-white overflow-hidden"
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-90" />
                      <div className="relative z-10">
                        <h3 className="text-2xl font-display font-bold mb-6 border-b border-white/20 pb-4">{cs.client} {t('home.caseResults')}</h3>
                        <div className="space-y-4">
                          {Object.entries(cs.metrics || {}).map(([key, val]) => (
                            <div key={key} className="flex justify-between items-center">
                              <span className="text-white/70 capitalize font-mono text-sm">{key}</span>
                              <span className="text-xl font-bold text-accent">{String(val)}</span>
                            </div>
                          ))}
                        </div>
                        <Link href="/cases" className="mt-8 block py-3 bg-white text-primary text-center font-bold rounded-xl hover:bg-accent hover:text-white transition-colors">
                          {t('home.caseReadMore')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* PORTFOLIO MASONRY */}
      <Section className="bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="text-center mb-12 max-w-2xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-widest text-accent mb-3 block">{t('home.contentTitle', 'Portfolio')}</span>
            <h2 className="fluid-text-4xl font-display font-bold mb-4 text-white">{t('home.contentTitle')}</h2>
            <p className="text-muted-foreground">{t('home.contentSubtitle')}</p>
          </AnimatedSection>

          <PortfolioGrid />
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative">
          <ParallaxSection className="absolute -left-40 top-0 w-96 h-96" speed={0.3}>
            <div className="w-full h-full bg-primary/10 rounded-full blur-3xl" />
          </ParallaxSection>
          <ParallaxSection className="absolute -right-40 bottom-0 w-96 h-96" speed={0.4}>
            <div className="w-full h-full bg-accent/10 rounded-full blur-3xl" />
          </ParallaxSection>

          <AnimatedSection className="text-center mb-16 relative z-10">
            <span className="font-mono text-xs uppercase tracking-widest text-accent mb-3 block">{t('sections.testimonials')}</span>
            <h2 className="fluid-text-4xl font-display font-bold mb-4">{t('sections.testimonials')}</h2>
          </AnimatedSection>

          <div className="relative z-10">
            <Swiper
              modules={[Pagination, Autoplay, FreeMode]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1.5, centeredSlides: true },
                768: { slidesPerView: 2, centeredSlides: false },
                1024: { slidesPerView: 3, centeredSlides: false }
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              grabCursor
              className="pb-14"
            >
              {[
                { name: "Sardor Alimov", role: "CEO, TechStore", img: "photo-1472099645785-5658abf4ff4e" },
                { name: "Dilnoza Yusupova", role: "Marketing Dir, Artel", img: "photo-1438761681033-6461ffad8d80" },
                { name: "Bobur Toshmatov", role: "Founder, AgroMarket", img: "photo-1507003211169-0a1dd7228f2d" },
                { name: "Malika Rahimova", role: "CMO, Payme", img: "photo-1494790108377-be9c29b29330" },
                { name: "Jasur Mirzayev", role: "CEO, TechHub UZ", img: "photo-1506794778202-cad84cf45f1d" },
              ].map((person, i) => (
                <SwiperSlide key={i}>
                  <div className="glass-panel p-7 rounded-3xl h-full flex flex-col border border-border hover:border-primary/30 transition-colors duration-300">
                    <div className="flex gap-1 text-accent mb-5">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-foreground fluid-text-base mb-7 flex-1 leading-relaxed">
                      "{t('home.testimonialQuote')}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                        <img
                          src={`https://images.unsplash.com/${person.img}?w=96&q=75`}
                          alt={person.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{person.name}</h4>
                        <p className="font-mono text-xs text-muted-foreground">{person.role}</p>
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
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

          <div className="container mx-auto px-4 md:px-6 py-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              <AnimatedSection className="text-white">
                <span className="font-mono text-xs uppercase tracking-widest text-accent/80 mb-4 block">{t('home.countdownLabel')}</span>
                <h2 className="fluid-text-4xl font-display font-black mb-6 leading-tight">
                  {t('home.ctaTitle')}
                </h2>
                <p className="fluid-text-lg text-white/80 mb-10 max-w-lg">
                  {t('home.ctaSubtitle')}
                </p>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-sm">
                  <p className="font-mono text-xs text-white/60 uppercase tracking-wider mb-4">{t('home.countdownLabel')}</p>
                  <div className="flex gap-4">
                    {[
                      { l: t('home.countdown.days'), v: timeLeft.d },
                      { l: t('home.countdown.hours'), v: timeLeft.h },
                      { l: t('home.countdown.minutes'), v: timeLeft.m },
                      { l: t('home.countdown.seconds'), v: timeLeft.s },
                    ].map((time, i) => (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div className="w-full aspect-square bg-white/15 rounded-xl flex items-center justify-center font-mono text-2xl font-black text-white mb-1">
                          {time.v.toString().padStart(2, '0')}
                        </div>
                        <span className="font-mono text-[10px] text-white/60 uppercase">{time.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <LeadForm source="home_footer" />
              </AnimatedSection>

            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
