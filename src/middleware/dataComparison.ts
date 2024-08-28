import { NextFunction, Request as ExpressRequest, Response } from "express";
import { ValidData } from "../types/types.js";
import { retrieveSnapshot } from "../db/queries.js";

export interface RequestWithDataChanges extends ExpressRequest {
  dataChanges?: {
    production: any;
    consumption: any;
    research: string[];
    mods: any;
  };
}

export async function compareData(
  req: RequestWithDataChanges,
  res: Response,
  next: NextFunction,
) {
  const data = req.body as ValidData;
  const oldData = await retrieveSnapshot();

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

function compareArrays(oldArr: string[], newArr: string[]): string[] {
  return newArr.filter((item) => !oldArr.includes(item));
}
