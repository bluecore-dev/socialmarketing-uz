import { Router } from "express";
import { db } from "@workspace/db";
import { translationsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/admin/all", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const rows = await db.select().from(translationsTable).orderBy(translationsTable.namespace, translationsTable.key);
    res.json(rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/:lang/:namespace", async (req, res) => {
  try {
    const { lang, namespace } = req.params as { lang: string; namespace: string };
    const rows = await db.select().from(translationsTable)
      .where(eq(translationsTable.namespace, namespace));
    const result: Record<string, string> = {};
    for (const row of rows) {
      result[row.key] = (lang === "ru" ? row.ru : lang === "en" ? row.en : row.uz) || row.key;
    }
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.put("/", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const { namespace, key, uz, ru, en } = req.body;
    if (!namespace || !key) { res.status(400).json({ error: "Namespace va key majburiy" }); return; }
    const existing = await db.select().from(translationsTable)
      .where(and(eq(translationsTable.namespace, namespace), eq(translationsTable.key, key))).limit(1);
    if (existing.length > 0) {
      const [updated] = await db.update(translationsTable).set({
        uz: uz || null, ru: ru || null, en: en || null, updatedAt: new Date(),
      }).where(and(eq(translationsTable.namespace, namespace), eq(translationsTable.key, key))).returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(translationsTable).values({
        namespace, key, uz: uz || null, ru: ru || null, en: en || null,
      }).returning();
      res.status(201).json(created);
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
