import { Request, Response, NextFunction } from "express";
import { ValidData } from "../types/types";

export function validateData(req: Request, res: Response, next: NextFunction) {
  const data = req.body as unknown;

  if (isValidData(data)) {
    req.body = data;
    next();
  } else {
    res.status(400).json({ error: "Invalid data structure" });
  }
}

function isValidData(data: unknown): data is ValidData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const { surface, tick, production, consumption, research, mods } =
    data as Partial<ValidData>;

  return (
    typeof surface === "string" &&
    typeof tick === "number" &&
    isValidObject(production) &&
    isValidObject(consumption) &&
    Array.isArray(research) &&
    isValidObject(mods)
  );
}

function isValidObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}
