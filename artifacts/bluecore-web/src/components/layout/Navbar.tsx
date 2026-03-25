import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, User, ChevronDown, Instagram, Youtube, Facebook, BarChart2, Lightbulb, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useMagneticHover } from "@/hooks/useMagneticHover";

const SERVICE_ICONS = [Instagram, Youtube, Facebook, BarChart2, Lightbulb, Film];

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
        className="group flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg glow-border shimmer-btn"
      >
        {children}
      </Link>
    </div>
  );
}

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
          backdropFilter: isScrolled ? `blur(${Math.min(scrollBlur, 20)}px) saturate(180%)` : undefined,
          WebkitBackdropFilter: isScrolled ? `blur(${Math.min(scrollBlur, 20)}px) saturate(180%)` : undefined,
        }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
          isScrolled
            ? "border-border/50 shadow-sm py-3 bg-background/75"
            : "border-transparent py-5 bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 z-50 relative group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -3 }}
              transition={{ duration: 0.2 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg"
            >
              B
            </motion.div>
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
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", servicesOpen && "rotate-180")} />
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

            <div className="flex items-center gap-4 border-l border-border pl-6">
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
                <Link href="/cabinet" className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-all text-sm">
                  <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-white text-xs font-black">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  {t('nav.cabinet', 'Kabinet')}
                </Link>
              ) : (
                <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-muted/80 text-foreground font-semibold rounded-xl hover:bg-muted transition-all text-sm">
                  <User className="w-4 h-4" />
                  {t('nav.login', 'Kirish')}
                </Link>
              )}

              <MagneticCTAButton href="/contact">
                <span>{t('hero.cta1')}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticCTAButton>
            </div>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden z-50 relative p-2 text-foreground touch-target"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <HamburgerIcon open={mobileMenuOpen} />
          </button>
        </div>

        {/* Fullscreen Mobile Menu — clip-path circle reveal + swipe-to-close */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ clipPath: "circle(0% at calc(100% - 2rem) 2rem)", opacity: 0 }}
              animate={{ clipPath: "circle(150% at calc(100% - 2rem) 2rem)", opacity: 1 }}
              exit={{ clipPath: "circle(0% at calc(100% - 2rem) 2rem)", opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.3 }}
              onDragEnd={(_e, info) => {
                if (info.offset.x > 100 || info.velocity.x > 400) {
                  setMobileMenuOpen(false);
                }
              }}
              className="fixed inset-0 bg-background z-40 md:hidden flex flex-col pt-24 px-8 pb-10 overflow-y-auto"
            >
              <ul className="flex flex-col gap-2 mb-8">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.15 + i * 0.07,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block w-full text-3xl font-bold py-3 border-b border-border/50 transition-colors",
                        location === link.href || (link.hasMega && location.startsWith("/services"))
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + navLinks.length * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-3xl font-bold py-3 text-accent border-b border-border/50 hover:text-accent/80 transition-colors"
                  >
                    {t('nav.contact')}
                  </Link>
                </motion.li>
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                className="mt-auto space-y-6"
              >
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-4 bg-primary text-primary-foreground text-center font-bold rounded-2xl text-lg shimmer-btn"
                >
                  {t('hero.cta1')}
                </Link>

                <div>
                  <p className="text-sm text-muted-foreground mb-3 font-mono uppercase tracking-wider">Til / Язык / Language</p>
                  <div className="flex gap-3">
                    {['uz', 'ru', 'en'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          changeLanguage(lang);
                          setMobileMenuOpen(false);
                        }}
                        className={cn(
                          "px-4 py-3 rounded-xl font-bold uppercase flex-1 border transition-all text-sm touch-target",
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
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
