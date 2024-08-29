import { Request, Response, NextFunction } from 'express';
import { retrieveSnapshot } from '../db/queries';
import { ValidData, ChangedData } from '../types/types';

declare module 'express-serve-static-core' {
  interface Request {
    dataChanges?: ChangedData;
  }
}

export function compareData(req: Request, res: Response, next: NextFunction) {
  const data = req.body as ValidData;
  retrieveSnapshot().then((oldData: ValidData | null) => {
    if (!oldData) {
      req.dataChanges = {
        production: data.production,
        consumption: data.consumption,
        research: data.research,
        mods: data.mods,
      };
    } else {
      req.dataChanges = {
        production: compareObjects(oldData.production, data.production),
        consumption: compareObjects(oldData.consumption, data.consumption),
        research: compareArrays(oldData.research, data.research),
        mods: compareObjects(oldData.mods, data.mods),
      };
    }
    next();
  });
}

function compareObjects<T>(oldObj: T, newObj: T): Partial<T> {
  const changes: Partial<T> = {};
  for (const key in newObj) {
    if (oldObj[key] !== newObj[key]) {
      changes[key] = newObj[key];
    }
  }
  return changes;
}

function compareArrays<T>(oldArr: T[], newArr: T[]): T[] {
  return newArr.filter((item) => !oldArr.includes(item));
}
