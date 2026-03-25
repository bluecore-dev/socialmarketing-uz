import { pgTable, text, serial, timestamp, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  company: text("company"),
  service: varchar("service", { length: 50 }),
  message: text("message"),
  source: varchar("source", { length: 50 }),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  assignedTo: integer("assigned_to"),
  notes: jsonb("notes").default([]),
  ip: text("ip"),
  userAgent: text("user_agent"),
  lang: varchar("lang", { length: 5 }).notNull().default("uz"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;
