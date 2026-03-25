import { useTranslation } from "react-i18next";
import { LeadForm } from "@/components/LeadForm";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background relative">
      <div className="absolute top-0 right-0 w-1/2 h-full z-0 hidden lg:block">
        <img 
          src={`${import.meta.env.BASE_URL}images/contact-bg.png`}
          alt="Contact background" 
          className="w-full h-full object-cover object-left opacity-90 rounded-l-[4rem] shadow-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6">Biz bilan <span className="text-primary">Bog'laning</span></h1>
          <p className="text-xl text-muted-foreground">Loyiha rejalashtiryapsizmi? Biz bilan bog'laning va biznesingiz uchun eng yaxshi strategiyani topamiz.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
              <h3 className="text-2xl font-bold mb-6">Aloqa ma'lumotlari</h3>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Telefon raqam</p>
                    <a href="tel:+998911419988" className="text-lg font-bold text-foreground hover:text-primary transition-colors">+998 91 141 99 88</a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Elektron pochta</p>
                    <a href="mailto:info@socialmarketing.uz" className="text-lg font-bold text-foreground hover:text-primary transition-colors">info@socialmarketing.uz</a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Manzil</p>
                    <p className="text-lg font-bold text-foreground">Toshkent shahri, Yunusobod tumani, 14-mavze</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-3xl text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-2">Ijtimoiy tarmoqlar</h3>
              <p className="text-white/80 mb-6">Bizni kuzatib boring va so'nggi yangiliklardan xabardor bo'ling.</p>
              <div className="flex gap-4">
                 <a href="#" className="px-6 py-2 bg-white/20 hover:bg-white text-white hover:text-primary rounded-xl font-bold transition-colors backdrop-blur-md">Instagram</a>
                 <a href="#" className="px-6 py-2 bg-white/20 hover:bg-white text-white hover:text-primary rounded-xl font-bold transition-colors backdrop-blur-md">Telegram</a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative">
             <div className="absolute -inset-4 bg-primary/5 blur-2xl rounded-[3rem] -z-10"></div>
             <LeadForm source="contact_page" />
          </div>

        </div>

      </div>
    </main>
  );
}
