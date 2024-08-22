import express, { Response, Request } from 'express';
import dotenv from 'dotenv';
import { uploadRouter } from './routes/uploadRouter.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use('/upload', uploadRouter);

app.get('/', (request: Request, response: Response) => {
  response.status(200).send('Hello World');
});

app
  .listen(PORT, () => {
    console.log('Server running at PORT: ', PORT);
  })
  .on('error', (error) => {
    throw new Error(error.message);
  });
