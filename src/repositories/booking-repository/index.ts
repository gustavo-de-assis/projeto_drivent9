import { prisma } from '@/config';

async function findUserBooking(userId: number) {
  return await prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

const bookingRepository = {
  findUserBooking,
};

export default bookingRepository;
