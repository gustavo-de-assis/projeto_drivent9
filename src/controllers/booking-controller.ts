import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services/booking-service';

export async function getRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const room = await bookingService.listUserRoom(Number(userId));
    return res.status(httpStatus.OK).send(room);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
