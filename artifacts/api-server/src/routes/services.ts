import { Router } from "express";
import { db } from "@workspace/db";
import { servicesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const services = await db.select().from(servicesTable)
      .where(eq(servicesTable.active, true))
      .orderBy(asc(servicesTable.order));
    res.json(services);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const slug = String(req.params["slug"]);
    const [service] = await db.select().from(servicesTable).where(eq(servicesTable.slug, slug)).limit(1);
    if (!service) { res.status(404).json({ error: "Xizmat topilmadi" }); return; }
    res.json(service);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.post("/", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const { slug, icon, order, content, pricing } = req.body;
    if (!slug || !content) { res.status(400).json({ error: "Slug va kontent majburiy" }); return; }
    const [service] = await db.insert(servicesTable).values({
      slug, icon: icon || null, order: order || 0,
      content, pricing: pricing || {},
    }).returning();
    res.status(201).json(service);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    const { slug, icon, order, active, content, pricing } = req.body;
    const [service] = await db.update(servicesTable).set({
      ...(slug && { slug }),
      ...(icon !== undefined && { icon }),
      ...(order !== undefined && { order }),
      ...(active !== undefined && { active: !!active }),
      ...(content && { content }),
      ...(pricing && { pricing }),
      updatedAt: new Date(),
    }).where(eq(servicesTable.id, id)).returning();
    res.json(service);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    await db.delete(servicesTable).where(eq(servicesTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/admin/all", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const services = await db.select().from(servicesTable).orderBy(asc(servicesTable.order));
    res.json(services);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
