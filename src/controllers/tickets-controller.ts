import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketsService from '../services/tickets-service';

export async function getTicketsTypes(req: Request, res: Response) {
  const types = await ticketsService.getAllTicketTypes();
  res.send(types);
}

export async function getUserTicket(req: Request, res: Response) {
  res.send('getUserTicket');
}

export async function createUserTicket(req: Request, res: Response) {
  res.send('createUserTicket');
}
