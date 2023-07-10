import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares';
import { TicketTypeId } from '../schemas';
import paymentService from '../services/payments-service';
import { requestError } from '../errors';
import ticketsService from '../services/tickets-service';

export async function getUserPayment(req: AuthenticatedRequest, res: Response) {
  const ticketId = Number(req.query.ticketId);
  const { userId } = req;
  if (!ticketId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
  const ticket = await ticketsService.ticketExist(ticketId);
  await ticketsService.ticketIsFromUser(userId, ticket);

  const payment = await paymentService.getPayment(ticketId);

  res.send(payment);
}

export async function postUserPayment(req: AuthenticatedRequest, res: Response) {
  res.send('postUserPayment');
}
