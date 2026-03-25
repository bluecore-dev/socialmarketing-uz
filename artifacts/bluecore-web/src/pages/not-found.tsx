import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-8 inline-block">
            <span className="text-[160px] md:text-[220px] font-black leading-none text-primary/10 select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl md:text-8xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                404
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            {t('pages.notFound.title', 'Sahifa topilmadi')}
          </h1>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            {t('pages.notFound.message', "Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan.")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg"
          >
            <Home className="w-5 h-5" />
            {t('pages.notFound.goHome', 'Bosh sahifaga qaytish')}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-8 py-4 bg-muted text-foreground font-bold rounded-2xl hover:bg-muted/70 hover:-translate-y-0.5 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('pages.notFound.goBack', 'Orqaga qaytish')}
          </button>
        </motion.div>
      </div>
    </main>
  );
}
