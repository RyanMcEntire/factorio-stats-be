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