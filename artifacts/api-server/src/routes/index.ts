import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import leadsRouter from "./leads.js";
import usersRouter from "./users.js";
import blogRouter from "./blog.js";
import casesRouter from "./cases.js";
import servicesRouter from "./services.js";
import bannersRouter from "./banners.js";
import notificationsRouter from "./notifications.js";
import adminRouter from "./admin.js";
import translationsRouter from "./translations.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/leads", leadsRouter);
router.use("/users", usersRouter);
router.use("/blog", blogRouter);
router.use("/cases", casesRouter);
router.use("/services", servicesRouter);
router.use("/banners", bannersRouter);
router.use("/notifications", notificationsRouter);
router.use("/admin", adminRouter);
router.use("/translations", translationsRouter);

export default router;
