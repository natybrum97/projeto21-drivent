import Joi from 'joi';
import { Body } from '@/protocols';

export const paymentSchema = Joi.object<Body>({
  ticketId: Joi.number().integer(),
  cardData: Joi.object({
    issuer: Joi.string(),
    number: Joi.number().integer(),
    name: Joi.string(),
    expirationDate: Joi.string(),
    cvv: Joi.string(),
  }),
});
