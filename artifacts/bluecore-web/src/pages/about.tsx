import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Target, Heart, Zap, Award } from "lucide-react";

interface ValueItem {
  title: string;
  desc: string;
}

interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

const VALUE_ICONS = [Target, Zap, Heart, Award];

const TEAM_MEMBERS = [
  { name: "Sardor Aliyev", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { name: "Dilnoza Yusupova", role: "Creative Director", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" },
  { name: "Jasur Nazarov", role: "Head of Targeting", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80" },
  { name: "Maftuna Raximova", role: "Content Manager", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" },
];

function Counter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      let start: number | null = null;
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

  const values = t('pages.about.values', { returnObjects: true }) as ValueItem[];
  const stats = t('pages.about.stats', { returnObjects: true }) as StatItem[];

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6">
              Biz <span className="text-primary">BlueCore</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {t('pages.about.intro')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('pages.about.intro2')}
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
          {Array.isArray(stats) && stats.map((stat, i) => (
            <div key={i} className="bg-card p-8 rounded-3xl border border-border text-center shadow-lg hover:-translate-y-2 transition-transform">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">
                <Counter from={0} to={stat.value} duration={2.5} />{stat.suffix}
              </div>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <Section className="bg-muted/30 rounded-3xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
            <div className="bg-card rounded-2xl p-8 border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-8 -mt-8"></div>
              <Target className="w-12 h-12 text-primary mb-6" />
              <h2 className="text-2xl font-bold text-foreground mb-4">{t('pages.about.mission')}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {t('pages.about.missionText')}
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-accent/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full -mr-8 -mt-8"></div>
              <Zap className="w-12 h-12 text-accent mb-6" />
              <h2 className="text-2xl font-bold text-foreground mb-4">{t('pages.about.vision')}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {t('pages.about.visionText')}
              </p>
            </div>
          </div>
        </Section>

        {/* Values */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t('pages.about.valuesTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.isArray(values) && values.map((v, i) => {
              const Icon = VALUE_ICONS[i] ?? Target;
              return (
                <div key={i} className="bg-muted p-8 rounded-3xl relative overflow-hidden hover:-translate-y-1 transition-transform">
                  <Icon className="w-12 h-12 text-accent mb-6" />
                  <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t('pages.about.team')}</h2>
            <p className="text-lg text-muted-foreground">{t('pages.about.teamSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map((member, i) => (
              <div key={i} className="group bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.img} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-lg font-bold text-foreground mb-1">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
