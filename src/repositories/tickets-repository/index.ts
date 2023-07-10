import { prisma } from '@/config';

async function findMany() {
  return prisma.ticketType.findMany();
}

async function findUnique(id: number) {
  return prisma.ticket.findFirst({
    include: {
      TicketType: true,
    },
    where: {
      enrollmentId: id,
    },
  });
}

async function create(ticketTypeId: number, enrollmentId: number) {
  return prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: 'RESERVED',
      updatedAt: new Date(),
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketRepository = { findMany, findUnique, create };

export default ticketRepository;