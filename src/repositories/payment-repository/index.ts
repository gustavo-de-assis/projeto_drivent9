import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function findPaymentInfo(ticketId: number) {
  return await prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createPayment(ticketId: number, paymentInfo: PaymentInfo) {
  return prisma.payment.create({
    data: {
      ticketId,
      ...paymentInfo,
    },
  });
}

export type PaymentInfo = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

const paymentRepository = {
  findPaymentInfo,
  createPayment,
};

export default paymentRepository;
