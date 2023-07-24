import { createHotelWithRooms } from './hotels-factory';
import { prisma } from '@/config';

export async function createBooking(userId: number) {
  const hotel = await createHotelWithRooms();
  return await prisma.booking.create({
    data: {
      roomId: hotel.Rooms[0].id,
      userId,
    },
    include: {
      Room: true,
    },
  });
}
