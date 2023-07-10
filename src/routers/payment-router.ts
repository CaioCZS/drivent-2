import { Router } from 'express';
import { authenticateToken } from '../middlewares';
import { getUserPayment, postUserPayment } from '../controllers/payments-controller';

const paymentRouter = Router();

paymentRouter.all('/*', authenticateToken);
paymentRouter.get('/', getUserPayment);
paymentRouter.post('/process', postUserPayment);

export { paymentRouter };
