import { Router } from 'express';
import { hotelsController } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/types', hotelsController.getHotels)
  .get('/', hotelsController.getHotelsById)

export { hotelsRouter };
