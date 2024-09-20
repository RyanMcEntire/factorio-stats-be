import { Request, Response } from "express";
import { retrieveSnapshot } from "../db/queries";

export async function displaySnapshotGet(req: Request, res: Response) {
  try {
    const snapshotData = await retrieveSnapshot();
    res.json(snapshotData);
  } catch (error) {
    console.error("error retrieving snapshotData", error);
    res.status(500).send("An error occured when retreiving the snapshot data");
  }
}
