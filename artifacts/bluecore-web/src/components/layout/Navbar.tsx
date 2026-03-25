import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, User, ChevronDown, Instagram, Youtube, Facebook, BarChart2, Lightbulb, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const SERVICE_ICONS = [Instagram, Youtube, Facebook, BarChart2, Lightbulb, Film];

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const servicesRef = useRef<HTMLLIElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const serviceItems = [
    { icon: Instagram, href: "/services#instagram", label: "Instagram Marketing" },
    { icon: Youtube, href: "/services#youtube", label: "YouTube Promotion" },
    { icon: Facebook, href: "/services#facebook", label: "Facebook & Meta Ads" },
    { icon: BarChart2, href: "/services#targeting", label: "Targeting & Analytics" },
    { icon: Lightbulb, href: "/services#strategy", label: "SMM Strategy" },
    { icon: Film, href: "/services#content", label: "Content Production" },
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
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled ? "bg-background/80 backdrop-blur-md border-border shadow-sm py-3" : "bg-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 z-50 relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              BlueCore<span className="text-accent">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
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
                      <ChevronDown className={cn("w-4 h-4 transition-transform", servicesOpen && "rotate-180")} />
                      {location.startsWith("/services") && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        />
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
                        <motion.div
                          layoutId="activeNav"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        />
                      )}
                    </Link>
                  )}

                  {/* Mega-menu dropdown */}
                  {link.hasMega && (
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.18 }}
                          onMouseLeave={() => setServicesOpen(false)}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden z-[55] p-4"
                        >
                          <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest px-2 mb-3">
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
                                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                                >
                                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
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
                              <span>{t('common.viewAll', 'Barchasini ko\'rish')}</span>
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

            <div className="flex items-center gap-4 border-l border-border pl-6">
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                {['uz', 'ru', 'en'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={cn(
                      "px-2 py-1 text-xs font-semibold uppercase rounded-md transition-all",
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
                <Link href="/cabinet" className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-all text-sm">
                  <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-white text-xs font-black">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  {t('nav.cabinet', 'Kabinet')}
                </Link>
              ) : (
                <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground font-semibold rounded-xl hover:bg-muted/80 transition-all text-sm">
                  <User className="w-4 h-4" />
                  {t('nav.login', 'Kirish')}
                </Link>
              )}

              <Link href="/contact" className="group hidden lg:flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <span>{t('hero.cta1')}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 relative p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <motion.div
          initial={false}
          animate={{
            opacity: mobileMenuOpen ? 1 : 0,
            pointerEvents: mobileMenuOpen ? "auto" : "none",
          }}
          className="fixed inset-0 bg-background/95 backdrop-blur-xl z-40 md:hidden pt-24 px-6 pb-6 flex flex-col"
        >
          <ul className="flex flex-col gap-6 text-xl font-bold">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block w-full transition-colors",
                    location === link.href || (link.hasMega && location.startsWith("/services"))
                      ? "text-primary"
                      : "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-accent"
              >
                {t('nav.contact')}
              </Link>
            </li>
          </ul>

          <div className="mt-auto pb-8">
            <p className="text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wider">Til / Язык / Language</p>
            <div className="flex gap-3">
              {['uz', 'ru', 'en'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    changeLanguage(lang);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "px-4 py-3 rounded-xl font-bold uppercase flex-1 border transition-all",
                    i18n.language.startsWith(lang)
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-muted text-muted-foreground border-border"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </header>

      {/* Sticky CTA Bar — visible after scrolling past hero */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-4 bg-background/90 backdrop-blur-lg border border-border shadow-2xl rounded-2xl px-6 py-3"
          >
            <span className="text-sm font-medium text-muted-foreground">
              {t('hero.subtitle', '').split('.')[0] || 'Natijaga yo\'naltirilgan SMM'}
            </span>
            <div className="w-px h-5 bg-border" />
            <Link
              href="/contact"
              className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 hover:-translate-y-0.5 transition-all text-sm shadow-md"
            >
              {t('hero.cta1')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
