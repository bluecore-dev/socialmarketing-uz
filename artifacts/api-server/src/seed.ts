import { db } from "@workspace/db";
import { caseStudiesTable, blogPostsTable, servicesTable } from "@workspace/db/schema";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(caseStudiesTable);
  await db.delete(blogPostsTable);
  await db.delete(servicesTable);

  // Seed services
  await db.insert(servicesTable).values([
    {
      slug: "smm",
      icon: "📱",
      order: 1,
      active: true,
      content: {
        uz: {
          title: "SMM Boshqaruv",
          description: "Instagram, Facebook, TikTok va boshqa platformalarda kontent yaratish, joylashtirish va hamjamiyatni boshqarish xizmati.",
          features: ["Kontent yaratish va rejalashtirish", "Hamjamiyat boshqaruvi", "Brand ovozi va uslubini yaratish", "Oylik hisobot va tahlil", "Stories va Reels yaratish"]
        },
        ru: {
          title: "SMM Управление",
          description: "Создание контента, размещение и управление сообществом в Instagram, Facebook, TikTok и других платформах.",
          features: ["Создание и планирование контента", "Управление сообществом", "Создание голоса и стиля бренда", "Ежемесячные отчёты и анализ", "Создание Stories и Reels"]
        },
        en: {
          title: "SMM Management",
          description: "Content creation, posting, and community management across Instagram, Facebook, TikTok, and other platforms.",
          features: ["Content creation and scheduling", "Community management", "Brand voice and style creation", "Monthly reports and analytics", "Stories and Reels creation"]
        }
      }
    },
    {
      slug: "targeting",
      icon: "🎯",
      order: 2,
      active: true,
      content: {
        uz: {
          title: "Targetli Reklama",
          description: "Facebook, Instagram va Google'da aniq maqsadli auditoriyaga yo'naltirilgan reklama kampaniyalarini boshqarish.",
          features: ["Auditoriya tahlili va segmentatsiya", "A/B testlash", "Reklama byudjetini optimallashtirish", "Konversiya kuzatish", "Retargeting kampaniyalari"]
        },
        ru: {
          title: "Таргетированная реклама",
          description: "Управление рекламными кампаниями в Facebook, Instagram и Google, направленными на точную целевую аудиторию.",
          features: ["Анализ и сегментация аудитории", "A/B тестирование", "Оптимизация рекламного бюджета", "Отслеживание конверсий", "Ретаргетинговые кампании"]
        },
        en: {
          title: "Targeted Advertising",
          description: "Managing ad campaigns on Facebook, Instagram, and Google aimed at precise target audiences.",
          features: ["Audience analysis and segmentation", "A/B testing", "Ad budget optimization", "Conversion tracking", "Retargeting campaigns"]
        }
      }
    },
    {
      slug: "kontent",
      icon: "✍️",
      order: 3,
      active: true,
      content: {
        uz: {
          title: "Kontent Marketing",
          description: "Brendingizni mustahkamlovchi professional kontent strategiyasi — matnlar, infografiklar va multimedia materiallar.",
          features: ["Kontent strategiyasi ishlab chiqish", "Blog va maqolalar yozish", "Infografika dizayni", "Email marketing", "SEO maqolalar"]
        },
        ru: {
          title: "Контент Маркетинг",
          description: "Профессиональная контент-стратегия для укрепления бренда — тексты, инфографика и мультимедийные материалы.",
          features: ["Разработка контент-стратегии", "Написание блогов и статей", "Дизайн инфографики", "Email маркетинг", "SEO статьи"]
        },
        en: {
          title: "Content Marketing",
          description: "Professional content strategy to strengthen your brand — texts, infographics, and multimedia materials.",
          features: ["Content strategy development", "Blog and article writing", "Infographic design", "Email marketing", "SEO articles"]
        }
      }
    },
    {
      slug: "dizayn",
      icon: "🎨",
      order: 4,
      active: true,
      content: {
        uz: {
          title: "Grafik Dizayn",
          description: "Brendingiz uchun profesional vizual identifikatsiya — logo, korporativ uslub va ijtimoiy tarmoqlar uchun kreativlar.",
          features: ["Logo va brend identifikatsiya", "Ijtimoiy tarmoq kreativlari", "Banner va poster dizayni", "Korporativ uslublar", "Animatsiyali kreativlar"]
        },
        ru: {
          title: "Графический Дизайн",
          description: "Профессиональная визуальная идентификация для вашего бренда — логотип, корпоративный стиль и креативы для соцсетей.",
          features: ["Логотип и фирменный стиль", "Креативы для соцсетей", "Дизайн баннеров и постеров", "Корпоративные стили", "Анимированные креативы"]
        },
        en: {
          title: "Graphic Design",
          description: "Professional visual identity for your brand — logo, corporate style, and creatives for social media.",
          features: ["Logo and brand identity", "Social media creatives", "Banner and poster design", "Corporate styles", "Animated creatives"]
        }
      }
    },
    {
      slug: "reels",
      icon: "🎬",
      order: 5,
      active: true,
      content: {
        uz: {
          title: "Video Prodakshn",
          description: "Ijtimoiy tarmoqlar uchun professional Reels, TikTok va YouTube Shorts videolari — montaj, musiqa va effektlar bilan.",
          features: ["Reels va TikTok ishlab chiqarish", "YouTube Shorts", "Professional montaj", "Musiqa va ovoz effektlari", "Subtitrlash"]
        },
        ru: {
          title: "Видео Продакшн",
          description: "Профессиональные Reels, TikTok и YouTube Shorts для социальных сетей — монтаж, музыка и эффекты.",
          features: ["Производство Reels и TikTok", "YouTube Shorts", "Профессиональный монтаж", "Музыка и звуковые эффекты", "Субтитрирование"]
        },
        en: {
          title: "Video Production",
          description: "Professional Reels, TikTok, and YouTube Shorts for social media — editing, music, and effects.",
          features: ["Reels and TikTok production", "YouTube Shorts", "Professional editing", "Music and sound effects", "Subtitling"]
        }
      }
    },
    {
      slug: "analitika",
      icon: "📊",
      order: 6,
      active: true,
      content: {
        uz: {
          title: "Analytics va Hisobot",
          description: "Ijtimoiy tarmoq ko'rsatkichlarini chuqur tahlil qilish va biznes o'sishini ta'minlovchi ma'lumotlarga asoslangan qarorlar.",
          features: ["Oylik batafsil hisobotlar", "ROI hisoblash", "Raqobatchilar tahlili", "Auditoriya demografiyasi", "O'sish prognozlari"]
        },
        ru: {
          title: "Аналитика и Отчётность",
          description: "Глубокий анализ показателей социальных сетей и решения на основе данных для обеспечения роста бизнеса.",
          features: ["Ежемесячные подробные отчёты", "Расчёт ROI", "Анализ конкурентов", "Демография аудитории", "Прогнозы роста"]
        },
        en: {
          title: "Analytics and Reporting",
          description: "Deep analysis of social media metrics and data-driven decisions to ensure business growth.",
          features: ["Monthly detailed reports", "ROI calculation", "Competitor analysis", "Audience demographics", "Growth forecasts"]
        }
      }
    }
  ]);

  // Seed case studies
  await db.insert(caseStudiesTable).values([
    {
      slug: "fayz-burger",
      client: "Fayz Burger",
      platform: "instagram",
      featured: true,
      status: "published",
      order: 1,
      metrics: {
        followers: "+18,500",
        reach: "+340%",
        sales: "+65%",
        engagement: "8.2%"
      },
      content: {
        uz: {
          title: "Fayz Burger: Instagram strategiyasi",
          description: "3 oylik SMM kampaniya orqali followerlar sonini 3 barobarga oshirdik va savdoni 65% ko'paytirdik.",
        },
        ru: {
          title: "Fayz Burger: Стратегия Instagram",
          description: "За 3 месяца SMM-кампании мы утроили количество подписчиков и увеличили продажи на 65%.",
        },
        en: {
          title: "Fayz Burger: Instagram Strategy",
          description: "Through a 3-month SMM campaign, we tripled follower count and increased sales by 65%.",
        }
      }
    },
    {
      slug: "nova-beauty",
      client: "Nova Beauty",
      platform: "instagram",
      featured: true,
      status: "published",
      order: 2,
      metrics: {
        followers: "+32,000",
        reach: "+520%",
        bookings: "+120%",
        revenue: "+89%"
      },
      content: {
        uz: {
          title: "Nova Beauty: Go'zallik salonini raqamlashtirishda",
          description: "Go'zallik salonini ijtimoiy tarmoqda kuchli brendga aylantirdik — bronlar 2 baravar ko'paydi.",
        },
        ru: {
          title: "Nova Beauty: Цифровизация салона красоты",
          description: "Превратили салон красоты в сильный бренд в социальных сетях — бронирования увеличились вдвое.",
        },
        en: {
          title: "Nova Beauty: Digitalizing a Beauty Salon",
          description: "We turned a beauty salon into a strong social media brand — bookings doubled.",
        }
      }
    },
    {
      slug: "techsolutions",
      client: "TechSolutions UZ",
      platform: "linkedin",
      featured: true,
      status: "published",
      order: 3,
      metrics: {
        leads: "+215%",
        reach: "+410%",
        conversions: "+78%",
        cpa: "-42%"
      },
      content: {
        uz: {
          title: "TechSolutions: B2B marketing muvaffaqiyati",
          description: "LinkedIn va Facebook targetli reklama orqali B2B leadlarni 215% ga oshirdik.",
        },
        ru: {
          title: "TechSolutions: Успех B2B маркетинга",
          description: "Увеличили B2B лиды на 215% с помощью таргетированной рекламы в LinkedIn и Facebook.",
        },
        en: {
          title: "TechSolutions: B2B Marketing Success",
          description: "We increased B2B leads by 215% through targeted advertising on LinkedIn and Facebook.",
        }
      }
    }
  ]);

  // Seed blog posts
  const now = new Date();
  await db.insert(blogPostsTable).values([
    {
      slug: "smm-tendentsiyalar-2025",
      status: "published",
      category: "trends",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
      publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      views: 1247,
      content: {
        uz: {
          title: "2025-yilda SMM: Asosiy Tendentsiyalar",
          excerpt: "2025-yilda ijtimoiy media marketing qanday o'zgarmoqda? AI, short-form video va autentik kontent — bularning barchasi haqida.",
          body: "2025-yil ijtimoiy media marketing uchun inqilobiy yil bo'lmoqda. Eng muhim tendentsiyalar:\n\n**1. AI-yaratilgan kontent**\nSuniy intellekt endi nafaqat yordamchi, balki kontent yaratuvchi sifatida ishlaydi. ChatGPT, Claude va boshqa AI vositalar matn, rasm va hatto video yaratishda yordam beradi.\n\n**2. Short-form video hukmronligi**\nTikTok, Instagram Reels va YouTube Shorts hali ham eng yuqori engagement ko'rsatgichlarini namoyish etmoqda. 15-60 soniyalik videolar brendlar uchun eng samarali format.\n\n**3. Autentik kontent**\nFoydalanuvchilar endi polishlangan reklama o'rniga haqiqiy, «raw» kontentni afzal ko'rmoqda. User-generated content (UGC) va behind-the-scenes videolar brendlarga ishonch bildiradi."
        },
        ru: {
          title: "SMM в 2025 году: Ключевые Тенденции",
          excerpt: "Как меняется маркетинг в социальных сетях в 2025 году? ИИ, short-form видео и аутентичный контент — всё об этом.",
          body: "2025 год становится революционным для маркетинга в социальных сетях. Ключевые тенденции:\n\n**1. Контент, созданный ИИ**\nИскусственный интеллект теперь работает не только как помощник, но и как создатель контента. ChatGPT, Claude и другие инструменты ИИ помогают создавать тексты, изображения и даже видео.\n\n**2. Доминирование short-form видео**\nTikTok, Instagram Reels и YouTube Shorts по-прежнему демонстрируют самые высокие показатели вовлечённости. Видео длительностью 15-60 секунд — самый эффективный формат для брендов.\n\n**3. Аутентичный контент**\nПользователи теперь предпочитают настоящий, «raw» контент вместо отполированной рекламы. Пользовательский контент (UGC) и видео «за кулисами» вызывают доверие к брендам."
        },
        en: {
          title: "SMM in 2025: Key Trends",
          excerpt: "How is social media marketing changing in 2025? AI, short-form video, and authentic content — all about these.",
          body: "2025 is becoming a revolutionary year for social media marketing. Key trends:\n\n**1. AI-generated content**\nArtificial intelligence now works not just as an assistant, but as a content creator. ChatGPT, Claude, and other AI tools help create texts, images, and even videos.\n\n**2. Short-form video dominance**\nTikTok, Instagram Reels, and YouTube Shorts still demonstrate the highest engagement metrics. 15-60 second videos are the most effective format for brands.\n\n**3. Authentic content**\nUsers now prefer real, 'raw' content over polished advertising. User-generated content (UGC) and behind-the-scenes videos build trust with brands."
        }
      }
    },
    {
      slug: "instagram-algoritmini-tushunish",
      status: "published",
      category: "guide",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      publishedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      views: 2891,
      content: {
        uz: {
          title: "Instagram Algoritmini Qanday Yengish Mumkin?",
          excerpt: "Instagram algoritmi qanday ishlaydi va uni o'z foyydangizga ishlatish uchun 7 ta amaliy maslahat.",
          body: "Instagram algoritmi tez-tez o'zgarib tursa-da, asosiy qoidalar qoladi. Mana ularga rioya qilish uchun 7 ta maslahat:\n\n**1. Doimiylik**\nHaftasiga kamida 3-5 marta post joylashtiring. Algorithm doimiy faollik ko'rsatadigan akkauntlarni ustun qo'yadi.\n\n**2. Engagement muhim**\nReellar va hikoyalarga savol qo'shing. Qanchalik ko'p sharh va DM olsangiz, algoritmda shunchalik yuqori bo'lasiz.\n\n**3. Hashtag strategiyasi**\n3-5 ta niche hashtag va 2-3 ta katta hashtag kombinatsiyasi eng yaxshi natija beradi."
        },
        ru: {
          title: "Как Победить Алгоритм Instagram?",
          excerpt: "Как работает алгоритм Instagram и 7 практических советов по его использованию в своих интересах.",
          body: "Хотя алгоритм Instagram часто меняется, основные правила остаются. Вот 7 советов, как им следовать:\n\n**1. Последовательность**\nПубликуйте не менее 3-5 раз в неделю. Алгоритм отдаёт предпочтение аккаунтам, демонстрирующим постоянную активность.\n\n**2. Вовлечённость важна**\nДобавляйте вопросы в Reels и Stories. Чем больше комментариев и DM вы получаете, тем выше вы будете в алгоритме.\n\n**3. Стратегия хэштегов**\nКомбинация 3-5 нишевых хэштегов и 2-3 больших хэштегов даёт наилучший результат."
        },
        en: {
          title: "How to Beat the Instagram Algorithm?",
          excerpt: "How does the Instagram algorithm work and 7 practical tips for using it to your advantage.",
          body: "Although the Instagram algorithm changes frequently, the basic rules remain. Here are 7 tips to follow them:\n\n**1. Consistency**\nPost at least 3-5 times per week. The algorithm favors accounts that demonstrate consistent activity.\n\n**2. Engagement matters**\nAdd questions to Reels and Stories. The more comments and DMs you receive, the higher you'll be in the algorithm.\n\n**3. Hashtag strategy**\nA combination of 3-5 niche hashtags and 2-3 large hashtags gives the best results."
        }
      }
    },
    {
      slug: "kichik-biznes-smm",
      status: "published",
      category: "business",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      publishedAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
      views: 1534,
      content: {
        uz: {
          title: "Kichik Biznes Uchun SMM: Qayerdan Boshlash?",
          excerpt: "Kichik byudjet bilan ijtimoiy tarmoqda qanday qilib samarali ishlash mumkin? Amaliy qo'llanma.",
          body: "Kichik biznes uchun ijtimoiy media marketing qo'rqinchli tuyulishi mumkin. Ammo to'g'ri strategiya bilan katta natijaga erishish mumkin:\n\n**1. Platformani tanlang**\nBarcha platformada bir vaqtda bo'lishga harakat qilmang. Birinchi navbatda, sizning auditoriyangiz qayerda ko'proq bo'lishini aniqlang.\n\n**2. Kontent kalendarini yarating**\nHaftada 2-3 marta joylashtirib, barqaror bo'ling. Oldindan reja tuzing.\n\n**3. UGC dan foydalaning**\nMijozlaringizdan foto va gaplarni so'rang. Bu eng ishonchli kontent turi."
        },
        ru: {
          title: "SMM для Малого Бизнеса: С чего Начать?",
          excerpt: "Как эффективно работать в социальных сетях с небольшим бюджетом? Практическое руководство.",
          body: "Маркетинг в социальных сетях может показаться пугающим для малого бизнеса. Но с правильной стратегией можно достичь больших результатов:\n\n**1. Выберите платформу**\nНе пытайтесь быть на всех платформах одновременно. Прежде всего определите, где больше всего находится ваша аудитория.\n\n**2. Создайте контент-календарь**\nПубликуйте 2-3 раза в неделю и будьте последовательны. Планируйте заранее.\n\n**3. Используйте UGC**\nПопросите клиентов прислать фото и отзывы. Это самый доверенный тип контента."
        },
        en: {
          title: "SMM for Small Business: Where to Start?",
          excerpt: "How to work effectively on social media with a small budget? A practical guide.",
          body: "Social media marketing can seem daunting for small businesses. But with the right strategy, great results can be achieved:\n\n**1. Choose a platform**\nDon't try to be on all platforms at once. First, determine where your audience is most present.\n\n**2. Create a content calendar**\nPost 2-3 times per week and be consistent. Plan ahead.\n\n**3. Use UGC**\nAsk customers for photos and testimonials. This is the most trusted type of content."
        }
      }
    }
  ]);

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
