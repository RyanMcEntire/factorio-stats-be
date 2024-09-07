import { Request, Response } from "express";
import { updateSnapshot, retrieveSnapshot } from "../db/queries";
import { ValidData } from "../types/types";

export async function handleStatsFromClient(req: Request, res: Response) {
  console.log("Received json data from client: ");
  const newStats: ValidData = req.body;

  try {
    const currentSnapshot = await retrieveSnapshot();

    if (!currentSnapshot || newStats.tick > currentSnapshot.tick) {
      await updateSnapshot(newStats);
      res.status(200).send("The server received and updated your stats");
    } else {
      res
        .status(200)
        .send("The server received your stats, but no update was necessary");
    }
  } catch (error) {
    console.error("Error handling stats from client: ", error);
    res.status(500).send("An error occurred while processing your stats");
  }
}
