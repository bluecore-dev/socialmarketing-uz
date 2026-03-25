import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Instagram, Youtube, Send, MessageCircle } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-foreground text-muted pt-16 pb-24 md:pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

      {/* Mobile luxury gradient accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none md:hidden" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none md:hidden" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Desktop: multi-column | Mobile: premium single-column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-10 lg:gap-16 mb-12">
          
          {/* Brand column */}
          <div className="space-y-4 pb-8 md:pb-0 footer-mobile-section">
            <Link href="/" className="flex items-center gap-2">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-9 w-9">
                <defs>
                  <linearGradient id="fggrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4A8FCA" />
                    <stop offset="0.5" stopColor="#3399DD" />
                    <stop offset="1" stopColor="#00C4FF" />
                  </linearGradient>
                </defs>
                <rect width="40" height="40" rx="10" fill="url(#fggrad)" />
                <path d="M11 10h10.5c3.5 0 6 2 6 5.2 0 1.8-.9 3.2-2.2 4 1.8.7 3 2.3 3 4.4C28.3 27.2 25.6 30 22 30H11V10z" fill="white" />
                <path d="M15.5 14v5h5.5c1.4 0 2.4-.9 2.4-2.5S22.4 14 21 14h-5.5zM15.5 22.5v5.5H22c1.6 0 2.7-1 2.7-2.7 0-1.7-1.1-2.8-2.7-2.8h-6.5z" fill="url(#fggrad)" />
              </svg>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                Blue<span className="text-sky-300">Core</span><span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com/bluecore.uz" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:-translate-y-1" aria-label="Instagram">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="https://youtube.com/@bluecore.uz" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:-translate-y-1" aria-label="YouTube">
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a href="https://t.me/bluecore_smm" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-sky-500/20 hover:border-sky-500/40 transition-all duration-300 hover:-translate-y-1" aria-label="Telegram">
                <Send className="w-5 h-5 text-white" />
              </a>
              <a href="https://wa.me/998911419988" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          <div className="pb-8 md:pb-0 footer-mobile-section">
            <h4 className="text-white font-semibold mb-5 uppercase tracking-wider text-sm">{t('footer.menu')}</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-muted-foreground hover:text-accent transition-colors">{t('nav.home')}</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-accent transition-colors">{t('nav.services')}</Link></li>
              <li><Link href="/cases" className="text-muted-foreground hover:text-accent transition-colors">{t('nav.cases')}</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-accent transition-colors">{t('nav.about')}</Link></li>
            </ul>
          </div>

          <div className="pb-8 md:pb-0 footer-mobile-section">
            <h4 className="text-white font-semibold mb-5 uppercase tracking-wider text-sm">{t('footer.services')}</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="hover:text-accent transition-colors cursor-pointer">{t('footer.serviceItems.smm')}</li>
              <li className="hover:text-accent transition-colors cursor-pointer">{t('footer.serviceItems.targeting')}</li>
              <li className="hover:text-accent transition-colors cursor-pointer">{t('footer.serviceItems.content')}</li>
              <li className="hover:text-accent transition-colors cursor-pointer">{t('footer.serviceItems.reels')}</li>
            </ul>
          </div>

          <div className="pb-8 md:pb-0 footer-mobile-section-last">
            <h4 className="text-white font-semibold mb-5 uppercase tracking-wider text-sm">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>{t('footer.address')}</li>
              <li><a href="tel:+998911419988" className="hover:text-accent transition-colors font-semibold text-white">+998 91 141 99 88</a></li>
              <li><a href="mailto:info@socialmarketing.uz" className="hover:text-accent transition-colors">info@socialmarketing.uz</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BlueCore Agency. {t('common.allRightsReserved')}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.publicOffer')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
