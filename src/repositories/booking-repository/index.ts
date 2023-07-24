import { prisma } from '@/config';

async function find(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}
async function create(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

async function update(bookingId: number, roomId: number) {
  return prisma.booking.update({
    data: {
      roomId,
    },
    where: {
      id: bookingId,
    },
  });
}

const bookingRepository = {
  find,
  create,
  update,
};

export default bookingRepository;
