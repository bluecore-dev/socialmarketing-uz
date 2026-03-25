import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  uz: {
    translation: {
      nav: {
        home: "Bosh sahifa",
        services: "Xizmatlar",
        cases: "Keyslar",
        about: "Biz haqimizda",
        blog: "Blog",
        contact: "Aloqa",
      },
      hero: {
        badge: "O'zbekistondagi yetakchi SMM agentlik",
        title: "Biznesingizni ijtimoiy tarmoqlarda",
        titleHighlight: "yangi bosqichga olib chiqamiz",
        subtitle: "Strategik yondashuv, kreativ kontent va aniq natijalar orqali brendingizni rivojlantiramiz.",
        cta1: "Konsultatsiya olish",
        cta2: "Ishlarimizni ko'rish",
        stat1: "Muvaffaqiyatli loyihalar",
        stat2: "Mijozlar qoniqishi",
        stat3: "Bozorda tajriba",
      },
      common: {
        readMore: "Batafsil o'qish",
        submit: "Yuborish",
        loading: "Yuklanmoqda...",
        error: "Xatolik yuz berdi",
        empty: "Hozircha ma'lumot yo'q",
        success: "Muvaffaqiyatli yuborildi!",
        allRightsReserved: "Barcha huquqlar himoyalangan.",
      },
      form: {
        title: "Biz bilan bog'laning",
        subtitle: "Loyihangizni muhokama qilish uchun bepul konsultatsiyaga yoziling.",
        name: "Ismingiz",
        phone: "Telefon raqamingiz",
        email: "Elektron pochta (ixtiyoriy)",
        company: "Kompaniya (ixtiyoriy)",
        service: "Qiziqtirgan xizmat",
        message: "Xabaringiz",
        send: "So'rov yuborish",
        sending: "Yuborilmoqda...",
      },
      sections: {
        services: "Bizning Xizmatlar",
        cases: "Muvaffaqiyatli Keyslar",
        testimonials: "Mijozlarimiz Fikri",
        blog: "So'nggi Maqolalar",
        cta: "Loyiha boshlashga tayyormisiz?",
      }
    }
  },
  ru: {
    translation: {
      nav: {
        home: "Главная",
        services: "Услуги",
        cases: "Кейсы",
        about: "О нас",
        blog: "Блог",
        contact: "Контакты",
      },
      hero: {
        badge: "Ведущее SMM-агентство в Узбекистане",
        title: "Выводим ваш бизнес в соцсетях на",
        titleHighlight: "новый уровень",
        subtitle: "Развиваем ваш бренд через стратегический подход, креативный контент и точные результаты.",
        cta1: "Получить консультацию",
        cta2: "Смотреть работы",
        stat1: "Успешных проектов",
        stat2: "Довольных клиентов",
        stat3: "Опыт на рынке",
      },
      common: {
        readMore: "Читать далее",
        submit: "Отправить",
        loading: "Загрузка...",
        error: "Произошла ошибка",
        empty: "Пока нет данных",
        success: "Успешно отправлено!",
        allRightsReserved: "Все права защищены.",
      },
      form: {
        title: "Свяжитесь с нами",
        subtitle: "Запишитесь на бесплатную консультацию для обсуждения вашего проекта.",
        name: "Ваше имя",
        phone: "Номер телефона",
        email: "Email (необязательно)",
        company: "Компания (необязательно)",
        service: "Интересующая услуга",
        message: "Ваше сообщение",
        send: "Отправить заявку",
        sending: "Отправка...",
      },
      sections: {
        services: "Наши Услуги",
        cases: "Успешные Кейсы",
        testimonials: "Отзывы Клиентов",
        blog: "Последние Статьи",
        cta: "Готовы начать проект?",
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        services: "Services",
        cases: "Cases",
        about: "About Us",
        blog: "Blog",
        contact: "Contact",
      },
      hero: {
        badge: "Leading SMM Agency in Uzbekistan",
        title: "Taking your business on social media to the",
        titleHighlight: "next level",
        subtitle: "We grow your brand through strategic approach, creative content, and precise results.",
        cta1: "Get a consultation",
        cta2: "View our work",
        stat1: "Successful projects",
        stat2: "Client satisfaction",
        stat3: "Years of experience",
      },
      common: {
        readMore: "Read more",
        submit: "Submit",
        loading: "Loading...",
        error: "An error occurred",
        empty: "No data available yet",
        success: "Successfully submitted!",
        allRightsReserved: "All rights reserved.",
      },
      form: {
        title: "Contact Us",
        subtitle: "Book a free consultation to discuss your project.",
        name: "Your Name",
        phone: "Phone Number",
        email: "Email (optional)",
        company: "Company (optional)",
        service: "Service of interest",
        message: "Your Message",
        send: "Send Request",
        sending: "Sending...",
      },
      sections: {
        services: "Our Services",
        cases: "Success Cases",
        testimonials: "Client Testimonials",
        blog: "Latest Articles",
        cta: "Ready to start a project?",
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
