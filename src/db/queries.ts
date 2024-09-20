import {
  ValidData,
  ProductionEntry,
  ConsumptionEntry,
  ModEntry,
  ResearchEntry,
} from "../types/types";
import { pool } from "./pool";

const surface = "nauvis";

export async function updateSnapshot(stats: ValidData): Promise<void> {
  const query = `
    INSERT INTO game_stats (id, stats)
    VALUES (1, $1::jsonb)
    ON CONFLICT (id)
    DO UPDATE SET stats = $1::jsonb;
`;
  try {
    await pool.query(query, [stats]);
    console.log("Game stats database updated successfully");
  } catch (error) {
    console.error("Error adding stats to database: ", error);
  }
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

export async function updateProductionTable(
  production: ValidData["production"],
  tick: ValidData["tick"],
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const [item, amount] of Object.entries(production)) {
      const query = `
        INSERT INTO production_history (tick, item, amount)
        VALUES ($1, $2, $3);
      `;
      await client.query(query, [tick, item, amount]);
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
  consumption: ValidData["consumption"],
  tick: ValidData["tick"],
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const [item, amount] of Object.entries(consumption)) {
      const query = `
        INSERT INTO consumption_history (tick, item, amount)
        VALUES ($1, $2, $3);
        `;
      await client.query(query, [tick, item, amount]);
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

export async function getProductionHistory(): Promise<ProductionEntry[]> {
  const query = "SELECT * FROM production_history ORDER BY tick DESC, item";
  const result = await pool.query(query);
  return result.rows;
}

export async function getConsumptionHistory(): Promise<ConsumptionEntry[]> {
  const query = "SELECT * FROM consumption_history ORDER BY tick DESC, item";
  const result = await pool.query(query);
  return result.rows;
}

export async function getResearchHistory(): Promise<ResearchEntry[]> {
  const query = "SELECT * FROM research_history ORDER BY tick DESC";
  const result = await pool.query(query);
  return result.rows;
}

export async function getModsHistory(): Promise<ModEntry[]> {
  const query = "SELECT * FROM mods_history ORDER BY tick DESC, name";
  const result = await pool.query(query);
  return result.rows;
}
