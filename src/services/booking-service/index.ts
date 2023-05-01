import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { notFoundError, forbiddenError } from '@/errors';

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

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.TicketType.isRemote || ticket.status !== 'PAID' || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const booking = await bookingRepository.findBooking(roomId);
  if (!booking) {
    throw notFoundError();
  }

  if (booking.Booking.length === booking.capacity) {
    throw forbiddenError();
  }

  const newBooking = await bookingRepository.insertBooking(userId, roomId);

  return { bookingId: newBooking.id };
}

export const bookingService = {
  listUserRoom,
  createBooking,
};
