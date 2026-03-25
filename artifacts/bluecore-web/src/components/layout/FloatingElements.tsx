import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Home, Briefcase, User, LayoutGrid, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingElements() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [showCookie, setShowCookie] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);
  
  useEffect(() => {
    // Check cookie consent
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setTimeout(() => setShowCookie(true), 2000);
    }

    // Exit intent logic
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitIntent) {
        setShowExitIntent(true);
        setHasShownExitIntent(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
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
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/998911419988"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-8 right-6 z-40 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors"
      >
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30"></div>
        <Phone className="w-6 h-6 z-10" />
      </a>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-border px-4 py-3 pb-safe">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 w-16">
                <item.icon className={cn("w-6 h-6 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </Link>
            )
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
            className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-auto md:w-96 bg-card border border-border p-4 rounded-2xl shadow-2xl z-50"
          >
            <p className="text-sm text-card-foreground mb-4">
              Saytimizda foydalanuvchi tajribasini yaxshilash uchun cookie fayllaridan foydalanamiz.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowCookie(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Yopish</button>
              <button onClick={acceptCookies} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90">Qabul qilish</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitIntent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative"
            >
              <button 
                onClick={() => setShowExitIntent(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Ketyapsizmi? Kutib turing!</h3>
                <p className="text-muted-foreground mb-6">
                  Bizda sizning biznesingiz uchun maxsus taklif bor. Bepul konsultatsiya oling va raqobatchilaringizdan o'zib keting.
                </p>
                <Link 
                  href="/contact"
                  onClick={() => setShowExitIntent(false)}
                  className="block w-full py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Bepul Konsultatsiya
                </Link>
                <button 
                  onClick={() => setShowExitIntent(false)}
                  className="mt-4 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Yo'q, rahmat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
