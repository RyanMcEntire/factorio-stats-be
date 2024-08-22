import { Router } from "express";
import { apiKeyAuth } from "../middleware/apiKeyAuth.js";
import sayHiPost from "../controllers/uploadController.js";

const uploadRouter = Router();

uploadRouter.post("/", apiKeyAuth, sayHiPost);

export { uploadRouter };
