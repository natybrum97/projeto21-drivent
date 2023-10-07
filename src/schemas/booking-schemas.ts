import Joi from 'joi';
import { BodyBooking } from '@/protocols';

export const bookingSchema = Joi.object<BodyBooking>({
  roomId: Joi.number().required(),
});
