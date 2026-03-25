import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Instagram, Youtube, Send, MessageCircle } from "lucide-react"; // Using Send as Telegram placeholder, MessageCircle as TikTok placeholder

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-foreground text-muted pt-16 pb-24 md:pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-12">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 inline-block">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                B
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                BlueCore<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors hover:-translate-y-1">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors hover:-translate-y-1">
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors hover:-translate-y-1">
                <Send className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors hover:-translate-y-1">
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Menyu</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-muted-foreground hover:text-accent transition-colors">{t('nav.home')}</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-accent transition-colors">{t('nav.services')}</Link></li>
              <li><Link href="/cases" className="text-muted-foreground hover:text-accent transition-colors">{t('nav.cases')}</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-accent transition-colors">{t('nav.about')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Xizmatlar</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="hover:text-accent transition-colors cursor-pointer">SMM Boshqaruv</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Targeting</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Kontent Yaratish</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Reels & TikTok</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Aloqa</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>Toshkent sh., Yunusobod tumani, 14-mavze</li>
              <li><a href="tel:+998911419988" className="hover:text-accent transition-colors font-semibold text-white">+998 91 141 99 88</a></li>
              <li><a href="mailto:info@socialmarketing.uz" className="hover:text-accent transition-colors">info@socialmarketing.uz</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BlueCore Agency. {t('common.allRightsReserved')}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Maxfiylik siyosati</a>
            <a href="#" className="hover:text-white transition-colors">Ommaviy ofera</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
