import { Router } from 'express';
import { apiKeyAuth } from '../middleware/apiKeyAuth';
import { handleStatsFromClient } from '../controllers/uploadController';
import { validateData } from '../middleware/dataValidation';
import { compareData } from '../middleware/dataComparison';
import { updateDatabase } from '../middleware/updateDatabase';

const uploadRouter = Router();

uploadRouter.post(
  '/',
  apiKeyAuth,
  validateData,
  compareData,
  updateDatabase,
  handleStatsFromClient
);

export { uploadRouter };
