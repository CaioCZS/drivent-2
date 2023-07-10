import { notFoundError } from '../../errors';
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

const ticketsService = {
  getAllTicketTypes,
  getUserTicket,
  createTicket,
};

export default ticketsService;
