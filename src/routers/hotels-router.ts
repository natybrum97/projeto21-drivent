import { Router } from 'express';
import { hotelsController } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/', hotelsController.getHotels)
  .get('/:id', hotelsController.getHotelsById);

export { hotelsRouter };
