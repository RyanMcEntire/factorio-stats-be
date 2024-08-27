import express, { Response, Request } from "express";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { uploadRouter } from "./routes/uploadRouter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
});
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/upload", uploadRouter);

app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello Worlds");
});

const options = {
  key: fs.readFileSync(
    process.env.NODE_ENV === "production"
      ? "/path/to/production/privkey.pem"
      : path.join(__dirname, "../localhost-key.pem"),
  ),
  cert: fs.readFileSync(
    process.env.NODE_ENV === "production"
      ? "/path/to/production/fullchain.pem"
      : path.join(__dirname, "../localhost.pem"),
  ),
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS server running on port ${PORT}`);
});
