import { TicketStatus } from '@prisma/client';
import enrollmentRepository from '../../repositories/enrollment-repository';
import ticketRepository from '../../repositories/tickets-repository';
import { notFoundError } from '../../errors';
import hotelsRepository from '@/repositories/hotels-repository';

async function findHotels() {
  const hotels = await hotelsRepository.find();
  if (hotels.length === 0) {
    throw {
      type: 'not_found_error',
      maessage: 'no hotels found',
    };
  }
  return hotels;
}

async function findHotelById(id: number) {
  const hotel = await hotelsRepository.findById(id);
  if (!hotel) {
    throw {
      type: 'not_found_error',
      message: 'this hotel dosent exist',
    };
  }

  return hotel;
}

async function verifyRoom(id: number) {
  const room = await hotelsRepository.findRoom(id);
  if (!room) {
    throw notFoundError();
  }
  const count = await hotelsRepository.countRoom(id);
  if (room.capacity === count) {
    throw {
      type: 'payment_error',
      message: 'no vagancy for this room',
    };
  }
}

async function verifyUser(id: number) {
  const enrrolment = await enrollmentRepository.findFirst(id);
  if (!enrrolment) {
    throw {
      type: 'not_found_error',
      message: 'user do not have an enrrolment',
    };
  }

  const ticket = await ticketRepository.findUnique(enrrolment.id);
  if (!ticket) {
    throw {
      type: 'not_found_error',
      message: 'user do not have an ticket',
    };
  }

  if (
    ticket.TicketType.includesHotel === false ||
    ticket.TicketType.isRemote === true ||
    ticket.status === TicketStatus.RESERVED
  ) {
    throw {
      type: 'payment_error',
      message: 'payment error',
    };
  }
}
const hotelsService = { findHotels, findHotelById, verifyUser, verifyRoom };

export default hotelsService;
