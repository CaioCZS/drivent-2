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

async function findRoom(id: number) {
  return prisma.room.findFirst({
    where: {
      id,
    },
  });
}

async function countRoom(id: number) {
  return prisma.booking.count({
    where: {
      roomId: id,
    },
  });
}

const hotelsRepository = { find, findById, findRoom, countRoom };

export default hotelsRepository;
