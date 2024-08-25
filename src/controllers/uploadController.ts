import { Request, Response } from 'express';
import { updateGameStats } from '../db/queries.js';

export default async function sayHiPost(req: Request, res: Response) {
  console.log('Request received', req.headers);
  console.log('Received json data from client: ');
  const allStats = req.body;
  await updateGameStats(allStats);
  res.status(200).send('the server received your stats');
}
