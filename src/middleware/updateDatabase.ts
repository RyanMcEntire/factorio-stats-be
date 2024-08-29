import { Request, Response, NextFunction } from 'express';
import {
  updateProductionTable,
  updateConsumptionTable,
  updateModsTable,
  updateResearchTable,
} from '../db/queries';
import { PartialDataChanges } from '../types/types';

export async function updateDatabase(
  req: Request & { dataChanges?: PartialDataChanges },
  res: Response,
  next: NextFunction
) {
  const changes = req.dataChanges;
  const tick = req.body.tick;

  if (!changes) {
    return next(new Error('Data changes not found'));
  }

  try {
    if (Object.keys(changes.production).length > 0) {
      await updateProductionTable(
        changes.production as Record<string, number>,
        tick
      );
    }
    if (Object.keys(changes.consumption).length > 0) {
      await updateConsumptionTable(
        changes.consumption as Record<string, number>,
        tick
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
