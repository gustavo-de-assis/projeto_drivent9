import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function findPaymentInfo(ticketId: number) {
  return await prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

const paymentRepository = {
  findPaymentInfo,
};

export default paymentRepository;
