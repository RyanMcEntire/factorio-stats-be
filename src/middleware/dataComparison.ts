import { Request, Response, NextFunction } from "express";
import { retrieveSnapshot } from "../db/queries";
import {
  ValidData,
  ChangedData,
  ChangedItems,
  ChangedSurfaces,
  ValidSurfaces,
} from "../types/types";

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
        surfaces: newData.surfaces,
        research: newData.research,
        mods: newData.mods,
      };
    } else if (newData.tick > oldData.tick) {
      req.dataChanges = {
        surfaces: compareSurfaces(oldData.surfaces, newData.surfaces),
        research: compareArrays(oldData.research, newData.research),
        mods: compareObjects(oldData.mods, newData.mods),
      };
    } else {
      req.dataChanges = {
        surfaces: {},
        research: [],
        mods: {},
      };
    }
    next();
  });
}

function compareSurfaces(
  oldSurfaces: ValidSurfaces,
  newSurfaces: ValidSurfaces,
): ChangedSurfaces {
  const changes: ChangedSurfaces = {};

  for (const surfaceKey in newSurfaces) {
    if (!(surfaceKey in oldSurfaces)) {
      changes[surfaceKey] = newSurfaces[surfaceKey];
    } else {
      const oldSurface = oldSurfaces[surfaceKey];
      const newSurface = newSurfaces[surfaceKey];
      const surfaceChanges: ChangedItems = {};

      if (
        JSON.stringify(oldSurface.production) !==
        JSON.stringify(newSurface.production)
      ) {
        surfaceChanges.production = compareObjects(
          oldSurface.production,
          newSurface.production,
        );
      }

      if (
        JSON.stringify(oldSurface.consumption) !==
        JSON.stringify(newSurface.consumption)
      ) {
        surfaceChanges.consumption = compareObjects(
          oldSurface.consumption,
          newSurface.consumption,
        );
      }

      if (Object.keys(surfaceChanges).length > 0) {
        changes[surfaceKey] = surfaceChanges;
      }
    }
  }

  return changes;
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
