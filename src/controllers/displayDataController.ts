import { Request, Response } from "express";
import {
  getProductionHistory,
  getConsumptionHistory,
  getResearchHistory,
  getModsHistory,
} from "../db/queries";

export async function displayDataGet(req: Request, res: Response) {
  console.log("Received request for the display data");
  try {
    const [production, consumption, research, mods] = await Promise.all([
      getProductionHistory(),
      getConsumptionHistory(),
      getResearchHistory(),
      getModsHistory(),
    ]);

    res.json({
      production,
      consumption,
      research,
      mods,
    });
  } catch (error) {
    console.error("Error retrieving game history:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving game history" });
  }
}
