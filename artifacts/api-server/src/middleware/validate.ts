import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e: { path: (string | number)[]; message: string }) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      res.status(400).json({ error: "Validatsiya xatosi", errors });
      return;
    }
    req.body = result.data;
    next();
  };
}
