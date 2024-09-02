import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { uploadRouter } from './routes/uploadRouter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/upload', uploadRouter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello World');
});

app.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});

export default app;
