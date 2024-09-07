import { Request, Response, NextFunction } from "express";
import { retrieveSnapshot } from "../db/queries";
import { ValidData, ChangedData } from "../types/types";

declare module "express-serve-static-core" {
  interface Request {
    dataChanges?: ChangedData;
  }
}

export function compareData(req: Request, res: Response, next: NextFunction) {
  const newData = req.body as ValidData;
  retrieveSnapshot().then((oldData: ValidData | null) => {
    if (!oldData) {
      req.dataChanges = {
        production: newData.production,
        consumption: newData.consumption,
        research: newData.research,
        mods: newData.mods,
      };
    } else if (newData.tick > oldData.tick) {
      req.dataChanges = {
        production: compareObjects(oldData.production, newData.production),
        consumption: compareObjects(oldData.consumption, newData.consumption),
        research: compareArrays(oldData.research, newData.research),
        mods: compareObjects(oldData.mods, newData.mods),
      };
    } else {
      req.dataChanges = {
        production: {},
        consumption: {},
        research: [],
        mods: {},
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
