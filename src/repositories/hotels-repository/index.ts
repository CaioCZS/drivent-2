import { prisma } from '@/config';

async function find() {
  return prisma.hotel.findMany();
}

async function findById(id: number) {
  return prisma.hotel.findUnique({
    where: {
      id,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelsRepository = { find, findById };

export default hotelsRepository;
