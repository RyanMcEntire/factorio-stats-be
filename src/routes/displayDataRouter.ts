import { Router } from "express";
import { displayDataGet } from "../controllers/displayDataController";
const displayDataRouter = Router();

displayDataRouter.get("/", displayDataGet);

export { displayDataRouter };
