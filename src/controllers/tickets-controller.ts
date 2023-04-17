import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketService from '@/services/tickets-service';

export async function getTicketTypes(_req: Request, res: Response) {
  try {
    const ticketTypes = await ticketService.getTicketTypes();
    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send({});
  }
}
