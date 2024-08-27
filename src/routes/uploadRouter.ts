import { Router } from "express";
import { apiKeyAuth } from "../middleware/apiKeyAuth.js";
import { handleStatsFromClient } from "../controllers/uploadController.js";
import { validateData } from "../middleware/dataValidation.js";
import { compareData } from "../middleware/dataComparison.js";

const uploadRouter = Router();

uploadRouter.post(
  "/",
  apiKeyAuth,
  validateData,
  compareData,
  handleStatsFromClient,
);

export { uploadRouter };
