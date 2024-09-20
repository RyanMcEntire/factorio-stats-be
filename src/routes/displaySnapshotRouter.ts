import { Router } from "express";
import { displaySnapshotGet } from "../controllers/displaySnapshotController";

const displaySnapshotRouter = Router();

displaySnapshotRouter.get("/", displaySnapshotGet);

export { displaySnapshotRouter };
