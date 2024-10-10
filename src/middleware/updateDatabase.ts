import { Request, Response, NextFunction } from "express";
import {
  updateProductionTable,
  updateConsumptionTable,
  updateModsTable,
  updateResearchTable,
} from "../db/queries";
import { ChangedData } from "../types/types";

export async function updateDatabase(
  req: Request & { dataChanges?: ChangedData },
  res: Response,
  next: NextFunction,
) {
  const changes = req.dataChanges;
  const tick = req.body.tick;

  if (!changes) {
    return next(new Error("Data changes not found"));
  }

  const hasChanges =
    Object.keys(changes.surfaces).length > 0 ||
    changes.research.length > 0 ||
    Object.keys(changes.mods).length > 0;

  if (!hasChanges) {
    console.log("No changes to apply");
    return next();
  }

  try {
    for (const [surfaceName, surfaceChanges] of Object.entries(
      changes.surfaces,
    )) {
      if (surfaceChanges.production) {
        await updateProductionTable(
          surfaceName,
          surfaceChanges.production,
          tick,
        );
      }
      if (surfaceChanges.consumption) {
        await updateConsumptionTable(
          surfaceName,
          surfaceChanges.consumption,
          tick,
        );
      }
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
