import { Request, Response, NextFunction } from "express";
import { ValidData } from "../types/types";

function validateData(req: Request, res: Response, next: NextFunction) {
  const data = req.body as Partial<ValidData>;

  if (
    typeof data.tick !== "number" ||
    !isValidObject(data.production) ||
    !isValidObject(data.consumption) ||
    !Array.isArray(data.research) ||
    !isValidObject(data.mods)
  ) {
    return res.status(400).json({ error: "Invalid data structure" });
  }

  req.body = data as ValidData;
  next();
}

function isValidObject(obj: any): boolean {
  return obj && typeof obj === "object" && !Array.isArray(obj);
}

export { validateData };
