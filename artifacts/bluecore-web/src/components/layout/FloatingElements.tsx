import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Home, Briefcase, User, LayoutGrid, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingElements() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [showCookie, setShowCookie] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);
  const [showMobileCTA, setShowMobileCTA] = useState(false);
  
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setTimeout(() => setShowCookie(true), 2500);
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitIntent) {
        setShowExitIntent(true);
        setHasShownExitIntent(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    const handleScroll = () => {
      setShowMobileCTA(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasShownExitIntent]);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowCookie(false);
  };

  const navItems = [
    { href: "/", icon: Home, label: t('nav.home') },
    { href: "/services", icon: LayoutGrid, label: t('nav.services') },
    { href: "/cases", icon: Briefcase, label: t('nav.cases') },
    { href: "/contact", icon: User, label: t('nav.contact') },
  ];

  return (
    <>
      {/* Mobile Sticky CTA bar — appears after scrolling past hero */}
      <AnimatePresence>
        {showMobileCTA && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed bottom-[72px] left-4 right-4 z-[45] flex items-center gap-3"
          >
            <Link
              href="/contact"
              className="flex-1 py-3.5 bg-primary text-primary-foreground font-bold text-center rounded-2xl shadow-xl shadow-primary/25 flex items-center justify-center gap-2 shimmer-btn"
            >
              {t('hero.cta1')} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border px-4 py-2 pb-safe">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 min-w-[48px] min-h-[48px] justify-center">
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Cookie Consent */}
      <AnimatePresence>
        {showCookie && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 glass-panel p-4 rounded-2xl shadow-2xl z-50"
          >
            <p className="text-sm text-card-foreground mb-4">
              {t('cookie.message')}
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowCookie(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">{t('cookie.close')}</button>
              <button onClick={acceptCookies} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90">{t('cookie.accept')}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitIntent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative"
            >
              <button 
                onClick={() => setShowExitIntent(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/20 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">{t('exitIntent.title')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('exitIntent.message')}
                </p>
                <Link 
                  href="/contact"
                  onClick={() => setShowExitIntent(false)}
                  className="block w-full py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all shimmer-btn"
                >
                  {t('exitIntent.cta')}
                </Link>
                <button 
                  onClick={() => setShowExitIntent(false)}
                  className="mt-4 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {t('exitIntent.decline')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
