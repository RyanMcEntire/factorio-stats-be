import { Response, NextFunction } from "express";
import { RequestWithDataChanges } from "./dataComparison";
import {
  updateProductionTable,
  updateConsumptionTable,
  updateModsTable,
  updateResearchTable,
} from "../db/queries";

expert async function updateDatabase(
  req: RequestWithDataChanges,
  res: Response,
  next: NextFunction,
) {
  const changes = req.dataChanges;
  const tick = req.body.tick;

  if (!changes) {
    return next(new Error("Data changes not found"));
  }

  try {
    if (Object.keys(changes.production).length > 0) {
      await updateProductionTable(changes.production, tick);
    }
    if (Object.keys(changes.consumption).length > 0) {
      await updateConsumptionTable(changes.consumption, tick);
    }
    if (changes.research.length > 0) {
      await updateResearchTable(changes.research, tick);
    }
    if (Object.keys(changes.mods).length > 0) {
      await updateModsTable(changes.mods, tick);
    }
    next();
  } catch (error) {
    next(error);
  }
}
