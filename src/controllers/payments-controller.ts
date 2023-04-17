import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { paymentService } from '@/services';

export async function getPaymentInfoByTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticketId = Number(req.query.ticketId);

  if (!ticketId) {
    res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const payment = await paymentService.getPaymentInfo(ticketId, userId);

    if (!payment) {
      res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
