import { Router } from 'express';
import { createTicket, getTicket, getTicketTypes } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', getTicketTypes).get('/', getTicket).post('/', createTicket);

export { ticketsRouter };
