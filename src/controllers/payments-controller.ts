import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares';
import paymentService from '../services/payments-service';
import ticketsService from '../services/tickets-service';
import { PaymentBody } from '../schemas/payments-schema';

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
  const { ticketId, cardData } = req.body as PaymentBody;
  const { userId } = req;
  if (!ticketId || !cardData) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
  const ticket = await ticketsService.ticketExist(ticketId);
  await ticketsService.ticketIsFromUser(userId, ticket);

  const value = ticket.TicketType.price;
  const payment = await paymentService.createPayment(req.body, value);
  await ticketsService.updateStatus(ticketId);
  res.send(payment);
}
