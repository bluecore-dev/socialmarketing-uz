import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LeadForm } from "@/components/LeadForm";
import { useGetServices, useGetCaseStudies } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight, ArrowRight, Star, TrendingUp, Zap,
  BarChart2, Target, Lightbulb, PenTool, Megaphone, LineChart,
  Search, CheckCircle2, Quote, ChevronDown,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { useMagneticHover } from "@/hooks/useMagneticHover";

/* ─────────────────── helpers ─────────────────── */
function getSvcContent(content: unknown, lang: string) {
  if (!content) return { title: "", description: "" };
  const o = content as Record<string, Record<string, unknown>>;
  const l = o[lang] || o.uz || o.en || o.ru || {};
  return { title: (l.title as string) || "", description: (l.description as string) || "" };
}
function getCaseContent(content: unknown, lang: string) {
  if (!content) return { title: "", description: "" };
  const o = content as Record<string, Record<string, unknown>>;
  const l = o[lang] || o.uz || o.en || o.ru || {};
  return { title: (l.title as string) || "", description: (l.description as string) || "" };
}

/* ─────────────────── scroll reveal ─────────────────── */
function R({
  children, className, delay = 0, y = 40,
}: { children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────── magnetic button ─────────────────── */
function MagBtn({ href, className, children, variant = "solid" }: {
  href: string; className?: string; children: React.ReactNode; variant?: "solid" | "outline" | "ghost";
}) {
  const ref = useMagneticHover<HTMLDivElement>({ strength: 16 });
  return (
    <div ref={ref}>
      <Link href={href} className={cn(
        "inline-flex items-center justify-center gap-2.5 font-bold transition-all duration-300",
        variant === "solid" && "px-8 py-4 rounded-2xl bg-white text-[#0A0A0F] hover:bg-white/90 shadow-xl shadow-white/10 hover:-translate-y-1",
        variant === "outline" && "px-8 py-4 rounded-2xl border-2 border-white/30 text-white hover:border-white hover:bg-white/5 hover:-translate-y-1",
        variant === "ghost" && "px-6 py-3 rounded-xl text-white/70 hover:text-white",
        className,
      )}>
        {children}
      </Link>
    </div>
  );
}

/* ─────────────────── service icons ─────────────────── */
const SVC_ICONS: Record<string, React.ElementType> = {
  instagram: Megaphone, youtube: TrendingUp, facebook: BarChart2,
  targeting: Target, strategy: Lightbulb, content: PenTool,
  seo: Search, analytics: LineChart, smm: BarChart2,
};
function getSvcIcon(slug?: string): React.ElementType {
  if (!slug) return BarChart2;
  for (const [k, I] of Object.entries(SVC_ICONS))
    if (slug.toLowerCase().includes(k)) return I;
  return BarChart2;
}

/* ─────────────────── service accordion row ─────────────────── */
function SvcRow({ num, slug, icon: Icon, title, desc, delay }: {
  num: string; slug: string; icon: React.ElementType; title: string; desc: string; delay: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <R delay={delay}>
      <div
        className={cn(
          "group border-b border-white/10 cursor-pointer transition-all duration-400",
          open ? "border-white/20" : "hover:border-white/20",
        )}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="flex items-center justify-between py-6 md:py-7">
          <div className="flex items-center gap-5 md:gap-8">
            <span className="font-mono text-xs text-white/25 w-8 shrink-0">{num}</span>
            <span className={cn(
              "font-display font-bold text-xl md:text-3xl transition-colors duration-300",
              open ? "text-white" : "text-white/60",
            )}>
              {title}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0",
              open ? "bg-primary text-white scale-110" : "bg-white/5 text-white/40",
            )}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <ArrowUpRight className={cn(
              "w-5 h-5 transition-all duration-300",
              open ? "text-primary rotate-0 scale-110" : "text-white/25 -rotate-12",
            )} />
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-6 pl-16 md:pl-[3.75rem] flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <p className="text-white/50 max-w-xl text-base leading-relaxed flex-1">{desc}</p>
                <Link
                  href={`/services#${slug}`}
                  className="shrink-0 px-5 py-2.5 rounded-xl bg-white/8 border border-white/15 text-white text-sm font-semibold hover:bg-primary hover:border-primary transition-all"
                >
                  Ko'proq bilish
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </R>
  );
}

/* ─────────────────── animated stat ─────────────────── */
function BigStat({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { count, ref } = useCounterAnimation({ end, duration: 2400 });
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="flex flex-col gap-2">
      <p className="font-display font-black text-[clamp(3rem,7vw,6rem)] leading-none text-white tabular-nums">
        {count}<span className="text-primary">{suffix}</span>
      </p>
      <p className="text-white/40 text-sm font-medium uppercase tracking-widest">{label}</p>
    </div>
  );
}

/* ─────────────────── main ─────────────────── */
export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split("-")[0];
  const servicesQuery = useGetServices();
  const casesQuery = useGetCaseStudies({ featured: "true" });

  /* countdown */
  const [timeLeft, setTimeLeft] = useState({ d: 4, h: 18, m: 55, s: 0 });
  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(p => {
        if (p.s > 0) return { ...p, s: p.s - 1 };
        if (p.m > 0) return { ...p, m: p.m - 1, s: 59 };
        if (p.h > 0) return { ...p, h: p.h - 1, m: 59, s: 59 };
        if (p.d > 0) return { ...p, d: p.d - 1, h: 23, m: 59, s: 59 };
        return p;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  /* hero parallax */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  /* cursor glow (desktop) */
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 60, damping: 18 });
  const springY = useSpring(cursorY, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const move = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  return (
    <main>

      {/* ═══════════════════════════════════════════════
          HERO  —  dark full-screen typographic
      ═══════════���═══════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] bg-[#08080E] flex flex-col justify-between overflow-hidden"
      >
        {/* Cursor glow */}
        <motion.div
          className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none z-0 hidden lg:block"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Noise overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 flex items-center justify-between px-6 md:px-12 pt-28 pb-0"
        >
          <span className="font-mono text-xs text-white/25 uppercase tracking-[0.25em]">
            SOCIAL MARKETING AGENCY · UZBEKISTAN
          </span>
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-white/30">Mavjud: 3 slot</span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 px-6 md:px-12 flex-1 flex flex-col justify-center py-12"
        >
          <div className="max-w-[1200px]">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="inline-flex items-center gap-2.5 mb-8 md:mb-10"
            >
              <div className="h-px w-10 bg-primary" />
              <span className="font-mono text-xs text-primary uppercase tracking-[0.2em]">
                {t("hero.badge", "Digital · SMM · Targeting")}
              </span>
            </motion.div>

            {/* H1 — ultra large */}
            <div className="overflow-hidden mb-3">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black leading-[0.92] tracking-[-0.03em] text-white"
                style={{ fontSize: "clamp(3.2rem, 10.5vw, 9.5rem)" }}
              >
                {t("hero.title", "RAQAMLI")}
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-3">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black leading-[0.92] tracking-[-0.03em]"
                style={{
                  fontSize: "clamp(3.2rem, 10.5vw, 9.5rem)",
                  WebkitTextStroke: "1px rgba(255,255,255,0.25)",
                  color: "transparent",
                }}
              >
                MARKETING
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.54, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black leading-[0.92] tracking-[-0.03em] text-white flex items-end gap-4 md:gap-6 flex-wrap"
                style={{ fontSize: "clamp(3.2rem, 10.5vw, 9.5rem)" }}
              >
                {t("hero.titleHighlight", "AGENTLIGI")}
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center justify-center w-[clamp(4rem,8vw,8rem)] h-[clamp(4rem,8vw,8rem)] rounded-full bg-primary mb-1"
                >
                  <ArrowUpRight className="w-[35%] h-[35%] text-white" />
                </motion.span>
              </motion.h1>
            </div>
          </div>

          {/* Bottom info row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="mt-14 md:mt-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
          >
            <div className="max-w-md">
              <p className="text-white/50 text-lg leading-relaxed">
                {t("hero.subtitle", "Ijtimoiy tarmoqlar orqali brendingizni o'stiramiz. Real natijalarga kafolatli yondashuvimiz bilan.")}
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <MagBtn href="/contact" variant="solid">
                  {t("hero.cta1", "Bepul konsultatsiya")}
                  <ArrowRight className="w-4 h-4" />
                </MagBtn>
                <MagBtn href="/cases" variant="outline">
                  {t("hero.cta2", "Ishlarimiz")}
                </MagBtn>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 md:gap-12">
              {[
                { end: 500, suffix: "+", label: t("hero.stat1", "Mijozlar") },
                { end: 98, suffix: "%", label: t("hero.stat2", "Mamnunlik") },
                { end: 5, suffix: "+", label: t("hero.stat3", "Yil tajriba") },
              ].map((s, i) => {
                const { count, ref } = useCounterAnimation({ end: s.end, duration: 2000 });
                return (
                  <div key={i} ref={ref as React.RefObject<HTMLDivElement>} className="flex flex-col gap-1">
                    <span className="font-display font-black text-3xl md:text-4xl text-white tabular-nums leading-none">
                      {count}<span className="text-primary">{s.suffix}</span>
                    </span>
                    <span className="font-mono text-[11px] text-white/30 uppercase tracking-wider">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="relative z-10 px-6 md:px-12 pb-8 flex items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-white/25" />
          </motion.div>
          <span className="font-mono text-[11px] text-white/20 uppercase tracking-[0.2em]">Scroll</span>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          TICKER  —  neon moving strip
      ═══════════════════════════════════════════════ */}
      <div className="bg-primary py-4 overflow-hidden relative">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity }}
          className="flex whitespace-nowrap items-center gap-10"
        >
          {Array(12).fill([
            "500+ MIJOZ", "98% MAMNUNLIK", "5+ YIL TAJRIBA",
            "INSTAGRAM", "YOUTUBE", "TARGETING", "CONTENT", "STRATEGIYA",
          ]).flat().map((item, i) => (
            <span key={i} className="font-display font-bold text-sm text-white/90 uppercase tracking-[0.12em] flex items-center gap-10">
              {item}
              <span className="text-white/30 mx-2">◆</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════
          SERVICES  —  dark accordion list
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#0D0D14] py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-16 md:mb-20">
            <R>
              <p className="font-mono text-xs text-primary uppercase tracking-[0.2em] mb-4">
                {t("sections.services", "Xizmatlar")}
              </p>
              <h2
                className="font-display font-black text-white leading-[0.95] tracking-[-0.02em]"
                style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
              >
                Biz nima <br />
                <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)", color: "transparent" }}>qilamiz?</span>
              </h2>
            </R>
            <R delay={0.15} className="md:max-w-xs md:pt-14">
              <p className="text-white/40 leading-relaxed">
                {t("home.servicesSubtitle", "Har bir platforma uchun alohida strategiya va kafolatlangan natija bilan ishlaymiz.")}
              </p>
            </R>
          </div>

          {/* Accordion rows */}
          <div className="border-t border-white/10">
            {servicesQuery.isLoading ? (
              <div className="space-y-px">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-20 bg-white/3 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              servicesQuery.data?.map((svc, i) => {
                const sc = getSvcContent(svc.content, lang);
                return (
                  <SvcRow
                    key={svc.id}
                    num={String(i + 1).padStart(2, "0")}
                    slug={svc.slug || ""}
                    icon={getSvcIcon(svc.slug)}
                    title={sc.title}
                    desc={sc.description}
                    delay={i * 0.05}
                  />
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          STATS  —  brutalist dark
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#08080E] py-24 md:py-32 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-white/8">
            <R className="lg:pr-10"><BigStat end={500} suffix="+" label={t("hero.stat1", "Mijozlar")} /></R>
            <R delay={0.1} className="lg:px-10 pt-10 lg:pt-0"><BigStat end={98} suffix="%" label={t("hero.stat2", "Mamnunlik")} /></R>
            <R delay={0.2} className="lg:px-10 pt-10 lg:pt-0"><BigStat end={120} suffix="M+" label={t("home.stat4", "Umumiy reach")} /></R>
            <R delay={0.3} className="lg:pl-10 pt-10 lg:pt-0"><BigStat end={5} suffix="+" label={t("hero.stat3", "Yil tajriba")} /></R>
          </div>

          <R delay={0.1} className="mt-20 pt-12 border-t border-white/8">
            <div className="flex flex-wrap gap-3">
              {[
                t("home.whyTag1", "Kafolatlangan natija"),
                t("home.whyTag2", "24/7 qo'llab-quvvatlash"),
                t("home.whyTag3", "Real hisobotlar"),
                t("home.whyTag4", "Tajribali jamoa"),
                t("home.whyTag5", "Tez ishga tushirish"),
                t("home.whyTag6", "Shaffof narxlar"),
              ].map((tag, i) => (
                <div key={i} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-default">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-sm text-white/60 font-medium">{tag}</span>
                </div>
              ))}
            </div>
          </R>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW WE WORK  —  numbered horizontal steps
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#0D0D14] py-24 md:py-32 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <R className="mb-16 md:mb-20">
            <p className="font-mono text-xs text-primary uppercase tracking-[0.2em] mb-4">
              {t("home.processLabel", "Qanday ishlashimiz")}
            </p>
            <h2
              className="font-display font-black text-white leading-[0.95] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
            >
              4 qadamda <br />
              <span className="text-primary">natijaga</span>
            </h2>
          </R>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/8 rounded-3xl overflow-hidden">
            {[
              { n: "01", icon: Search, title: t("home.process1Title", "Tahlil"), desc: t("home.process1Desc", "Biznesingiz, raqobatchilar va auditoriyani chuqur o'rganamiz") },
              { n: "02", icon: Lightbulb, title: t("home.process2Title", "Strategiya"), desc: t("home.process2Desc", "Maqsadlarga moslashtirilgan marketing yo'l xaritasini tuzamiz") },
              { n: "03", icon: Zap, title: t("home.process3Title", "Ishga tushirish"), desc: t("home.process3Desc", "Tez va samarali tarzda barcha kanallarni aktivlashtirамiz") },
              { n: "04", icon: LineChart, title: t("home.process4Title", "O'sish"), desc: t("home.process4Desc", "Natijalarni kuzatib, doimiy optimizatsiya va o'sish ta'minlaymiz") },
            ].map(({ n, icon: Icon, title, desc }, i) => (
              <R key={i} delay={i * 0.1}>
                <div className={cn(
                  "p-8 md:p-10 h-full border-white/8 hover:bg-white/3 transition-colors duration-300",
                  i < 3 && "border-b md:border-b-0 md:border-r",
                )}>
                  <div className="flex items-start justify-between mb-8">
                    <span className="font-mono text-5xl font-black text-white/8 leading-none">{n}</span>
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-3">{title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CASE STUDIES  —  light section
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F4F4F7] py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-14">
            <R>
              <p className="font-mono text-xs text-primary uppercase tracking-[0.2em] mb-4">
                {t("sections.cases", "Keyslar")}
              </p>
              <h2
                className="font-display font-black text-[#0A0A0F] leading-[0.95] tracking-[-0.02em]"
                style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
              >
                Natijalarni <br />ko'rsatamiz
              </h2>
            </R>
            <R delay={0.1}>
              <Link
                href="/cases"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-[#0A0A0F]/20 text-[#0A0A0F] font-bold text-sm hover:border-primary hover:text-primary transition-all"
              >
                Barcha keyslar
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </R>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(casesQuery.data?.slice(0, 3) || [0,1,2]).map((cs, idx) => {
              const item = typeof cs === "number" ? null : cs as typeof cs & { content?: unknown; industry?: string };
              const cc = item ? getCaseContent(item.content, lang) : null;
              const imgs = [
                "photo-1611162617474-5b21e879e113",
                "photo-1542744095-fcf48d80b0fd",
                "photo-1551288049-bebda4e38f71",
              ];
              return (
                <R key={idx} delay={idx * 0.1}>
                  <div className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-[#E0E0E6] cursor-pointer">
                    <img
                      src={`https://images.unsplash.com/${imgs[idx]}?w=800&q=80`}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                      loading="lazy"
                    />
                    {/* Default overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Bottom content */}
                    <div className="absolute inset-x-0 bottom-0 p-7">
                      {item && (
                        <span className="font-mono text-xs text-primary uppercase tracking-widest mb-2 block">
                          {item.industry}
                        </span>
                      )}
                      <h3 className="font-display font-bold text-xl text-white mb-2">
                        {item?.client || `Keys ${idx + 1}`}
                      </h3>
                      <p className="text-white/60 text-sm line-clamp-2 mb-4">
                        {cc?.description || ""}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item && Object.entries(item.metrics || {}).slice(0, 2).map(([k, v]) => (
                          <span key={k} className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold border border-white/10">
                            {String(v)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hover: full overlay with link */}
                    <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
                      <Link
                        href="/cases"
                        className="flex flex-col items-center gap-3 text-white"
                      >
                        <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center">
                          <ArrowUpRight className="w-7 h-7" />
                        </div>
                        <span className="font-bold text-lg">Ko'rish</span>
                      </Link>
                    </div>
                  </div>
                </R>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TESTIMONIALS  —  dark, magazine style
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#08080E] py-24 md:py-32 border-t border-white/5 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <R className="flex items-center gap-5 mb-16">
            <Quote className="w-10 h-10 text-primary/40 shrink-0" />
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-[0.2em] mb-1">
                {t("sections.testimonials", "Fikrlar")}
              </p>
              <h2
                className="font-display font-black text-white leading-none tracking-[-0.02em]"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
              >
                Mijozlarimiz gapiradi
              </h2>
            </div>
          </R>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 1.5 },
              1024: { slidesPerView: 2.3 },
              1280: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            grabCursor
            className="pb-12 !overflow-visible"
          >
            {[
              { name: "Sardor Alimov", role: "CEO, TechStore UZ", img: "photo-1472099645785-5658abf4ff4e", q: "BlueCore bilan ishlashdan oldin Instagram'da 2000 ta followermiz bor edi. 6 oyda 45,000 ga yetdik!" },
              { name: "Dilnoza Yusupova", role: "Marketing Dir, Artel", img: "photo-1438761681033-6461ffad8d80", q: "Targeting kampaniyasi orqali CPL ni 3 barobar tushirdik. Kasb mutaxassislari!" },
              { name: "Bobur Toshmatov", role: "Founder, AgroMarket", img: "photo-1507003211169-0a1dd7228f2d", q: "Strategiyalari juda aniq va hisobotlari shaffof. Har oyda o'sishni ko'rib turamiz." },
              { name: "Malika Rahimova", role: "CMO, Payme", img: "photo-1494790108377-be9c29b29330", q: "Content sifati va ijodkorlik bo'yicha Markaziy Osiyo'da eng yaxshi jamoa deb hisoblayman." },
              { name: "Jasur Mirzayev", role: "CEO, TechHub UZ", img: "photo-1506794778202-cad84cf45f1d", q: "Reklama xarajatlarimiz 40% kamaydi, konversiya esa 2.5x oshdi. Natija so'zlaydi." },
            ].map((p, i) => (
              <SwiperSlide key={i}>
                <div className="rounded-3xl border border-white/8 bg-white/3 p-7 md:p-8 flex flex-col gap-6 h-full hover:border-primary/25 hover:bg-white/5 transition-all duration-300">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-primary fill-primary" />)}
                  </div>
                  <p className="text-white/70 leading-relaxed italic flex-1 text-base">"{p.q}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                    <img
                      src={`https://images.unsplash.com/${p.img}?w=80&q=75`}
                      alt={p.name}
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <p className="font-bold text-white text-sm">{p.name}</p>
                      <p className="font-mono text-xs text-white/30">{p.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA  —  full-width dark with gradient
      ═══════════════════════════════════════════════ */}
      <section className="relative bg-[#0D0D14] py-24 md:py-32 overflow-hidden border-t border-white/5">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left */}
            <R>
              <p className="font-mono text-xs text-primary uppercase tracking-[0.2em] mb-5">
                {t("home.countdownLabel", "Chegirma tugashiga")}
              </p>
              <h2
                className="font-display font-black text-white leading-[0.95] tracking-[-0.02em] mb-8"
                style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
              >
                {t("home.ctaTitle", "Proyektingizni")} <br />
                <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)", color: "transparent" }}>
                  bugun boshlang
                </span>
              </h2>
              <p className="text-white/45 text-lg leading-relaxed mb-10 max-w-md">
                {t("home.ctaSubtitle", "Bepul konsultatsiya oling va birinchi oyda natijaga erishish yo'lida birinchi qadamni qo'ying.")}
              </p>

              {/* Countdown */}
              <div className="inline-flex gap-2 md:gap-3 p-4 rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm">
                {[
                  { l: t("home.countdown.days", "kun"), v: timeLeft.d },
                  { l: t("home.countdown.hours", "soat"), v: timeLeft.h },
                  { l: t("home.countdown.minutes", "daqiqa"), v: timeLeft.m },
                  { l: t("home.countdown.seconds", "soniya"), v: timeLeft.s },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center w-14 md:w-16">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={item.v}
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 8, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="font-mono font-black text-2xl md:text-3xl text-white leading-none"
                      >
                        {String(item.v).padStart(2, "0")}
                      </motion.span>
                    </AnimatePresence>
                    <span className="font-mono text-[10px] text-white/30 uppercase mt-1.5">{item.l}</span>
                  </div>
                ))}
              </div>
            </R>

            {/* Right — form */}
            <R delay={0.15}>
              <div className="rounded-3xl border border-white/10 bg-white/4 backdrop-blur-sm p-8 md:p-10">
                <LeadForm source="home_footer" />
              </div>
            </R>
          </div>
        </div>
      </section>

    </main>
  );
}
