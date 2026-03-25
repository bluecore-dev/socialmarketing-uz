import { pgTable, text, serial, timestamp, varchar, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  type: varchar("type", { length: 30 }).notNull().default("info"),
  title: text("title").notNull(),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  link: text("link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notificationsTable).omit({ id: true, createdAt: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notificationsTable.$inferSelect;

export const savedPostsTable = pgTable("saved_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  postId: integer("post_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const translationsTable = pgTable("translations", {
  id: serial("id").primaryKey(),
  namespace: varchar("namespace", { length: 50 }).notNull(),
  key: text("key").notNull(),
  uz: text("uz"),
  ru: text("ru"),
  en: text("en"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
