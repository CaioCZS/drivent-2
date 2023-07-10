import { Ticket } from '@prisma/client';
import { notFoundError, unauthorizedError } from '../../errors';
import enrollmentRepository from '../../repositories/enrollment-repository';
import ticketRepository from '../../repositories/tickets-repository';

async function getAllTicketTypes() {
  return ticketRepository.findMany();
}

async function getUserTicket(userId: number) {
  const enrollment = await enrollmentRepository.findFirst(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  return ticketRepository.findUnique(enrollment.id);
}

async function createTicket(ticketId: number, userId: number) {
  const enrollment = await enrollmentRepository.findFirst(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  return ticketRepository.create(ticketId, enrollment.id);
}

async function ticketExist(id: number) {
  const ticket = await ticketRepository.findTicketId(id);
  if (!ticket) {
    throw notFoundError();
  }
  return ticket;
}

async function ticketIsFromUser(userId: number, ticket: Ticket) {
  const enrollment = await enrollmentRepository.findFirst(userId);
  if (enrollment.id !== ticket.enrollmentId) {
    throw unauthorizedError();
  }
}

async function updateStatus(ticketId: number) {
  return ticketRepository.updateStatus(ticketId);
}

const ticketsService = {
  getAllTicketTypes,
  getUserTicket,
  createTicket,
  ticketExist,
  ticketIsFromUser,
  updateStatus,
};

export default ticketsService;
