export interface ValidData {
  tick: number;
  production: { [key: string]: number };
  consumption: { [key: string]: number };
  research: string[];
  mods: { [key: string]: string };
}

export interface ChangedData {
  production: Partial<Record<string, number>>;
  consumption: Partial<Record<string, number>>;
  research: string[];
  mods: Partial<Record<string, string>>;
}

export type DataChanges = {
  production: Record<string, number>;
  consumption: Record<string, number>;
  research: string[];
  mods: Record<string, string>;
};

export type PartialDataChanges = {
  production: Partial<Record<string, number>>;
  consumption: Partial<Record<string, number>>;
  research: string[];
  mods: Partial<Record<string, string>>;
};

export interface ProductionEntry {
  tick: number;
  item: string;
  amount: number;
}

export interface ConsumptionEntry {
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

