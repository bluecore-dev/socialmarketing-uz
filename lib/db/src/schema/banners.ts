import { pgTable, text, serial, timestamp, varchar, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bannersTable = pgTable("banners", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 30 }).notNull().default("top-bar"),
  active: boolean("active").notNull().default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  targetLang: varchar("target_lang", { length: 10 }).default("all"),
  targetAudience: varchar("target_audience", { length: 20 }).default("all"),
  abVariant: varchar("ab_variant", { length: 5 }),
  content: jsonb("content").notNull().default({}),
  clicks: integer("clicks").notNull().default(0),
  impressions: integer("impressions").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBannerSchema = createInsertSchema(bannersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type Banner = typeof bannersTable.$inferSelect;
