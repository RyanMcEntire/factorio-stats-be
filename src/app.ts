import express, { Response, Request } from "express";
import https from "https";
import fs from "fs";
import path from "path";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { uploadRouter } from "./routes/uploadRouter.js";

dotenv.config();
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
});
app.use(limiter);

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/upload", uploadRouter);

app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello World");
});

if (process.env.NODE_ENV === "production") {
  const options = {
    key: fs.readFileSync("/path/to/production/privkey.pem"),
    cert: fs.readFileSync("/path/to/production/fullchain.pem"),
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Production HTTPS server running on port ${PORT}`);
  });
} else {
  const options = {
    key: fs.readFileSync(path.join(__dirname, "../localhost-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../localhost.pem")),
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Development HTTPS server running on port ${PORT}`);
  });
}

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
