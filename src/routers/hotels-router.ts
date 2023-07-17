import { Router } from 'express';
import { getHotelById, getHotels } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken);
hotelsRouter.get('/', getHotels);
hotelsRouter.get('/:hotelId', getHotelById);

export { hotelsRouter };
