import { Request, Response } from "express";

export default async function sayHiPost(req: Request, res: Response) {
  console.log("Request received", req.headers);
  console.log("Received json data from client: ", req.body);
  res.status(200).send("the server received your stats");
}
