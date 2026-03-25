import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { requireAuth, AuthRequest } from "../middleware/auth.js";

const router = Router();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "bluecore_access_secret_2025_change_in_prod";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "bluecore_refresh_secret_2025_change_in_prod";

function generateTokens(userId: number, role: string) {
  const accessToken = jwt.sign({ userId, role }, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "30d" });
  return { accessToken, refreshToken };
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, company, lang } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Ism, email va parol majburiy" });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "Parol kamida 8 ta belgi bo'lishi kerak" });
      return;
    }
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "Bu email allaqachon ro'yxatdan o'tgan" });
      return;
    }
    const hashed = await bcrypt.hash(password, 12);
    const [user] = await db.insert(usersTable).values({
      name,
      email: email.toLowerCase(),
      phone: phone || null,
      password: hashed,
      company: company || null,
      lang: lang || "uz",
    }).returning();
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, lang: user.lang },
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email va parol majburiy" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (!user) {
      res.status(401).json({ error: "Email yoki parol noto'g'ri" });
      return;
    }
    if (user.isBlocked) {
      res.status(403).json({ error: "Hisob bloklangan. Admin bilan bog'laning." });
      return;
    }
    if (user.lockUntil && user.lockUntil > new Date()) {
      res.status(429).json({ error: `Hisob vaqtincha bloklangan. ${user.lockUntil.toISOString()} gacha kuting.` });
      return;
    }
    const valid = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!valid) {
      const attempts = (user.loginAttempts || 0) + 1;
      const updateData: Record<string, unknown> = { loginAttempts: attempts };
      if (attempts >= 5) {
        updateData.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        updateData.loginAttempts = 0;
      }
      await db.update(usersTable).set(updateData).where(eq(usersTable.id, user.id));
      res.status(401).json({ error: "Email yoki parol noto'g'ri" });
      return;
    }
    await db.update(usersTable).set({
      loginAttempts: 0,
      lockUntil: null,
      lastLogin: new Date(),
      lastLoginIp: req.ip || null,
    }).where(eq(usersTable.id, user.id));
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, lang: user.lang, avatar: user.avatar },
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ success: true });
});

router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      res.status(401).json({ error: "Refresh token topilmadi" });
      return;
    }
    const payload = jwt.verify(token, REFRESH_SECRET) as { userId: number };
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId)).limit(1);
    if (!user || user.isBlocked) {
      res.status(401).json({ error: "Foydalanuvchi topilmadi yoki bloklangan" });
      return;
    }
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: "Token noto'g'ri yoki muddati o'tgan" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, (email || "").toLowerCase())).limit(1);
    if (!user) {
      res.json({ success: true, message: "Agar bu email mavjud bo'lsa, havolani yuboramiz" });
      return;
    }
    const token = crypto.randomBytes(32).toString("hex");
    await db.update(usersTable).set({
      passwordResetToken: token,
      passwordResetExpiry: new Date(Date.now() + 60 * 60 * 1000),
    }).where(eq(usersTable.id, user.id));
    res.json({ success: true, message: "Parolni tiklash havolasi yuborildi", resetToken: token });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 8) {
      res.status(400).json({ error: "Token va kamida 8 ta belgili parol majburiy" });
      return;
    }
    const [user] = await db.select().from(usersTable)
      .where(eq(usersTable.passwordResetToken, token)).limit(1);
    if (!user || !user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
      res.status(400).json({ error: "Token noto'g'ri yoki muddati o'tgan" });
      return;
    }
    const hashed = await bcrypt.hash(password, 12);
    await db.update(usersTable).set({
      password: hashed,
      passwordResetToken: null,
      passwordResetExpiry: null,
    }).where(eq(usersTable.id, user.id));
    res.json({ success: true, message: "Parol muvaffaqiyatli yangilandi" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      phone: usersTable.phone,
      role: usersTable.role,
      company: usersTable.company,
      avatar: usersTable.avatar,
      lang: usersTable.lang,
      isVerified: usersTable.isVerified,
      createdAt: usersTable.createdAt,
    }).from(usersTable).where(eq(usersTable.id, req.user!.userId)).limit(1);
    if (!user) {
      res.status(404).json({ error: "Foydalanuvchi topilmadi" });
      return;
    }
    res.json(user);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.patch("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, phone, company, lang, avatar } = req.body;
    const [updated] = await db.update(usersTable).set({
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(company !== undefined && { company }),
      ...(lang && { lang }),
      ...(avatar !== undefined && { avatar }),
      updatedAt: new Date(),
    }).where(eq(usersTable.id, req.user!.userId)).returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      phone: usersTable.phone,
      role: usersTable.role,
      company: usersTable.company,
      avatar: usersTable.avatar,
      lang: usersTable.lang,
    });
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.patch("/change-password", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      res.status(400).json({ error: "Joriy parol va kamida 8 ta belgili yangi parol majburiy" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId)).limit(1);
    if (!user?.password || !(await bcrypt.compare(currentPassword, user.password))) {
      res.status(401).json({ error: "Joriy parol noto'g'ri" });
      return;
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await db.update(usersTable).set({ password: hashed, updatedAt: new Date() }).where(eq(usersTable.id, user.id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.delete("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.update(usersTable).set({
      isBlocked: true,
      email: `deleted_${req.user!.userId}_${Date.now()}@deleted.bluecore`,
      updatedAt: new Date(),
    }).where(eq(usersTable.id, req.user!.userId));
    res.clearCookie("refreshToken");
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
