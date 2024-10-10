import { Request, Response, NextFunction } from "express";
import { ValidData, ValidSurfaces, ValidItems } from "../types/types";

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

  const { tick, surfaces, research, mods } = data as Partial<ValidData>;

  return (
    typeof tick === "number" &&
    isValidSurfaces(surfaces) &&
    Array.isArray(research) &&
    research.every((item) => typeof item === "string") &&
    isValidObject(mods) &&
    Object.values(mods).every((value) => typeof value === "string")
  );
}

function isValidSurfaces(surfaces: unknown): surfaces is ValidSurfaces {
  if (!isValidObject(surfaces)) {
    return false;
  }
  return Object.values(surfaces).every(isValidItems);
}

function isValidItems(items: unknown): items is ValidItems {
  if (!isValidObject(items)) {
    return false;
  }
  const { production, consumption } = items as Partial<ValidItems>;
  return (
    isValidObject(production) &&
    isValidObject(consumption) &&
    Object.values(production!).every((value) => typeof value === "number") &&
    Object.values(consumption!).every((value) => typeof value === "number")
  );
}

function isValidObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}
