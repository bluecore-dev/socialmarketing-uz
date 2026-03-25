import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable } from "@workspace/db";
import { eq, desc, and, sql, gte, lte } from "drizzle-orm";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, phone, email, company, service, message, source, lang } = req.body;
    if (!name || !phone) {
      res.status(400).json({ error: "Ism va telefon majburiy" });
      return;
    }
    const [lead] = await db.insert(leadsTable).values({
      name,
      phone,
      email: email || null,
      company: company || null,
      service: service || null,
      message: message || null,
      source: source || null,
      lang: lang || "uz",
      ip: req.ip || null,
      userAgent: req.headers["user-agent"] || null,
    }).returning();
    res.status(201).json(lead);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/export/csv", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const { from, to, status } = req.query as Record<string, string>;
    const conditions = [];
    if (status) conditions.push(eq(leadsTable.status, status));
    if (from) conditions.push(gte(leadsTable.createdAt, new Date(from)));
    if (to) conditions.push(lte(leadsTable.createdAt, new Date(to)));
    const leads = await db.select().from(leadsTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(leadsTable.createdAt));
    const header = "ID,Ism,Telefon,Email,Kompaniya,Xizmat,Manba,Holat,Til,Sana\n";
    const rows = leads.map(l =>
      `${l.id},"${l.name}","${l.phone}","${l.email || ""}","${l.company || ""}","${l.service || ""}","${l.source || ""}","${l.status}","${l.lang}","${l.createdAt.toISOString()}"`
    ).join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
    res.send("\uFEFF" + header + rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const { status, service, lang, search, from, to, page = "1", limit = "20", assignedTo } = req.query as Record<string, string>;
    const conditions = [];
    if (status) conditions.push(eq(leadsTable.status, status));
    if (service) conditions.push(eq(leadsTable.service, service));
    if (lang) conditions.push(eq(leadsTable.lang, lang));
    if (assignedTo) conditions.push(eq(leadsTable.assignedTo, parseInt(assignedTo)));
    if (search) conditions.push(
      sql`(${leadsTable.name} ILIKE ${'%' + search + '%'} OR ${leadsTable.phone} ILIKE ${'%' + search + '%'} OR ${leadsTable.email} ILIKE ${'%' + search + '%'})`
    );
    if (from) conditions.push(gte(leadsTable.createdAt, new Date(from)));
    if (to) conditions.push(lte(leadsTable.createdAt, new Date(to)));
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const [leads, countResult] = await Promise.all([
      db.select().from(leadsTable)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(leadsTable.createdAt))
        .limit(parseInt(limit))
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(leadsTable)
        .where(conditions.length ? and(...conditions) : undefined),
    ]);
    res.json({ leads, total: Number(countResult[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/:id", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, id)).limit(1);
    if (!lead) { res.status(404).json({ error: "Lead topilmadi" }); return; }
    res.json(lead);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.patch("/:id", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    const { status, assignedTo } = req.body;
    const [lead] = await db.update(leadsTable).set({
      ...(status && { status }),
      ...(assignedTo !== undefined && { assignedTo }),
      updatedAt: new Date(),
    }).where(eq(leadsTable.id, id)).returning();
    res.json(lead);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.post("/:id/notes", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    const { text } = req.body;
    if (!text) { res.status(400).json({ error: "Matn majburiy" }); return; }
    const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, id)).limit(1);
    if (!lead) { res.status(404).json({ error: "Lead topilmadi" }); return; }
    const notes = Array.isArray(lead.notes) ? [...(lead.notes as object[])] : [];
    notes.push({ text, createdAt: new Date().toISOString(), userId: req.user!.userId });
    const [updated] = await db.update(leadsTable).set({ notes, updatedAt: new Date() })
      .where(eq(leadsTable.id, lead.id)).returning();
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
