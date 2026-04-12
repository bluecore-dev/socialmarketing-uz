import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { LeadForm } from "@/components/LeadForm";
import { useGetServices, useGetCaseStudies } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import {
  ArrowRight, ChevronDown, Star, Play,
  TrendingUp, Users, Zap, BarChart2,
  Target, Lightbulb, CheckCircle2, ArrowUpRight,
  Instagram, Youtube, Search, PenTool, Megaphone, LineChart,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { useMagneticHover } from "@/hooks/useMagneticHover";

/* ── helpers ─────────────────────────────────────────────────── */
function getServiceContent(content: unknown, lang: string) {
  if (!content) return { title: "", description: "", features: [] as string[] };
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

/* ── reusable animation wrapper ─────────────────────────────── */
function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.12 });
  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── counter stat ────────────────────────────────────────────── */
function Stat({
  end,
  suffix = "",
  label,
  icon: Icon,
}: {
  end: number;
  suffix?: string;
  label: string;
  icon: React.ElementType;
}) {
  const { count, ref } = useCounterAnimation({ end, duration: 2200 });
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col gap-3"
    >
      <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-4xl lg:text-5xl font-display font-black text-foreground tabular-nums leading-none">
        {count}
        <span className="text-primary">{suffix}</span>
      </p>
      <p className="text-sm text-muted-foreground font-medium leading-tight">{label}</p>
    </div>
  );
}

/* ── scroll indicator ────────────────────────────────────────── */
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3, duration: 0.6 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-foreground/50 pointer-events-none"
    >
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </motion.div>
  );
}

/* ── floating social proof badges ───────────────────────────── */
function FloatingBadge({
  className,
  delay,
  children,
}: {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay ?? 0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "absolute glass-panel rounded-2xl px-4 py-3 shadow-lg border border-white/20 text-sm font-semibold",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/* ── service icons map ───────────────────────────────────────── */
const SERVICE_ICON_MAP: Record<string, React.ElementType> = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Megaphone,
  targeting: Target,
  strategy: Lightbulb,
  content: PenTool,
  seo: Search,
  analytics: LineChart,
  smm: BarChart2,
};

function getServiceIcon(slug?: string): React.ElementType {
  if (!slug) return BarChart2;
  const key = slug.toLowerCase().replace(/-/g, "");
  for (const [k, Icon] of Object.entries(SERVICE_ICON_MAP)) {
    if (key.includes(k)) return Icon;
  }
  return BarChart2;
}

/* ── process steps ───────────────────────────────────────────── */
const PROCESS_STEPS = [
  {
    num: "01",
    icon: Search,
    titleKey: "home.process1Title",
    descKey: "home.process1Desc",
    defaultTitle: "Tahlil",
    defaultDesc: "Biznesingizni va raqobat muhitini chuqur o'rganamiz",
  },
  {
    num: "02",
    icon: Lightbulb,
    titleKey: "home.process2Title",
    descKey: "home.process2Desc",
    defaultTitle: "Strategiya",
    defaultDesc: "Maqsadlarga moslashtirilgan marketing rejasi tuzamiz",
  },
  {
    num: "03",
    icon: Zap,
    titleKey: "home.process3Title",
    descKey: "home.process3Desc",
    defaultTitle: "Amalga oshirish",
    defaultDesc: "Tez va samarali tarzda kampaniyani ishga tushiramiz",
  },
  {
    num: "04",
    icon: LineChart,
    titleKey: "home.process4Title",
    descKey: "home.process4Desc",
    defaultTitle: "O'sish",
    defaultDesc: "Natijalarni kuzatib, doimiy optimizatsiya qilamiz",
  },
];

/* ── main component ──────────────────────────────────────────── */
export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split("-")[0];
  const servicesQuery = useGetServices();
  const casesQuery = useGetCaseStudies({ featured: "true" });

  const [timeLeft, setTimeLeft] = useState({ d: 5, h: 12, m: 30, s: 0 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((p) => {
        if (p.s > 0) return { ...p, s: p.s - 1 };
        if (p.m > 0) return { ...p, m: p.m - 1, s: 59 };
        if (p.h > 0) return { ...p, h: p.h - 1, m: 59, s: 59 };
        if (p.d > 0) return { ...p, d: p.d - 1, h: 23, m: 59, s: 59 };
        return p;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const ctaRef = useMagneticHover<HTMLDivElement>({ strength: 14 });
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);

  return (
    <main className="min-h-screen pt-[72px]">

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex items-center overflow-hidden bg-background"
      >
        {/* Background mesh gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-secondary/6 rounded-full blur-[80px]" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-4 md:px-6 relative z-10 py-16 md:py-24 w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left column */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/20 text-primary font-semibold mb-7"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest">
                  {t("hero.badge")}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black text-[clamp(2.4rem,5.5vw,4rem)] leading-[1.04] tracking-tight text-foreground mb-6"
              >
                {t("hero.title")}
                <br />
                <span className="text-gradient glow-text">{t("hero.titleHighlight")}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed"
              >
                {t("hero.subtitle")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-3 mb-12"
              >
                <div ref={ctaRef}>
                  <Link
                    href="/contact"
                    className="shimmer-btn inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all text-base"
                  >
                    {t("hero.cta1")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <Link
                  href="/cases"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-border font-bold rounded-2xl hover:border-primary hover:text-primary transition-all text-base text-foreground"
                >
                  <Play className="w-4 h-4" />
                  {t("hero.cta2")}
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.7 }}
                className="flex flex-wrap gap-6 divide-x divide-border"
              >
                {[
                  { end: 500, suffix: "+", label: t("hero.stat1") },
                  { end: 98, suffix: "%", label: t("hero.stat2") },
                  { end: 5, suffix: "+", label: t("hero.stat3") },
                ].map((s, i) => {
                  const { count, ref } = useCounterAnimation({ end: s.end, duration: 2000 });
                  return (
                    <div
                      key={i}
                      ref={ref as React.RefObject<HTMLDivElement>}
                      className={cn("flex flex-col", i > 0 && "pl-6")}
                    >
                      <span className="font-display font-black text-3xl text-foreground tabular-nums">
                        {count}
                        <span className="text-primary">{s.suffix}</span>
                      </span>
                      <span className="text-xs text-muted-foreground font-medium mt-0.5">{s.label}</span>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Right column — visual */}
            <div className="hidden lg:flex items-center justify-center relative h-[520px]">
              {/* Central glowing orb */}
              <motion.div
                animate={{ scale: [1, 1.06, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 blur-2xl"
              />

              {/* Grid of social media platforms */}
              <div className="relative z-10 grid grid-cols-3 gap-4">
                {[
                  { Icon: Instagram, label: "Instagram", color: "from-pink-500 to-purple-600", delay: 0.2 },
                  { Icon: Youtube, label: "YouTube", color: "from-red-500 to-red-600", delay: 0.35 },
                  { Icon: BarChart2, label: "Targeting", color: "from-blue-500 to-blue-600", delay: 0.5 },
                  { Icon: Target, label: "Ads", color: "from-orange-500 to-amber-500", delay: 0.45 },
                  { Icon: PenTool, label: "Content", color: "from-primary to-secondary", delay: 0.3 },
                  { Icon: LineChart, label: "Analytics", color: "from-teal-500 to-cyan-500", delay: 0.55 },
                  { Icon: Lightbulb, label: "Strategy", color: "from-yellow-500 to-orange-500", delay: 0.4 },
                  { Icon: Megaphone, label: "SMM", color: "from-secondary to-accent", delay: 0.25 },
                  { Icon: TrendingUp, label: "Growth", color: "from-green-500 to-emerald-600", delay: 0.6 },
                ].map(({ Icon, label, color, delay }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.7, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.12, y: -4 }}
                    className="glass-panel rounded-2xl p-5 flex flex-col items-center gap-2 border border-white/20 cursor-default"
                  >
                    <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Floating badges */}
              <FloatingBadge className="top-8 -left-8 text-foreground" delay={0.9}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Followers</p>
                    <p className="text-sm font-bold text-green-500">+128%</p>
                  </div>
                </div>
              </FloatingBadge>
              <FloatingBadge className="bottom-16 -right-4 text-foreground" delay={1.1}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-accent text-accent" />)}
                  </div>
                  <span className="text-xs text-muted-foreground">500+ mijoz</span>
                </div>
              </FloatingBadge>
            </div>
          </div>
        </motion.div>

        <ScrollIndicator />
      </section>

      {/* ═══════════════════════════════════════════════════
          BRAND MARQUEE
      ═══════════════════════════════════════════════════ */}
      <div className="py-6 bg-muted/40 border-y border-border overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/40 to-transparent z-10 pointer-events-none" />
        {[
          { brands: ["Korzinka", "MacCoffee", "Payme", "Artel", "Uzum", "Beeline", "Alif", "Ucell", "Zoodpay"], dir: 1 },
          { brands: ["Citilink", "MyTaxi", "Express24", "GreenWhite", "Orient", "Ipak Yuli", "NBU", "Hamkorbank"], dir: -1 },
        ].map((row, ri) => (
          <div key={ri} className="overflow-hidden relative mb-3 last:mb-0">
            <motion.div
              animate={{ x: row.dir === 1 ? ["0%", "-50%"] : ["-50%", "0%"] }}
              transition={{ duration: 28 + ri * 5, ease: "linear", repeat: Infinity }}
              className="flex whitespace-nowrap items-center gap-12"
            >
              {Array(6).fill(row.brands).flat().map((brand, i) => (
                <span
                  key={i}
                  className="font-mono text-sm font-bold text-muted-foreground/25 uppercase tracking-[0.35em]"
                >
                  {brand}
                </span>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════
          SERVICES
      ═══════════════════════════════════════════════════ */}
      <Section className="bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
                {t("sections.services")}
              </p>
              <h2 className="font-display font-black text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-foreground">
                {t("sections.services")}
              </h2>
              <p className="text-muted-foreground mt-3 max-w-lg">{t("home.servicesSubtitle")}</p>
            </div>
            <Link
              href="/services"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 border-2 border-border rounded-xl font-semibold text-sm hover:border-primary hover:text-primary transition-all"
            >
              {t("home.allCases", "Barchasini ko'rish")}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Reveal>

          {servicesQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-56 bg-muted/50 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {servicesQuery.data?.map((service, idx) => {
                const sc = getServiceContent(service.content, lang);
                const Icon = getServiceIcon(service.slug);
                return (
                  <Reveal key={service.id} delay={idx * 0.07}>
                    <Link href={`/services#${service.slug}`}>
                      <div className="group relative h-full p-7 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/8 transition-all duration-400 overflow-hidden cursor-pointer">
                        {/* Number */}
                        <span className="absolute top-5 right-6 font-mono text-4xl font-black text-muted/30 group-hover:text-primary/10 transition-colors">
                          {String(idx + 1).padStart(2, "0")}
                        </span>

                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary flex items-center justify-center mb-5 group-hover:from-primary group-hover:to-secondary group-hover:text-white transition-all duration-400 shadow-sm">
                          <Icon className="w-5 h-5" />
                        </div>

                        <h3 className="font-display font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                          {sc.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-5">
                          {sc.description}
                        </p>

                        <div className="flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                          {t("common.readMore")}
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════
          STATS  –  dark section
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 bg-foreground text-background overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[80px]" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Reveal className="text-center mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-4">
              {t("home.whyUsLabel", "Nima uchun biz?")}
            </p>
            <h2 className="font-display font-black text-[clamp(1.8rem,4vw,3rem)] text-white leading-tight">
              {t("home.whyUsTitle", "Raqamlar o'zidan gapiradi")}
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
            <Reveal delay={0}><Stat end={500} suffix="+" label={t("hero.stat1")} icon={Users} /></Reveal>
            <Reveal delay={0.1}><Stat end={98} suffix="%" label={t("hero.stat2")} icon={TrendingUp} /></Reveal>
            <Reveal delay={0.2}><Stat end={5} suffix="+" label={t("hero.stat3")} icon={Zap} /></Reveal>
            <Reveal delay={0.3}><Stat end={120} suffix="M+" label={t("home.stat4", "Umumiy reach")} icon={BarChart2} /></Reveal>
          </div>

          <Reveal className="mt-16 flex flex-wrap gap-3 justify-center" delay={0.15}>
            {[
              t("home.whyTag1", "Kafolatlangan natija"),
              t("home.whyTag2", "24/7 qo'llab-quvvatlash"),
              t("home.whyTag3", "Real hisobotlar"),
              t("home.whyTag4", "Tajribali jamoa"),
              t("home.whyTag5", "Tez ishga tushirish"),
            ].map((tag, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/10 text-sm text-white/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                {tag}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW WE WORK  —  process
      ═══════════════════════════════════════════════════ */}
      <Section className="bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
              {t("home.processLabel", "Qanday ishlashimiz")}
            </p>
            <h2 className="font-display font-black text-[clamp(1.8rem,4vw,2.8rem)] text-foreground leading-tight">
              {t("home.processTitle", "Oddiy 4 qadamda natijaga")}
            </h2>
          </Reveal>

          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {PROCESS_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="flex flex-col items-center text-center lg:items-center">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 text-white">
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                          <span className="font-mono text-[10px] font-black text-primary">{step.num}</span>
                        </div>
                      </div>
                      <h3 className="font-display font-bold text-xl text-foreground mb-2">
                        {t(step.titleKey, step.defaultTitle)}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(step.descKey, step.defaultDesc)}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════
          CASE STUDIES
      ═══════════════════════════════════════════════════ */}
      <Section className="bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
                {t("sections.cases")}
              </p>
              <h2 className="font-display font-black text-[clamp(1.8rem,4vw,2.8rem)] text-foreground leading-tight">
                {t("sections.cases")}
              </h2>
              <p className="text-muted-foreground mt-3 max-w-lg">{t("home.casesSubtitle")}</p>
            </div>
            <Link
              href="/cases"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 border-2 border-border rounded-xl font-semibold text-sm hover:border-primary hover:text-primary transition-all"
            >
              {t("home.allCases")}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(casesQuery.data?.slice(0, 3) || [1, 2, 3]).map((cs, idx) => {
              const isPlaceholder = typeof cs === "number";
              const item = isPlaceholder ? null : cs as typeof cs & { content?: unknown; industry?: string };
              const cc = item ? getCaseContent(item.content, lang) : null;

              return (
                <Reveal key={idx} delay={idx * 0.1}>
                  <div className="group relative rounded-3xl overflow-hidden h-[380px] bg-muted">
                    <img
                      src={`https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=75`}
                      alt={item?.client || ""}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-7">
                      {item && (
                        <span className="font-mono text-xs text-accent uppercase tracking-widest mb-2">
                          {item.industry}
                        </span>
                      )}
                      <h3 className="font-display font-bold text-xl text-white mb-2">
                        {item?.client || `Case ${idx + 1}`}
                      </h3>
                      <p className="text-white/70 text-sm line-clamp-2 mb-4">
                        {cc?.description || ""}
                      </p>

                      {/* Metrics pills */}
                      {item && Object.entries(item.metrics || {}).slice(0, 3).map(([k, v]) => (
                        <span
                          key={k}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mr-2 mb-2 backdrop-blur-sm"
                        >
                          <TrendingUp className="w-3 h-3 text-accent" />
                          {String(v)}
                        </span>
                      ))}

                      <Link
                        href="/cases"
                        className="mt-2 inline-flex items-center gap-2 text-accent font-semibold text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                      >
                        {t("home.caseReadMore", "Batafsil ko'rish")}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════ */}
      <Section className="bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal className="text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
              {t("sections.testimonials")}
            </p>
            <h2 className="font-display font-black text-[clamp(1.8rem,4vw,2.8rem)] text-foreground leading-tight">
              {t("sections.testimonials")}
            </h2>
          </Reveal>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.3, centeredSlides: true },
              900: { slidesPerView: 2, centeredSlides: false },
              1200: { slidesPerView: 3, centeredSlides: false },
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4200, disableOnInteraction: false }}
            grabCursor
            className="pb-12"
          >
            {[
              { name: "Sardor Alimov", role: "CEO, TechStore UZ", img: "photo-1472099645785-5658abf4ff4e" },
              { name: "Dilnoza Yusupova", role: "Marketing Director, Artel", img: "photo-1438761681033-6461ffad8d80" },
              { name: "Bobur Toshmatov", role: "Founder, AgroMarket", img: "photo-1507003211169-0a1dd7228f2d" },
              { name: "Malika Rahimova", role: "CMO, Payme", img: "photo-1494790108377-be9c29b29330" },
              { name: "Jasur Mirzayev", role: "CEO, TechHub Uzbekistan", img: "photo-1506794778202-cad84cf45f1d" },
            ].map((person, i) => (
              <SwiperSlide key={i}>
                <div className="bg-card rounded-3xl p-7 border border-border h-full flex flex-col hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex gap-1 text-accent mb-5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-foreground text-base leading-relaxed flex-1 mb-7 italic">
                    "{t("home.testimonialQuote")}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0">
                      <img
                        src={`https://images.unsplash.com/${person.img}?w=96&q=75`}
                        alt={person.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{person.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{person.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════
          CTA  —  countdown + form
      ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary/90 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-white/8 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal className="text-white">
              <p className="font-mono text-xs uppercase tracking-widest text-white/60 mb-4">
                {t("home.countdownLabel")}
              </p>
              <h2 className="font-display font-black text-[clamp(2rem,4.5vw,3.2rem)] leading-tight mb-6">
                {t("home.ctaTitle")}
              </h2>
              <p className="text-white/75 text-lg mb-10 max-w-lg leading-relaxed">
                {t("home.ctaSubtitle")}
              </p>

              {/* Countdown */}
              <div className="inline-flex gap-3 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4">
                {[
                  { l: t("home.countdown.days"), v: timeLeft.d },
                  { l: t("home.countdown.hours"), v: timeLeft.h },
                  { l: t("home.countdown.minutes"), v: timeLeft.m },
                  { l: t("home.countdown.seconds"), v: timeLeft.s },
                ].map((time, i) => (
                  <div key={i} className="flex flex-col items-center w-16">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={time.v}
                        initial={{ y: -12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 12, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="font-mono text-3xl font-black text-white leading-none"
                      >
                        {String(time.v).padStart(2, "0")}
                      </motion.span>
                    </AnimatePresence>
                    <span className="font-mono text-[10px] text-white/50 uppercase mt-1">{time.l}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="bg-background/10 backdrop-blur-md rounded-3xl border border-white/20 p-8">
                <LeadForm source="home_footer" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
