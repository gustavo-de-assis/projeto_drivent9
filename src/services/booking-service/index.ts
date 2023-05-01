import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { notFoundError } from '@/errors';

async function listUserRoom(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  const booking = await bookingRepository.findUserBooking(userId);

  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

export const bookingService = {
  listUserRoom,
};
