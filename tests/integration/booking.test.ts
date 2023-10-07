import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createHotel, createRoomWithHotelId } from '../factories/hotels-factory';
import { bookingFactory, createRoomWithZeroCapacity } from '../factories/booking-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);



describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {

    it('should respond with status 404 when user has no booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 with data in the correct format', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotelCreate = await createHotel();
      const roomCreate = await createRoomWithHotelId(hotelCreate.id)
      const bookingCreate = await bookingFactory.createBooking(user.id, roomCreate.id)

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);

      expect(response.body).toEqual({
        id: bookingCreate.id,
        Room: {
          id: roomCreate.id,
          name: roomCreate.name,
          hotelId: roomCreate.hotelId,
          capacity: roomCreate.capacity,
          createdAt: roomCreate.createdAt.toISOString(),
          updatedAt: roomCreate.updatedAt.toISOString()
        }
      });
    });

  });
});


describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {

    it('should respond with status 403 when user ticket is remote ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotelCreate = await createHotel();
      const roomCreate = await createRoomWithHotelId(hotelCreate.id)

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: roomCreate.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket doenst include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, false);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotelCreate = await createHotel();
      const roomCreate = await createRoomWithHotelId(hotelCreate.id)

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: roomCreate.id,
      });
      
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket is not paid ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      const hotelCreate = await createHotel();
      const roomCreate = await createRoomWithHotelId(hotelCreate.id)

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: roomCreate.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 404 when no exist roomId ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotelCreate = await createHotel();
      await createRoomWithHotelId(hotelCreate.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: 1,
      });

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when no exist capacity ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotelCreate = await createHotel();
      const roomCreate = await createRoomWithZeroCapacity(hotelCreate.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: roomCreate.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 with postBooking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotelCreate = await createHotel();
      const roomCreate = await createRoomWithHotelId(hotelCreate.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: roomCreate.id,
      });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number)
      });
    });



  })
});

describe('PUT /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking/:bookingId');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking/:bookingId').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/booking/:bookingId').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {

  })
});