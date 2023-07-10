import Joi from 'joi';

export type TicketTypeId = { ticketTypeId: number };

export const ticketTypeIdSchema = Joi.object<TicketTypeId>({
  ticketTypeId: Joi.number().integer().required,
});
