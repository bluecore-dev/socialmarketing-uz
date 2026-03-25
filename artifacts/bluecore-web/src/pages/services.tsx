import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { useGetServices } from "@workspace/api-client-react";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

function getLocalizedContent(content: any, lang: string) {
  if (!content) return { title: "", description: "", features: [] };
  const obj = content[lang] || content["uz"] || content["en"] || content["ru"] || {};
  return { title: obj.title || "", description: obj.description || "", features: obj.features || [] };
}

export default function Services() {
  const { t, i18n } = useTranslation();
  const servicesQuery = useGetServices();

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6">Bizning <span className="text-primary">Xizmatlar</span></h1>
          <p className="text-xl text-muted-foreground">Biznesingizni ijtimoiy tarmoqlarda rivojlantirish uchun to'liq yechimlar majmuasi.</p>
        </div>

        {/* Detailed Services List */}
        <div className="space-y-24 mb-32">
          {servicesQuery.data?.map((service, index) => {
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
                    {lc.features.map((feat: string, i: number) => (
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
                      Buyurtma berish <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pricing Packages */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">SMM Paketlar</h2>
            <p className="text-muted-foreground text-lg">O'z biznesingizga mos tarifni tanlang</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Start", price: "300$", desc: "Kichik biznes va shaxsiy bloglar uchun", features: ["15 ta post/oy", "10 ta hikoya/oy", "Asosiy dizayn", "Oylik hisobot"] },
              { name: "Business", price: "600$", desc: "Rivojlanayotgan kompaniyalar uchun ideal", pop: true, features: ["20 ta post/oy", "20 ta hikoya/oy", "Premium dizayn", "Targeting sozlash", "Reels/TikTok videolar"] },
              { name: "Pro", price: "1000$+", desc: "Katta brendlar uchun to'liq yechim", features: ["Cheksiz kontent", "Professional prodakshn", "Kengaytirilgan tahlil", "Shaxsiy menejer 24/7"] },
            ].map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-3xl p-8 border ${pkg.pop ? 'bg-primary text-white border-primary shadow-2xl scale-105' : 'bg-card text-foreground border-border shadow-lg'}`}
              >
                {pkg.pop && <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-4">Eng mashhur</span>}
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className={`text-sm mb-6 ${pkg.pop ? 'text-white/80' : 'text-muted-foreground'}`}>{pkg.desc}</p>
                <div className="text-4xl font-black mb-8">{pkg.price}<span className={`text-lg font-normal ${pkg.pop ? 'text-white/70' : 'text-muted-foreground'}`}>/oy</span></div>
                
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <Check className={`w-5 h-5 ${pkg.pop ? 'text-accent' : 'text-primary'}`} />
                      <span className={pkg.pop ? 'text-white/90' : 'text-foreground/80'}>{f}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/contact" className={`block w-full py-3 rounded-xl text-center font-bold transition-all ${pkg.pop ? 'bg-white text-primary hover:bg-gray-100' : 'bg-muted text-foreground hover:bg-primary hover:text-white'}`}>
                  Tanlash
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
