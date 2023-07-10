import { Router } from 'express';

import { authenticateToken } from '@/middlewares';
import { createUserTicket, getTicketsTypes, getUserTicket } from '@/controllers';

const ticketRouter = Router();

ticketRouter.all('/*', authenticateToken);
ticketRouter.get('/types', getTicketsTypes);
ticketRouter.get('/', getUserTicket);
ticketRouter.post('/', createUserTicket);

export { ticketRouter };
