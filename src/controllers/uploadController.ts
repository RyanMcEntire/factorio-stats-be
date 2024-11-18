import { Request, Response } from "express";
import {
  updateSnapshotWithClient,
  retrieveSnapshotWithClient,
} from "../db/queries";
import { ValidData } from "../types/types";
import { pool } from "../db/pool";

export async function handleStatsFromClient(req: Request, res: Response) {
  console.log("Received json data from client: ");
  const newStats: ValidData = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(123, 456)");

    const currentSnapshot = await retrieveSnapshotWithClient(client);

    if (!currentSnapshot || newStats.tick > currentSnapshot.tick) {
      await updateSnapshotWithClient(client, newStats);

      await client.query("COMMIT");

      res.status(200).send("The server received and updated your stats");
    } else {
      await client.query("COMMIT");
      res
        .status(200)
        .send("The server received your stats, but no update was necessary");
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error handling stats from client: ", error);
    res.status(500).send("An error occurred while processing your stats");
  } finally {
    client.release();
  }
}
