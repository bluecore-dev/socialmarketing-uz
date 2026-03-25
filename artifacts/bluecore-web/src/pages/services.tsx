import { useTranslation } from "react-i18next";
import { useGetServices } from "@workspace/api-client-react";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface LocalizedContent {
  title: string;
  description: string;
  features?: string[];
}

function getLocalizedContent(content: unknown, lang: string): LocalizedContent {
  if (!content || typeof content !== 'object') return { title: "", description: "", features: [] };
  const c = content as Record<string, Partial<LocalizedContent>>;
  const obj = c[lang] || c["uz"] || c["en"] || c["ru"] || {};
  return { title: obj.title || "", description: obj.description || "", features: obj.features || [] };
}

export default function Services() {
  const { t, i18n } = useTranslation();
  const servicesQuery = useGetServices();
  const services = servicesQuery.data || [];

  const packages = [
    {
      name: "Start",
      price: "300$",
      desc: i18n.language === 'ru' ? 'Для малого бизнеса и личных блогов' : i18n.language === 'en' ? 'For small businesses and personal blogs' : 'Kichik biznes va shaxsiy bloglar uchun',
      features: i18n.language === 'ru'
        ? ["15 постов/мес", "10 историй/мес", "Базовый дизайн", "Ежемесячный отчёт"]
        : i18n.language === 'en'
        ? ["15 posts/mo", "10 stories/mo", "Basic design", "Monthly report"]
        : ["15 ta post/oy", "10 ta hikoya/oy", "Asosiy dizayn", "Oylik hisobot"],
    },
    {
      name: "Business",
      price: "600$",
      desc: i18n.language === 'ru' ? 'Идеально для растущих компаний' : i18n.language === 'en' ? 'Ideal for growing companies' : 'Rivojlanayotgan kompaniyalar uchun ideal',
      pop: true,
      features: i18n.language === 'ru'
        ? ["20 постов/мес", "20 историй/мес", "Премиум дизайн", "Настройка таргетинга", "Reels/TikTok видео"]
        : i18n.language === 'en'
        ? ["20 posts/mo", "20 stories/mo", "Premium design", "Targeting setup", "Reels/TikTok videos"]
        : ["20 ta post/oy", "20 ta hikoya/oy", "Premium dizayn", "Targeting sozlash", "Reels/TikTok videolar"],
    },
    {
      name: "Pro",
      price: "1000$+",
      desc: i18n.language === 'ru' ? 'Полное решение для крупных брендов' : i18n.language === 'en' ? 'Full solution for big brands' : "Katta brendlar uchun to'liq yechim",
      features: i18n.language === 'ru'
        ? ["Безлимитный контент", "Проф. продакшн", "Расширенная аналитика", "Персональный менеджер 24/7"]
        : i18n.language === 'en'
        ? ["Unlimited content", "Professional production", "Advanced analytics", "Personal manager 24/7"]
        : ["Cheksiz kontent", "Professional prodakshn", "Kengaytirilgan tahlil", "Shaxsiy menejer 24/7"],
    },
  ];

  const popularLabel = i18n.language === 'ru' ? 'Самый популярный' : i18n.language === 'en' ? 'Most Popular' : 'Eng mashhur';
  const perMonth = i18n.language === 'ru' ? '/мес' : i18n.language === 'en' ? '/mo' : '/oy';
  const selectLabel = i18n.language === 'ru' ? 'Выбрать' : i18n.language === 'en' ? 'Select' : 'Tanlash';
  const orderLabel = i18n.language === 'ru' ? 'Заказать' : i18n.language === 'en' ? 'Order Now' : 'Buyurtma berish';

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">

        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6">
            {t('pages.services.title').split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-primary">{t('pages.services.title').split(' ').slice(-1)}</span>
          </h1>
          <p className="text-xl text-muted-foreground">{t('pages.services.subtitle')}</p>
        </div>

        <div className="space-y-24 mb-32">
          {services.map((service, index) => {
            const lc = getLocalizedContent(service.content, i18n.language);
            return (
              <motion.div
                key={service.id}
                id={service.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="w-full md:w-1/2">
                  <div className="w-full aspect-video bg-muted rounded-3xl overflow-hidden relative group shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-8xl drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500">{service.icon || '🚀'}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/2 space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">{lc.title}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{lc.description}</p>
                  <ul className="space-y-3 pt-4">
                    {(lc.features || []).map((feat: string, i: number) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-foreground">{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-6">
                    <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                      {orderLabel} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">SMM {i18n.language === 'ru' ? 'Пакеты' : i18n.language === 'en' ? 'Packages' : 'Paketlar'}</h2>
            <p className="text-muted-foreground text-lg">
              {i18n.language === 'ru' ? 'Выберите подходящий тариф для вашего бизнеса' : i18n.language === 'en' ? 'Choose a plan that fits your business' : 'O\'z biznesingizga mos tarifni tanlang'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-3xl p-8 border ${pkg.pop ? 'bg-primary text-white border-primary shadow-2xl scale-105' : 'bg-card text-foreground border-border shadow-lg'}`}
              >
                {pkg.pop && (
                  <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                    {popularLabel}
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className={`text-sm mb-6 ${pkg.pop ? 'text-white/80' : 'text-muted-foreground'}`}>{pkg.desc}</p>
                <div className="text-4xl font-black mb-8">
                  {pkg.price}
                  <span className={`text-lg font-normal ${pkg.pop ? 'text-white/70' : 'text-muted-foreground'}`}>{perMonth}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <Check className={`w-5 h-5 ${pkg.pop ? 'text-accent' : 'text-primary'}`} />
                      <span className={pkg.pop ? 'text-white/90' : 'text-foreground/80'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact" className={`block w-full py-3 rounded-xl text-center font-bold transition-all ${pkg.pop ? 'bg-white text-primary hover:bg-gray-100' : 'bg-muted text-foreground hover:bg-primary hover:text-white'}`}>
                  {selectLabel}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
