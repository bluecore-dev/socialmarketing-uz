import { pgTable, text, serial, timestamp, boolean, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }).unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  isVerified: boolean("is_verified").notNull().default(false),
  isBlocked: boolean("is_blocked").notNull().default(false),
  company: text("company"),
  avatar: text("avatar"),
  lang: varchar("lang", { length: 5 }).notNull().default("uz"),
  loginAttempts: integer("login_attempts").notNull().default(0),
  lockUntil: timestamp("lock_until"),
  lastLogin: timestamp("last_login"),
  lastLoginIp: text("last_login_ip"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpiry: timestamp("password_reset_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
