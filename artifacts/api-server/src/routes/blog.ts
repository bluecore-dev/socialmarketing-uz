import { Router } from "express";
import { db } from "@workspace/db";
import { blogPostsTable, savedPostsTable } from "@workspace/db";
import { eq, desc, and, sql, like } from "drizzle-orm";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { status = "published", category, page = "1", limit = "10" } = req.query as Record<string, string>;
    const conditions = [eq(blogPostsTable.status, status)];
    if (category) conditions.push(eq(blogPostsTable.category, category));
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const [posts, countResult] = await Promise.all([
      db.select().from(blogPostsTable)
        .where(and(...conditions))
        .orderBy(desc(blogPostsTable.publishedAt))
        .limit(parseInt(limit))
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(blogPostsTable).where(and(...conditions)),
    ]);
    res.json({ posts, total: Number(countResult[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, req.params.slug)).limit(1);
    if (!post) { res.status(404).json({ error: "Maqola topilmadi" }); return; }
    await db.update(blogPostsTable).set({ views: (post.views || 0) + 1 }).where(eq(blogPostsTable.id, post.id));
    res.json(post);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.post("/", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const { slug, status, category, image, content } = req.body;
    if (!slug || !content) { res.status(400).json({ error: "Slug va kontent majburiy" }); return; }
    const [post] = await db.insert(blogPostsTable).values({
      slug, status: status || "draft", category: category || null,
      image: image || null, content, authorId: req.user!.userId,
      publishedAt: status === "published" ? new Date() : null,
    }).returning();
    res.status(201).json(post);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.put("/:id", requireAuth, requireRole("admin", "manager"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    const { slug, status, category, image, content } = req.body;
    const [post] = await db.update(blogPostsTable).set({
      ...(slug && { slug }),
      ...(status && { status }),
      ...(category !== undefined && { category }),
      ...(image !== undefined && { image }),
      ...(content && { content }),
      ...(status === "published" ? { publishedAt: new Date() } : {}),
      updatedAt: new Date(),
    }).where(eq(blogPostsTable.id, id)).returning();
    res.json(post);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(String(req.params["id"]));
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.post("/:id/save", requireAuth, async (req: AuthRequest, res) => {
  try {
    const postId = parseInt(String(req.params["id"]));
    const userId = req.user!.userId;
    const existing = await db.select().from(savedPostsTable)
      .where(and(eq(savedPostsTable.userId, userId), eq(savedPostsTable.postId, postId))).limit(1);
    if (existing.length > 0) {
      await db.delete(savedPostsTable).where(and(eq(savedPostsTable.userId, userId), eq(savedPostsTable.postId, postId)));
      res.json({ saved: false });
    } else {
      await db.insert(savedPostsTable).values({ userId, postId });
      res.json({ saved: true });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.get("/saved/list", requireAuth, async (req: AuthRequest, res) => {
  try {
    const saved = await db.select({
      post: blogPostsTable,
    }).from(savedPostsTable)
      .innerJoin(blogPostsTable, eq(savedPostsTable.postId, blogPostsTable.id))
      .where(eq(savedPostsTable.userId, req.user!.userId))
      .orderBy(desc(savedPostsTable.createdAt));
    res.json(saved.map(s => s.post));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
