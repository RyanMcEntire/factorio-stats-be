import {
  ValidData,
  ProductionEntry,
  ConsumptionEntry,
  ModEntry,
  ResearchEntry,
} from "../types/types";
import { pool } from "./pool";

interface Item {
  tick: number;
  item: string;
  delta_amount: number;
}

interface ItemsBySurface {
  [surface: string]: Item[];
}

export async function retrieveSnapshot(): Promise<ValidData | null> {
  const query = `
    SELECT stats 
    FROM game_stats 
    WHERE id = 1;`;
  try {
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      const snapshot = result.rows[0].stats;
      return snapshot;
    } else {
      console.log("no snapshot found in database");
      return null;
    }
  } catch (error) {
    console.error("Error retriving snapshot from database", error);
    throw error;
  }
}

export async function updateSnapshotWithClient(
  client: any,
  stats: ValidData,
): Promise<void> {
  const query = `
    INSERT INTO game_stats (id, stats)
    VALUES (1, $1::jsonb)
    ON CONFLICT (id)
    DO UPDATE SET stats = $1::jsonb;
`;
  try {
    await client.query(query, [stats]);
    console.log("Game stats database updated successfully");
  } catch (error) {
    console.error("Error adding stats to database: ", error);
  }
}

export async function retrieveSnapshotWithClient(
  client: any,
): Promise<ValidData | null> {
  const query = `
    SELECT stats 
    FROM game_stats 
    WHERE id = 1;`;

  try {
    const result = await client.query(query);

    if (result.rows.length > 0) {
      return result.rows[0].stats;
    } else {
      console.log("no snapshot found in database");
      return null;
    }
  } catch (error) {
    console.error("Error retriving snapshot from database", error);
    throw error;
  }
}

export async function updateProductionTable(
  surface: string,
  production: Partial<Record<string, number>>,
  tick: ValidData["tick"],
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const [item, amount] of Object.entries(production)) {
      const query = `
        INSERT INTO production_history (tick, surface, item, amount)
        VALUES ($1, $2, $3, $4);
      `;
      await client.query(query, [tick, surface, item, amount]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating production history: ", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateConsumptionTable(
  surface: string,
  consumption: Partial<Record<string, number>>,
  tick: ValidData["tick"],
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const [item, amount] of Object.entries(consumption)) {
      const query = `
        INSERT INTO consumption_history (tick, surface, item, amount)
        VALUES ($1, $2, $3, $4);
        `;
      await client.query(query, [tick, surface, item, amount]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating consumption history: ", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateResearchTable(
  research: ValidData["research"],
  tick: ValidData["tick"],
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const tech of research) {
      const query = `
        INSERT INTO research_history (tick, technology)
        VALUES ($1, $2);
      `;
      await client.query(query, [tick, tech]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateModsTable(
  mods: ValidData["mods"],
  tick: ValidData["tick"],
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const [mod, version] of Object.entries(mods)) {
      const query = `
        INSERT INTO mods_history (tick, name, version)
        VALUES ($1, $2, $3);
      `;
      await client.query(query, [tick, mod, version]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating mods history: ", error);
    throw error;
  } finally {
    client.release();
  }
}

/*
export async function getProductionHistory(): Promise<ProductionEntry[]> {
  const query =
    "SELECT tick, surface, item, amount FROM production_history ORDER BY tick DESC, item";
  const result = await pool.query(query);
  return result.rows;
}

export async function getConsumptionHistory(): Promise<ConsumptionEntry[]> {
  const query =
    "SELECT tick, surface, item, amount FROM consumption_history ORDER BY tick DESC, item";
  const result = await pool.query(query);
  return result.rows;
}
*/

export async function getProductionHistory(): Promise<ItemsBySurface> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * from complete_production_history_delta ORDER BY surface, item, tick",
    );
    const productionBySurface: ItemsBySurface = {};

    result.rows.forEach((row) => {
      if (!productionBySurface[row.surface]) {
        productionBySurface[row.surface] = [];
      }
      productionBySurface[row.surface].push({
        tick: row.tick,
        item: row.item,
        delta_amount: row.delta_amount,
      });
    });

    return productionBySurface;
  } finally {
    client.release();
  }
}

export async function getConsumptionHistory(): Promise<ItemsBySurface> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * from complete_consumption_history_delta ORDER BY surface, item, tick",
    );
    const consumptionBySurface: ItemsBySurface = {};

    result.rows.forEach((row) => {
      if (!consumptionBySurface[row.surface]) {
        consumptionBySurface[row.surface] = [];
      }
      consumptionBySurface[row.surface].push({
        tick: row.tick,
        item: row.item,
        delta_amount: row.delta_amount,
      });
    });

    return consumptionBySurface;
  } finally {
    client.release();
  }
}

export async function getResearchHistory(): Promise<ResearchEntry[]> {
  const query =
    "SELECT tick, technology FROM research_history ORDER BY tick DESC";
  const result = await pool.query(query);
  return result.rows;
}

export async function getModsHistory(): Promise<ModEntry[]> {
  const query =
    "SELECT tick, name, version FROM mods_history ORDER BY tick DESC";
  const result = await pool.query(query);
  return result.rows;
}
