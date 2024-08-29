import { Request, Response } from 'express';
import { updateSnapshot } from '../db/queries';

export async function handleStatsFromClient(req: Request, res: Response) {
  console.log('Received json data from client: ');
  const allStats = req.body;
  await updateSnapshot(allStats);
  res.status(200).send('the server received your stats');
}
