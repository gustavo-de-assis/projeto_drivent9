import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getRooms, postBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', getRooms).post('/', postBooking).put('/:bookingId');

export { bookingRouter };
