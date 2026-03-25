import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useCreateLead } from "@workspace/api-client-react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "Ism juda qisqa"),
  phone: z.string().min(7, "Telefon noto'g'ri formatda"),
  email: z.string().email("Noto'g'ri email format").optional().or(z.literal("")),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function LeadForm({ source = "website" }: { source?: string }) {
  const { t, i18n } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const createLead = useCreateLead();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    createLead.mutate({
      data: {
        ...data,
        source,
        lang: i18n.language.substring(0, 2),
      }
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      }
    });
  };

  return (
    <div className="bg-card rounded-3xl p-6 md:p-8 shadow-2xl border border-border/50 relative overflow-hidden">
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-card z-10 flex flex-col items-center justify-center text-center p-6"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{t('common.success')}</h3>
            <p className="text-muted-foreground">Tez orada menejerlarimiz siz bilan bog'lanishadi.</p>
            <button 
              onClick={() => setIsSuccess(false)}
              className="mt-8 px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 font-medium"
            >
              Yangi so'rov
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">{t('form.title')}</h3>
        <p className="text-muted-foreground text-sm">{t('form.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">{t('form.name')} *</label>
            <input 
              {...register("name")}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              placeholder="Ali Valiyev"
            />
            {errors.name && <span className="text-destructive text-xs">{errors.name.message}</span>}
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">{t('form.phone')} *</label>
            <input 
              {...register("phone")}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              placeholder="+998 90 123 45 67"
            />
            {errors.phone && <span className="text-destructive text-xs">{errors.phone.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">{t('form.company')}</label>
            <input 
              {...register("company")}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              placeholder="Kompaniya nomi"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">{t('form.service')}</label>
            <select 
              {...register("service")}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none"
            >
              <option value="">Tanlang...</option>
              <option value="smm">SMM Boshqaruv</option>
              <option value="target">Targeting</option>
              <option value="content">Kontent Yaratish</option>
              <option value="design">Dizayn</option>
              <option value="other">Boshqa</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">{t('form.message')}</label>
          <textarea 
            {...register("message")}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
            placeholder="Loyihangiz haqida qisqacha..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={createLead.isPending}
          className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2 text-lg"
        >
          {createLead.isPending ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> {t('form.sending')}</>
          ) : (
            t('form.send')
          )}
        </button>
      </form>
    </div>
  );
}
