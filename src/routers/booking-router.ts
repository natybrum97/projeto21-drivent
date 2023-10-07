import { Router } from 'express';
import { bookingControllers } from '@/controllers/booking-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', bookingControllers.getBooking)
  .post('/', validateBody(bookingSchema), bookingControllers.postBooking)
  .put('/:bookingId', bookingControllers.putBooking);

export { bookingRouter };
