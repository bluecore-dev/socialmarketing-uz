# BlueCore — socialmarketing.uz

**Full-stack website and client platform of the BlueCore SMM agency** — [socialmarketing.uz](https://socialmarketing.uz). A cinematic trilingual site (uz / ru / en), a client cabinet and a complete admin CMS.

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?logo=framer&logoColor=white) ![Express 5](https://img.shields.io/badge/Express%205-000000?logo=express&logoColor=white) ![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-C5F74F?logo=drizzle&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)

## Features

- **Agency website** — services, case studies (masonry grid with category filters), blog, testimonials, contacts
- **Premium motion design** — page loader, Lenis smooth scroll, GSAP / Framer Motion scroll animations, parallax, magnetic buttons, custom cursor, glass header; everything respects `prefers-reduced-motion`
- **Trilingual** — i18next with browser language detection
- **Client cabinet** — registration, login, password reset (JWT access + refresh tokens)
- **Admin CMS** — services, cases, blog, banners, leads, users, notifications and every translation editable from the panel; role-based (admin / manager)
- **Lead capture** from the contact forms straight into the CMS
- Security: helmet, rate limiting, bcrypt, HTTP-only refresh tokens; structured logging with pino

## Architecture

```
pnpm monorepo
├── artifacts/
│   ├── bluecore-web/     # React + Vite site, cabinet and admin panel
│   ├── api-server/       # Express 5 API: auth, CMS, leads, notifications, translations
│   └── mockup-sandbox/   # UI prototyping (dev only)
├── lib/
│   ├── db/               # Drizzle ORM schema
│   └── api-zod/          # generated Zod contracts shared by API and web
└── scripts/
```

## Getting started

```bash
pnpm install
# API environment: DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
pnpm run typecheck
pnpm run build
```

Brand: primary `#1A4F8A`, secondary `#0077CC`, accent `#00C4FF`; Cormorant Garamond, DM Sans, JetBrains Mono.

## Author

Built by **Bluecore Dev** — IT agency · Omonjon, full-stack developer (4+ years)

[+998 91 911 99 88](tel:+998919119988) · [socialmarketing.uz](https://socialmarketing.uz) · Telegram [@anvarov_911](https://t.me/anvarov_911) · [anvarov1170@gmail.com](mailto:anvarov1170@gmail.com)
