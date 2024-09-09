import { Request, Response } from "express";

export async function displayDataGet(req: Request, res: Response) {
  console.log("Received request for the display data");
}
