import { ValidData } from "../types/types.js";
import { pool } from "./pool.js";
import { QueryResult } from "pg";

export async function updateSnapshot(stats: any) {
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
    const result: QueryResult = await pool.query(query);

    if (result.rows.length > 0) {
      const snapshot: ValidData = result.rows[0].stats;
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
  tick: number,
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
  tick: number,
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
  tick: number,
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
  tick: number,
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
