import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, User, ChevronDown, Instagram, Youtube, Facebook, BarChart2, Lightbulb, Film, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useMagneticHover } from "@/hooks/useMagneticHover";

const SERVICE_ICONS = [Instagram, Youtube, Facebook, BarChart2, Lightbulb, Film];

function BlueCoreLogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="bgrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A4F8A" />
          <stop offset="0.5" stopColor="#0077CC" />
          <stop offset="1" stopColor="#00C4FF" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#bgrad)" />
      <path d="M11 10h10.5c3.5 0 6 2 6 5.2 0 1.8-.9 3.2-2.2 4 1.8.7 3 2.3 3 4.4C28.3 27.2 25.6 30 22 30H11V10z" fill="white" />
      <path d="M15.5 14v5h5.5c1.4 0 2.4-.9 2.4-2.5S22.4 14 21 14h-5.5zM15.5 22.5v5.5H22c1.6 0 2.7-1 2.7-2.7 0-1.7-1.1-2.8-2.7-2.8h-6.5z" fill="url(#bgrad)" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.14 13.9l-2.956-.924c-.64-.203-.654-.64.136-.95l11.57-4.461c.534-.194 1.001.13.804.656z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-6 flex flex-col justify-center items-center gap-[5px] cursor-pointer">
      <motion.span
        animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-6 h-[2px] bg-foreground rounded-full block origin-center"
      />
      <motion.span
        animate={open ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="w-6 h-[2px] bg-foreground rounded-full block"
      />
      <motion.span
        animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-6 h-[2px] bg-foreground rounded-full block origin-center"
      />
    </div>
  );
}

function MagneticCTAButton({ children, href }: { children: React.ReactNode; href: string }) {
  const ref = useMagneticHover<HTMLDivElement>({ strength: 12 });
  return (
    <div ref={ref} className="hidden lg:block">
      <Link
        href={href}
        className="group flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-primary/30 hover:shadow-lg shimmer-btn"
      >
        {children}
      </Link>
    </div>
  );
}

const SOCIAL_LINKS = [
  {
    href: "https://wa.me/998911419988",
    label: "WhatsApp",
    icon: WhatsAppIcon,
    color: "text-green-500 hover:bg-green-500/10 hover:text-green-400",
  },
  {
    href: "https://t.me/bluecore_smm",
    label: "Telegram",
    icon: TelegramIcon,
    color: "text-sky-400 hover:bg-sky-400/10 hover:text-sky-300",
  },
  {
    href: "https://instagram.com/bluecore.uz",
    label: "Instagram",
    icon: InstagramIcon,
    color: "text-pink-500 hover:bg-pink-500/10 hover:text-pink-400",
  },
];

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollBlur, setScrollBlur] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const servicesRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 20);
      setScrollBlur(Math.min(y / 8, 24));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const serviceItems = [
    { icon: Instagram, href: "/services#instagram", label: t('nav.megaMenu.instagram') },
    { icon: Youtube, href: "/services#youtube", label: t('nav.megaMenu.youtube') },
    { icon: Facebook, href: "/services#facebook", label: t('nav.megaMenu.facebook') },
    { icon: BarChart2, href: "/services#targeting", label: t('nav.megaMenu.targeting') },
    { icon: Lightbulb, href: "/services#strategy", label: t('nav.megaMenu.strategy') },
    { icon: Film, href: "/services#content", label: t('nav.megaMenu.content') },
  ];

  const navLinks = [
    { href: "/", label: t('nav.home') },
    { href: "/services", label: t('nav.services'), hasMega: true },
    { href: "/cases", label: t('nav.cases') },
    { href: "/about", label: t('nav.about') },
    { href: "/blog", label: t('nav.blog') },
  ];

  return (
    <>
      <header
        style={{
          backdropFilter: isScrolled ? `blur(${Math.min(scrollBlur, 20)}px) saturate(180%)` : `blur(8px) saturate(140%)`,
          WebkitBackdropFilter: isScrolled ? `blur(${Math.min(scrollBlur, 20)}px) saturate(180%)` : `blur(8px) saturate(140%)`,
        }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
          isScrolled
            ? "border-border/60 shadow-lg shadow-black/10 py-3 bg-background/80"
            : "border-white/10 py-4 bg-background/60"
        )}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary/60 to-accent/0 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 z-50 relative group shrink-0">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <BlueCoreLogoMark className="w-9 h-9" />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-lg text-foreground tracking-tight">
                Blue<span className="text-primary">Core</span><span className="text-accent">.</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-5">
              {navLinks.map((link) => (
                <li key={link.href} ref={link.hasMega ? servicesRef : undefined} className="relative">
                  {link.hasMega ? (
                    <button
                      onClick={() => setServicesOpen(v => !v)}
                      onMouseEnter={() => setServicesOpen(true)}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary relative py-2 flex items-center gap-1",
                        location.startsWith("/services") ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", servicesOpen && "rotate-180")} />
                      {location.startsWith("/services") && (
                        <motion.div layoutId="activeNav" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary relative py-2",
                        location === link.href ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                      {location === link.href && (
                        <motion.div layoutId="activeNav" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                      )}
                    </Link>
                  )}

                  {link.hasMega && (
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          onMouseLeave={() => setServicesOpen(false)}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] glass-panel rounded-2xl shadow-2xl overflow-hidden z-[55] p-4"
                        >
                          <p className="text-xs font-mono font-bold uppercase text-muted-foreground tracking-widest px-2 mb-3">
                            {t('nav.services')}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {serviceItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setServicesOpen(false)}
                                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/80 transition-colors group"
                                >
                                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                                    <Icon className="w-5 h-5 text-primary" />
                                  </div>
                                  <span className="text-sm font-medium text-foreground leading-tight">{item.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                          <div className="mt-3 pt-3 border-t border-border">
                            <Link
                              href="/services"
                              onClick={() => setServicesOpen(false)}
                              className="flex items-center justify-between w-full px-3 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:bg-primary/90 transition-colors"
                            >
                              <span>{t('nav.viewAll')}</span>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 border-l border-border pl-4">
              {/* Social icon buttons */}
              <div className="flex items-center gap-1">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-lg transition-all",
                      s.color
                    )}
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>

              <div className="w-px h-5 bg-border" />

              <div className="flex items-center gap-1 bg-muted/80 p-1 rounded-lg">
                {['uz', 'ru', 'en'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={cn(
                      "px-2 py-1 text-xs font-mono font-semibold uppercase rounded-md transition-all",
                      i18n.language.startsWith(lang)
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {isAuthenticated ? (
                <Link href="/cabinet" className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-all text-sm">
                  <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center text-white text-xs font-black">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden lg:inline">{t('nav.cabinet', 'Kabinet')}</span>
                </Link>
              ) : (
                <Link href="/login" className="flex items-center gap-2 px-3 py-2 bg-muted/80 text-foreground font-medium rounded-xl hover:bg-muted transition-all text-sm">
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">{t('nav.login', 'Kirish')}</span>
                </Link>
              )}

              <MagneticCTAButton href="/contact">
                <span>{t('hero.cta1', 'Konsultatsiya')}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticCTAButton>
            </div>
          </nav>

          {/* Mobile right: social icons + hamburger */}
          <div className="md:hidden flex items-center gap-1.5 z-50 relative">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-xl transition-all border border-transparent",
                  s.color
                )}
              >
                <s.icon className="w-[18px] h-[18px]" />
              </a>
            ))}
            <button
              className="w-10 h-10 flex items-center justify-center text-foreground rounded-xl hover:bg-muted/60 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <HamburgerIcon open={mobileMenuOpen} />
            </button>
          </div>
        </div>

      </header>

      {/* Mobile Menu — rendered outside <header> to avoid z-index stacking context bug */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              key="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[55] md:hidden bg-foreground/20 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              key="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.2 }}
              onDragEnd={(_e, info) => {
                if (info.offset.x > 80 || info.velocity.x > 300) {
                  setMobileMenuOpen(false);
                }
              }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[360px] z-[56] md:hidden flex flex-col bg-background border-l border-border shadow-2xl overflow-y-auto"
            >
                {/* Accent orbs */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/3 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border relative z-10">
                  <div className="flex items-center gap-2">
                    <BlueCoreLogoMark className="w-8 h-8" />
                    <span className="font-display font-bold text-base text-foreground">
                      Blue<span className="text-primary">Core</span><span className="text-accent">.</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-all text-muted-foreground"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <ul className="flex flex-col px-4 py-4 gap-0.5 relative z-10">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between w-full text-base font-semibold py-3.5 px-4 rounded-xl transition-all",
                          location === link.href || (link.hasMega && location.startsWith("/services"))
                            ? "text-primary bg-primary/10"
                            : "text-foreground hover:text-primary hover:bg-muted/60"
                        )}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="w-4 h-4 opacity-40" />
                      </Link>
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + navLinks.length * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between w-full text-base font-semibold py-3.5 px-4 rounded-xl text-accent hover:bg-accent/10 transition-all"
                    >
                      <span>{t('nav.contact')}</span>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </Link>
                  </motion.li>
                </ul>

                <div className="px-4 pb-6 mt-auto space-y-3 relative z-10">
                  <div className="h-px bg-border" />

                  {/* Auth buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-2"
                  >
                    {isAuthenticated ? (
                      <Link
                        href="/cabinet"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary font-semibold rounded-xl text-sm hover:bg-primary/20 transition-all border border-primary/20"
                      >
                        <User className="w-4 h-4" />
                        {t('nav.cabinet', 'Kabinet')}
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-muted text-foreground font-semibold rounded-xl text-sm hover:bg-muted/80 transition-all border border-border"
                        >
                          <User className="w-4 h-4" />
                          {t('nav.login', 'Kirish')}
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary font-semibold rounded-xl text-sm hover:bg-primary/20 transition-all border border-primary/20"
                        >
                          <UserPlus className="w-4 h-4" />
                          {t('nav.register', "Ro'yxat")}
                        </Link>
                      </>
                    )}
                  </motion.div>

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Link
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white text-center font-bold rounded-xl text-sm shadow-lg shadow-primary/20"
                    >
                      {t('hero.cta1', 'Konsultatsiya olish')}
                    </Link>
                  </motion.div>

                  {/* Language */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-2"
                  >
                    {['uz', 'ru', 'en'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          changeLanguage(lang);
                          setMobileMenuOpen(false);
                        }}
                        className={cn(
                          "flex-1 py-2.5 rounded-lg font-bold uppercase text-xs border transition-all",
                          i18n.language.startsWith(lang)
                            ? "bg-primary text-white border-primary"
                            : "bg-muted/50 text-muted-foreground border-border hover:border-primary/30"
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>

                  {/* Social icons */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="flex justify-center gap-4 pt-2"
                  >
                    {SOCIAL_LINKS.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className={cn("w-10 h-10 flex items-center justify-center rounded-xl border border-border transition-all", s.color)}
                      >
                        <s.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
    </>
  );
}
