import { ValidData } from "../types/types.js";
import { pool } from "./pool.js";
import { QueryResult } from "pg";

export async function updateGameStats(stats: any) {
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
