import { forbiddenError, notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { bookingRepository } from '@/repositories/booking-repository';

async function findBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) throw notFoundError();

  const getBooking = {
    id: booking.id,
    Room: booking.Room,
  };

  return getBooking;
}

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false || ticket.status === 'RESERVED')
    throw forbiddenError();

  const roomIdexist = await bookingRepository.existRoomId(roomId);

  if (!roomIdexist) throw notFoundError();

  if (roomIdexist.capacity <= roomIdexist.Booking.length) throw forbiddenError();

  const bookingCreated = await bookingRepository.createBooking(userId, roomId);

  const bookingIdreturn = {
    bookingId: bookingCreated.id,
  };

  return bookingIdreturn;
}

async function putBooking(userId: number, roomId: number, bookingId: number) {
  const roomIdexist = await bookingRepository.existRoomId(roomId);

  if (!roomIdexist) throw notFoundError();

  const bookingIdexist = await bookingRepository.existBookingId(bookingId);

  if (!bookingIdexist) throw forbiddenError();

  if (roomIdexist.capacity <= roomIdexist.Booking.length) throw forbiddenError();

  const booking = await bookingRepository.putBooking(bookingId, roomId);

  const putBooking = {
    bookingId: booking.id,
  };

  return putBooking;
}

export const bookingService = {
  findBooking,
  createBooking,
  putBooking,
};
