import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares';
import hotelsService from '../services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    await hotelsService.verifyUser(userId);
    const hotels = await hotelsService.findHotels();
    res.send(hotels);
  } catch (error) {
    if (error.type === 'no_content_error') {
      return res.status(httpStatus.NO_CONTENT).send([]);
    }
    if (error.type === 'not_found_error') {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    if (error.type === 'payment_error') {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);

  if (!hotelId || isNaN(hotelId)) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
  try {
    await hotelsService.verifyUser(userId);
    const hotel = await hotelsService.findHotelById(hotelId);
    res.send(hotel);
  } catch (error) {
    if (error.type === 'not_found_error') {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    if (error.type === 'payment_error') {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
