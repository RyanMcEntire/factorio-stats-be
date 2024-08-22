import { Router } from 'express';
import sayHiPost from '../controllers/uploadController.js';

const uploadRouter = Router();

uploadRouter.post('/upload', sayHiPost);

export { uploadRouter };
