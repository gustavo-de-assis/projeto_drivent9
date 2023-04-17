import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getPaymentInfoByTicket } from '@/controllers/payments-controller';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', getPaymentInfoByTicket);
//.post('/',);

export { paymentsRouter };
