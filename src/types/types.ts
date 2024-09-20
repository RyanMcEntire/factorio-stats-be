export interface ValidData {
  surface: string;
  tick: number;
  production: { [key: string]: number };
  consumption: { [key: string]: number };
  research: string[];
  mods: { [key: string]: string };
}

export interface ChangedData {
  production: Partial<Record<string, number>>;
  surface: string;
  consumption: Partial<Record<string, number>>;
  research: string[];
  mods: Partial<Record<string, string>>;
}

export type DataChanges = {
  surface: string;
  production: Record<string, number>;
  consumption: Record<string, number>;
  research: string[];
  mods: Record<string, string>;
};

export type PartialDataChanges = {
  surface: string;
  production: Partial<Record<string, number>>;
  consumption: Partial<Record<string, number>>;
  research: string[];
  mods: Partial<Record<string, string>>;
};

export interface ProductionEntry {
  surface: string;
  tick: number;
  item: string;
  amount: number;
}

export interface ConsumptionEntry {
  surface: string;
  tick: number;
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
