import { notFoundError } from '../../errors';
import bookingRepository from '../../repositories/booking-repository';
import hotelsService from '../hotels-service';

async function findBooking(userId: number) {
  const booking = await bookingRepository.find(userId);
  if (!booking) {
    throw notFoundError();
  }
  return booking;
}

async function createBooking(userId: number, roomId: number) {
  await hotelsService.verifyUser(userId);
  await hotelsService.verifyRoom(roomId);
  const booking = await bookingRepository.create(userId, roomId);
  return booking;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  await hotelsService.verifyUser(userId);
  await hotelsService.verifyRoom(roomId);
  const booking = await bookingRepository.find(userId);
  if (!booking) {
    throw {
      type: 'payment_error',
      message: 'user dosent have an booking yet',
    };
  }
  const updatedBooking = await bookingRepository.update(bookingId, roomId);
  return updatedBooking;
}

const bookingService = { findBooking, createBooking, updateBooking };

export default bookingService;
