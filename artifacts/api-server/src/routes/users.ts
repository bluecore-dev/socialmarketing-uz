import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq, desc, sql, and } from "drizzle-orm";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const { role, search, page = "1", limit = "20" } = req.query as Record<string, string>;
    const conditions = [];
    if (role) conditions.push(eq(usersTable.role, role));
    if (search) conditions.push(
      sql`(${usersTable.name} ILIKE ${'%' + search + '%'} OR ${usersTable.email} ILIKE ${'%' + search + '%'})`
    );
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const [users, countResult] = await Promise.all([
      db.select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        phone: usersTable.phone,
        role: usersTable.role,
        company: usersTable.company,
        isVerified: usersTable.isVerified,
        isBlocked: usersTable.isBlocked,
        lang: usersTable.lang,
        lastLogin: usersTable.lastLogin,
        lastLoginIp: usersTable.lastLoginIp,
        createdAt: usersTable.createdAt,
      }).from(usersTable)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(usersTable.createdAt))
        .limit(parseInt(limit))
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(usersTable)
        .where(conditions.length ? and(...conditions) : undefined),
    ]);
    res.json({ users, total: Number(countResult[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.patch("/:id/role", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    const { role } = req.body;
    if (!["user", "manager", "admin"].includes(role)) {
      res.status(400).json({ error: "Noto'g'ri rol" });
      return;
    }
    const [updated] = await db.update(usersTable).set({ role, updatedAt: new Date() })
      .where(eq(usersTable.id, id)).returning({ id: usersTable.id, role: usersTable.role });
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.patch("/:id/block", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    const { blocked } = req.body;
    const [updated] = await db.update(usersTable).set({ isBlocked: !!blocked, updatedAt: new Date() })
      .where(eq(usersTable.id, id)).returning({ id: usersTable.id, isBlocked: usersTable.isBlocked });
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
