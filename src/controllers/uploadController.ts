import { Request, Response } from 'express';

export default async function sayHiPost(req: Request, res: Response) {
  console.log('user says hi');
  res.status(200).send('the server says hi');
}
