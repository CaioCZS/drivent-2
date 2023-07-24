import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares';
import bookingService from '../services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const booking = await bookingService.findBooking(userId);
  const { id, Room } = booking;

  res.send({ id, Room });
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId = Number(req.body.roomId);

  if (!roomId || isNaN(roomId)) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const booking = await bookingService.createBooking(userId, roomId);
    res.send({ bookingId: booking.id });
  } catch (error) {
    if (error.name === ('NotFoundError' || 'not_found_error')) {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    if (error.type === 'payment_error') {
      return res.status(httpStatus.FORBIDDEN).send(error.message);
    }
    res.status(500).send(error.message);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const bookingId = Number(req.params.bookingId);
  const roomId = Number(req.body.roomId);

  if (!roomId || !bookingId || isNaN(roomId) || isNaN(bookingId)) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const booking = await bookingService.updateBooking(userId, roomId, bookingId);
    res.send({ bookingId: booking.id });
  } catch (error) {
    if (error.name === ('NotFoundError' || 'not_found_error')) {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    if (error.type === 'payment_error') {
      return res.status(httpStatus.FORBIDDEN).send(error.message);
    }
    res.status(500).send(error.message);
  }
}
