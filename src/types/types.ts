interface ValidData {
  tick: number;
  production: { [key: string]: number };
  consumption: { [key: string]: number };
  research: string[];
  mods: { [key: string]: string };
}

export { ValidData };
