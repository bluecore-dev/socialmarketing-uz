import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable, usersTable, blogPostsTable, caseStudiesTable } from "@workspace/db";
import { eq, desc, sql, gte, and } from "drizzle-orm";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/stats", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const [
      todayLeads, yesterdayLeads, monthLeads, prevMonthLeads, totalUsers, activeUsers,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(leadsTable).where(gte(leadsTable.createdAt, today)),
      db.select({ count: sql<number>`count(*)` }).from(leadsTable).where(and(gte(leadsTable.createdAt, yesterday), sql`${leadsTable.createdAt} < ${today}`)),
      db.select({ count: sql<number>`count(*)` }).from(leadsTable).where(gte(leadsTable.createdAt, monthStart)),
      db.select({ count: sql<number>`count(*)` }).from(leadsTable).where(and(gte(leadsTable.createdAt, prevMonthStart), sql`${leadsTable.createdAt} < ${monthStart}`)),
      db.select({ count: sql<number>`count(*)` }).from(usersTable).where(eq(usersTable.isBlocked, false)),
      db.select({ count: sql<number>`count(*)` }).from(usersTable).where(and(eq(usersTable.isBlocked, false), gte(usersTable.lastLogin, monthStart))),
    ]);

    res.json({
      todayLeads: Number(todayLeads[0].count),
      yesterdayLeads: Number(yesterdayLeads[0].count),
      monthLeads: Number(monthLeads[0].count),
      prevMonthLeads: Number(prevMonthLeads[0].count),
      totalUsers: Number(totalUsers[0].count),
      activeUsers: Number(activeUsers[0].count),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/leads-flow", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const days = 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const result = await db.select({
      date: sql<string>`DATE(${leadsTable.createdAt})`,
      count: sql<number>`count(*)`,
    }).from(leadsTable)
      .where(gte(leadsTable.createdAt, startDate))
      .groupBy(sql`DATE(${leadsTable.createdAt})`)
      .orderBy(sql`DATE(${leadsTable.createdAt})`);

    res.json(result.map(r => ({ date: r.date, count: Number(r.count) })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/source-stats", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const result = await db.select({
      source: leadsTable.source,
      count: sql<number>`count(*)`,
    }).from(leadsTable)
      .groupBy(leadsTable.source)
      .orderBy(desc(sql`count(*)`));
    res.json(result.map(r => ({ source: r.source || "direct", count: Number(r.count) })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/lang-stats", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const result = await db.select({
      lang: leadsTable.lang,
      count: sql<number>`count(*)`,
    }).from(leadsTable)
      .groupBy(leadsTable.lang)
      .orderBy(desc(sql`count(*)`));
    res.json(result.map(r => ({ lang: r.lang, count: Number(r.count) })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/service-stats", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const result = await db.select({
      service: leadsTable.service,
      count: sql<number>`count(*)`,
    }).from(leadsTable)
      .groupBy(leadsTable.service)
      .orderBy(desc(sql`count(*)`));
    res.json(result.map(r => ({ service: r.service || "other", count: Number(r.count) })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
