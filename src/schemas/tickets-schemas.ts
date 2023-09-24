import joi from 'joi';
import { createTickets } from '@/protocols';

export const ticketsSchema = joi.object<createTickets>({
  ticketTypeId: joi.number(),
});
