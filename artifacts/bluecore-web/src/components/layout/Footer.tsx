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
            <Link href="/" className="flex items-center gap-2 inline-block">
              <img
                src={`${import.meta.env.BASE_URL}images/bluecore-logo.png`}
                alt="BlueCore"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-1">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-1">
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-1">
                <Send className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-1">
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
