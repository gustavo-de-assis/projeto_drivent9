import { Payment } from '@prisma/client';
import { notFoundError, unauthorizedError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function getPaymentInfo(ticketId: number, userId: number): Promise<Payment> {
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

  const payment = await paymentRepository.findPaymentInfo(ticketId);

  if (!payment) {
    throw notFoundError();
  }

  return payment;
}

export const paymentService = {
  getPaymentInfo,
};
