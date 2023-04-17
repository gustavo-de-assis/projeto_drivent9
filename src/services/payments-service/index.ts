import { Payment } from '@prisma/client';
import { notFoundError, unauthorizedError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function validatePaymentInfo(ticketId: number, userId: number) {
  const ticketInfo = await ticketRepository.findTicketById(ticketId);

  if (!ticketInfo) {
    throw notFoundError();
  }

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  if (enrollment.id !== ticketInfo.enrollmentId) {
    throw unauthorizedError();
  }
}

async function getPaymentInfo(ticketId: number, userId: number): Promise<Payment> {
  /* const ticketInfo = await ticketRepository.findTicketById(ticketId);

  if (!ticketInfo) {
    throw notFoundError();
  }

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  if (enrollment.id !== ticketInfo.enrollmentId) {
    throw unauthorizedError();
  } */

  await validatePaymentInfo(ticketId, userId);

  const payment = await paymentRepository.findPaymentInfo(ticketId);

  if (!payment) {
    throw notFoundError();
  }

  return payment;
}

async function paymentProcess(userId: number, ticketId: number, cardInfo: CardData) {
  await validatePaymentInfo(ticketId, userId);

  const ticket = await ticketRepository.findTicketById(ticketId);
  const enrollmentInfo = await ticketRepository.findTicketByEnrollment(ticket.enrollmentId);

  const paymentData = {
    ticketId,
    value: enrollmentInfo.TicketType.price,
    cardIssuer: cardInfo.issuer,
    cardLastDigits: cardInfo.number.toString().slice(-4),
  };

  const payment = await paymentRepository.createPayment(ticketId, paymentData);

  await ticketRepository.ticketProcessPayment(ticketId);

  return payment;
}

export type CardData = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

export const paymentService = {
  getPaymentInfo,
  paymentProcess,
};
