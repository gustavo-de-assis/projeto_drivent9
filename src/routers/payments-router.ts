import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getPaymentInfoByTicket, processPayment } from '@/controllers/payments-controller';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', getPaymentInfoByTicket).post('/process', processPayment);

export { paymentsRouter };
