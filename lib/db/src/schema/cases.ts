import { pgTable, text, serial, timestamp, varchar, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const caseStudiesTable = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  client: text("client").notNull(),
  platform: varchar("platform", { length: 50 }),
  beforeImage: text("before_image"),
  afterImage: text("after_image"),
  metrics: jsonb("metrics").default({}),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  content: jsonb("content").notNull().default({}),
  featured: boolean("featured").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCaseStudySchema = createInsertSchema(caseStudiesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type CaseStudy = typeof caseStudiesTable.$inferSelect;
