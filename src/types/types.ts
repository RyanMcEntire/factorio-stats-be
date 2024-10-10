export type ValidItems = {
  production: { [key: string]: number };
  consumption: { [key: string]: number };
};

export type ValidSurfaces = {
  [key: string]: ValidItems;
};

export interface ValidData {
  tick: number;
  surfaces: ValidSurfaces;
  research: string[];
  mods: { [key: string]: string };
}

export type ChangedItems = {
  production?: Partial<Record<string, number>>;
  consumption?: Partial<Record<string, number>>;
};

export type ChangedSurfaces = {
  [key: string]: ChangedItems;
};

export interface ChangedData {
  surfaces: ChangedSurfaces;
  research: string[];
  mods: Partial<Record<string, string>>;
}

type ItemChanges = {
  production: Record<string, number>;
  consumption: Record<string, number>;
};

type SurfaceChanges = {
  [key: string]: ItemChanges;
};

export type DataChanges = {
  surfaces: SurfaceChanges;
  research: string[];
  mods: Record<string, string>;
};

export type PartialDataChanges = {
  surfaces: ChangedSurfaces;
  research: string[];
  mods: Partial<Record<string, string>>;
};

export interface ProductionEntry {
  tick: number;
  surface: string;
  item: string;
  amount: number;
}

export interface ConsumptionEntry {
  tick: number;
  surface: string;
  item: string;
  amount: number;
}

export interface ResearchEntry {
  tick: number;
  technology: string;
}

export interface ModEntry {
  tick: number;
  name: string;
  version: string;
}
