import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ticketService } from '@/services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketTypes(_req: Request, res: Response) {
  try {
    const ticketTypes = await ticketService.getTicketTypes();
    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const ticket = await ticketService.getTicket(userId);

    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}
