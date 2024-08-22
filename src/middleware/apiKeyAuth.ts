import { Request, Response, NextFunction } from "express";

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const API_KEYS = [
    process.env.API_KEY_1,
    process.env.API_KEY_2,
    process.env.API_KEY_3,
  ];
  const apiKey = req.header("X-API-Key");
  console.log("api Key Received");
  if (!apiKey || !API_KEYS.includes(apiKey)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};
