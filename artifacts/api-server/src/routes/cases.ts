import { Router } from "express";
import { db } from "@workspace/db";
import { caseStudiesTable } from "@workspace/db";
import { eq, desc, and, sql } from "drizzle-orm";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { status = "published", platform, featured } = req.query as Record<string, string>;
    const conditions: ReturnType<typeof eq>[] = [eq(caseStudiesTable.status, status)];
    if (platform) conditions.push(eq(caseStudiesTable.platform, platform));
    if (featured === "true") conditions.push(eq(caseStudiesTable.featured, true));
    const cases = await db.select().from(caseStudiesTable)
      .where(and(...conditions))
      .orderBy(caseStudiesTable.order, desc(caseStudiesTable.createdAt));
    res.json(cases);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const [caseStudy] = await db.select().from(caseStudiesTable).where(eq(caseStudiesTable.slug, req.params.slug)).limit(1);
    if (!caseStudy) { res.status(404).json({ error: "Case study topilmadi" }); return; }
    res.json(caseStudy);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.post("/", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const { slug, client, platform, beforeImage, afterImage, metrics, status, content, featured, order } = req.body;
    if (!slug || !client) { res.status(400).json({ error: "Slug va mijoz majburiy" }); return; }
    const [cs] = await db.insert(caseStudiesTable).values({
      slug, client, platform: platform || null,
      beforeImage: beforeImage || null, afterImage: afterImage || null,
      metrics: metrics || {}, status: status || "draft",
      content: content || {}, featured: !!featured, order: order || 0,
    }).returning();
    res.status(201).json(cs);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.put("/:id", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    const { slug, client, platform, beforeImage, afterImage, metrics, status, content, featured, order } = req.body;
    const [cs] = await db.update(caseStudiesTable).set({
      ...(slug && { slug }),
      ...(client && { client }),
      ...(platform !== undefined && { platform }),
      ...(beforeImage !== undefined && { beforeImage }),
      ...(afterImage !== undefined && { afterImage }),
      ...(metrics && { metrics }),
      ...(status && { status }),
      ...(content && { content }),
      ...(featured !== undefined && { featured: !!featured }),
      ...(order !== undefined && { order }),
      updatedAt: new Date(),
    }).where(eq(caseStudiesTable.id, id)).returning();
    res.json(cs);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    await db.delete(caseStudiesTable).where(eq(caseStudiesTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
