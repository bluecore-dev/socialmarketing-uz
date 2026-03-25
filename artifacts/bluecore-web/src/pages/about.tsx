import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Target, Heart, Zap, Award } from "lucide-react";

function Counter({ from, to, duration = 2 }: { from: number, to: number, duration?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      let start = null as number | null;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count}</span>;
}

export default function About() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6">Biz <span className="text-primary">BlueCore</span> agentligimiz</h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              Biz faqatgina postlar joylaydigan SMM agentlik emasmiz. Biz biznesingizni raqamli olamda o'stiruvchi, brendingizga jon kirituvchi va sotuvlaringizni oshiruvchi strategik hamkormiz.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Toshkentda joylashgan jamoamiz yosh, kreativ va natijaga yo'naltirilgan mutaxassislardan iborat. Har bir mijoz uchun o'ziga xos va noyob yondashuvni qo'llaymiz.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-3xl rotate-3 scale-105 opacity-20 blur-xl"></div>
            <img 
              src={`${import.meta.env.BASE_URL}images/about-team.png`}
              alt="BlueCore Team" 
              className="rounded-3xl shadow-2xl relative z-10 w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
          {[
            { label: "Muvaffaqiyatli loyihalar", value: 150, suffix: "+" },
            { label: "Xursand mijozlar", value: 98, suffix: "%" },
            { label: "Jamoa a'zolari", value: 25, suffix: "+" },
            { label: "Bozordagi tajriba", value: 5, suffix: " yil" },
          ].map((stat, i) => (
            <div key={i} className="bg-card p-8 rounded-3xl border border-border text-center shadow-lg hover:-translate-y-2 transition-transform">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">
                <Counter from={0} to={stat.value} duration={2.5} />{stat.suffix}
              </div>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Bizning qadriyatlar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: "Natijaga yo'naltirilganlik", desc: "Biz uchun jarayon emas, yakuniy natija muhim. ROI, CPA, CAC - bizning sevimli so'zlarimiz." },
              { icon: Zap, title: "Innovatsiya", desc: "Doimiy ravishda yangi trendlarni kuzatamiz va birinchilardan bo'lib amaliyotda qo'llaymiz." },
              { icon: Heart, title: "Mijozlarga g'amxo'rlik", desc: "Har bir mijozning biznesini o'z biznesimizdek ko'ramiz va unga jon kuydiramiz." },
              { icon: Award, title: "Sifat va estetik", desc: "Har bir dizayn, har bir tekst, har bir video eng yuqori sifat standartlariga javob beradi." },
            ].map((v, i) => (
              <div key={i} className="bg-muted p-8 rounded-3xl relative overflow-hidden">
                <v.icon className="w-12 h-12 text-accent mb-6" />
                <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
