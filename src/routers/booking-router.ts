import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getRooms } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', getRooms).post('/').put('/:bookingId');

export { bookingRouter };
