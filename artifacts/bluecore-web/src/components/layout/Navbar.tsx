import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, ChevronRight, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { href: "/", label: t('nav.home') },
    { href: "/services", label: t('nav.services') },
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
                <li key={link.href}>
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
                  Kabinet
                </Link>
              ) : (
                <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground font-semibold rounded-xl hover:bg-muted/80 transition-all text-sm">
                  <User className="w-4 h-4" />
                  Kirish
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
                    location === link.href ? "text-primary" : "text-foreground"
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
    </>
  );
}
