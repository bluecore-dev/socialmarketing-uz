import { Router } from "express";
import { db } from "@workspace/db";
import { notificationsTable, usersTable } from "@workspace/db";
import { eq, desc, and, sql } from "drizzle-orm";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/admin/all", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const rawPage = parseInt(String(req.query["page"] || "1"));
    const rawLimit = parseInt(String(req.query["limit"] || "50"));
    const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage);
    const limit = Math.min(100, Math.max(1, isNaN(rawLimit) ? 50 : rawLimit));
    const offset = (page - 1) * limit;
    const notifications = await db.select().from(notificationsTable)
      .orderBy(desc(notificationsTable.createdAt))
      .limit(limit).offset(offset);
    res.json(notifications);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const notifications = await db.select().from(notificationsTable)
      .where(
        sql`(${notificationsTable.userId} IS NULL OR ${notificationsTable.userId} = ${req.user!.userId})`
      )
      .orderBy(desc(notificationsTable.createdAt))
      .limit(50);
    res.json(notifications);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.post("/", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const { title, body, type, link, userId } = req.body;
    if (!title || !body) { res.status(400).json({ error: "Sarlavha va matn majburiy" }); return; }
    if (userId) {
      const [notif] = await db.insert(notificationsTable).values({
        userId: parseInt(userId), title, body, type: type || "info", link: link || null,
      }).returning();
      res.status(201).json([notif]);
    } else {
      const users = await db.select({ id: usersTable.id }).from(usersTable)
        .where(eq(usersTable.isBlocked, false));
      const values = users.map(u => ({ userId: u.id, title, body, type: type || "info", link: link || null }));
      const notifs = await db.insert(notificationsTable).values(values).returning();
      res.status(201).json(notifs);
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.patch("/read-all", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.update(notificationsTable).set({ read: true })
      .where(sql`(${notificationsTable.userId} IS NULL OR ${notificationsTable.userId} = ${req.user!.userId})`);
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.patch("/:id/read", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    const [notif] = await db.update(notificationsTable).set({ read: true })
      .where(and(
        eq(notificationsTable.id, id),
        sql`(${notificationsTable.userId} IS NULL OR ${notificationsTable.userId} = ${req.user!.userId})`
      )).returning();
    res.json(notif);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.patch("/:id", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    const { title, body, type, link } = req.body;
    const [notif] = await db.update(notificationsTable).set({
      ...(title && { title }),
      ...(body && { body }),
      ...(type && { type }),
      ...(link !== undefined && { link }),
    }).where(eq(notificationsTable.id, id)).returning();
    if (!notif) { res.status(404).json({ error: "Bildirishnoma topilmadi" }); return; }
    res.json(notif);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    await db.delete(notificationsTable).where(eq(notificationsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
