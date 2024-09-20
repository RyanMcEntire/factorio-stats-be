import { Request, Response, NextFunction } from "express";
import {
  updateProductionTable,
  updateConsumptionTable,
  updateModsTable,
  updateResearchTable,
} from "../db/queries";
import { PartialDataChanges } from "../types/types";

export async function updateDatabase(
  req: Request & { dataChanges?: PartialDataChanges },
  res: Response,
  next: NextFunction,
) {
  const changes = req.dataChanges;
  const tick = req.body.tick;

  if (!changes) {
    return next(new Error("Data changes not found"));
  }

  const hasChanges =
    Object.keys(changes.surface).length > 0 ||
    Object.keys(changes.production).length > 0 ||
    Object.keys(changes.consumption).length > 0 ||
    changes.research.length > 0 ||
    Object.keys(changes.mods).length > 0;

  if (!hasChanges) {
    console.log("No changes to apply");
    return next();
  }

  try {
    if (Object.keys(changes.production).length > 0) {
      await updateProductionTable(
        changes.production as Record<string, number>,
        tick,
      );
    }
    if (Object.keys(changes.consumption).length > 0) {
      await updateConsumptionTable(
        changes.consumption as Record<string, number>,
        tick,
      );
    }
    if (changes.research.length > 0) {
      await updateResearchTable(changes.research, tick);
    }
    if (Object.keys(changes.mods).length > 0) {
      await updateModsTable(changes.mods as Record<string, string>, tick);
    }
    next();
  } catch (error) {
    next(error);
  }
}
