import { faker } from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.address.city(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoom(hotelId: number) {
  await prisma.room.create({
    data: {
      capacity: faker.datatype.number({
        min: 0,
        max: 20,
      }),
      name: faker.name.jobArea(),
      hotelId,
    },
  });
}

export async function createHotelWithRooms() {
  const hotel = await createHotel();

  await createRoom(hotel.id);

  return await prisma.hotel.findFirst({
    where: {
      id: hotel.id,
    },
    include: {
      Rooms: true,
    },
  });
}
