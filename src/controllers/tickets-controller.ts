import { Response } from 'express';
import httpStatus from 'http-status';
import ticketsService from '../services/tickets-service';
import { AuthenticatedRequest } from '../middlewares';
import { notFoundError } from '../errors';
import { TicketTypeId } from '../schemas';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  const types = await ticketsService.getAllTicketTypes();
  return res.status(httpStatus.OK).send(types);
}

export async function getUserTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticket = await ticketsService.getUserTicket(userId);
  if (!ticket) {
    throw notFoundError();
  }
  return res.status(httpStatus.OK).send(ticket);
}

export async function createUserTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body as TicketTypeId;

  if (!ticketTypeId || typeof ticketTypeId !== 'number') {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
  const { userId } = req;

  const ticket = await ticketsService.createTicket(ticketTypeId, userId);

  return res.status(httpStatus.CREATED).send(ticket);
}
