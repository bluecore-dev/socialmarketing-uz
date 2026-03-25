import { Router } from "express";
import { db } from "@workspace/db";
import { bannersTable } from "@workspace/db";
import { eq, and, or, lte, gte, sql } from "drizzle-orm";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { type, lang } = req.query as Record<string, string>;
    const now = new Date();
    const conditions = [
      eq(bannersTable.active, true),
      or(sql`${bannersTable.startDate} IS NULL`, lte(bannersTable.startDate, now)),
      or(sql`${bannersTable.endDate} IS NULL`, gte(bannersTable.endDate, now)),
    ];
    if (type) conditions.push(eq(bannersTable.type, type));
    if (lang) conditions.push(
      or(eq(bannersTable.targetLang, "all"), eq(bannersTable.targetLang, lang))
    );
    const banners = await db.select().from(bannersTable).where(and(...conditions));
    if (type) {
      await db.update(bannersTable).set({ impressions: sql`${bannersTable.impressions} + 1` })
        .where(and(...conditions));
    }
    res.json(banners);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/admin/all", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const banners = await db.select().from(bannersTable).orderBy(bannersTable.createdAt);
    res.json(banners);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.post("/", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const { type, startDate, endDate, targetLang, targetAudience, abVariant, content } = req.body;
    if (!content) { res.status(400).json({ error: "Kontent majburiy" }); return; }
    const [banner] = await db.insert(bannersTable).values({
      type: type || "top-bar",
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      targetLang: targetLang || "all",
      targetAudience: targetAudience || "all",
      abVariant: abVariant || null,
      content,
    }).returning();
    res.status(201).json(banner);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    const { type, active, startDate, endDate, targetLang, targetAudience, abVariant, content } = req.body;
    const [banner] = await db.update(bannersTable).set({
      ...(type && { type }),
      ...(active !== undefined && { active: !!active }),
      ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
      ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      ...(targetLang && { targetLang }),
      ...(targetAudience && { targetAudience }),
      ...(abVariant !== undefined && { abVariant }),
      ...(content && { content }),
      updatedAt: new Date(),
    }).where(eq(bannersTable.id, id)).returning();
    res.json(banner);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    await db.delete(bannersTable).where(eq(bannersTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.post("/:id/click", async (req, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    await db.update(bannersTable).set({ clicks: sql`${bannersTable.clicks} + 1` })
      .where(eq(bannersTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
