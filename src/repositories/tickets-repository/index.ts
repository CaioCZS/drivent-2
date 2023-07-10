import { prisma } from '@/config';

async function findMany() {
  return prisma.ticketType.findMany();
}

const ticketRepository = { findMany };

export default ticketRepository;
