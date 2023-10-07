import { bookingRepository, enrollmentRepository, ticketsRepository } from "@/repositories";
import { bookingService } from "@/services";
import { faker } from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";


beforeEach(() => {
  jest.clearAllMocks();
});


describe("GET /booking", () => {
  it("deveria retornar um erro quando usuário não tem reserva ", () => {
    
    const bookingMock = jest.spyOn(bookingRepository, "findBooking").mockImplementation((): any => {
      return undefined;
    });

    const booking = bookingService.findBooking(1);

    expect(bookingMock).toBeCalledTimes(1);

    expect(booking).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
  })

  it('Deveria retornar os dados no formato correto', async () => {
    const mockBooking = {
      id: 1,
      userId: 1,
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Room: {
        id: 1,
        capacity: 2,
        hotelId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: faker.name.firstName(),
      },
    };

    jest.spyOn(bookingRepository, 'findBooking').mockResolvedValueOnce(mockBooking);

    const booking = await bookingService.findBooking(1);

    expect(booking).toEqual({
      id: mockBooking.id,
      Room: {
        id: mockBooking.Room.id,
        capacity: mockBooking.Room.capacity,
        hotelId: mockBooking.Room.hotelId,
        name: mockBooking.Room.name,
        createdAt: mockBooking.Room.createdAt,
        updatedAt: mockBooking.Room.updatedAt,
      },
    });
  });

})

describe("POST /booking", () => {
  it("deveria retornar um erro quando ticket.TicketType.isRemote === true ", () => {
    
    const mockEnrollment = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.finance.account(),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.direction(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const mockTicket = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobTitle(),
        price: 100,
        isRemote: true,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementation((): any => {
      return mockEnrollment;
    });

    jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementation((): any => {
      return mockTicket;
    });

    const booking = bookingService.createBooking(1, 1);

    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Quebrou uma das regras de negócio!',
    });

  })

  it("deveria retornar um erro quando ticket.TicketType.includesHotel === false ", () => {

    const mockEnrollment = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.finance.account(),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.direction(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const mockTicket = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobTitle(),
        price: 100,
        isRemote: false,
        includesHotel: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementation((): any => {
      return mockEnrollment;
    });

    jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementation((): any => {
      return mockTicket;
    });

    const booking = bookingService.createBooking(1, 1);

    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Quebrou uma das regras de negócio!',
    });
  })

  it("deveria retornar um erro quando ticket.status === RESERVED ", () => {
    
    const mockEnrollment = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.finance.account(),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.direction(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const mockTicket = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.RESERVED,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobTitle(),
        price: 100,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementation((): any => {
      return mockEnrollment;
    });

    jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementation((): any => {
      return mockTicket;
    });

    const booking = bookingService.createBooking(1, 1);

    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Quebrou uma das regras de negócio!',
    });
  })

  it("deveria retornar um erro quando !roomIdexist ", () => {
    
    const mockEnrollment = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.finance.account(),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.direction(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const mockTicket = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobTitle(),
        price: 100,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementation((): any => {
      return mockEnrollment;
    });

    jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementation((): any => {
      return mockTicket;
    });

    jest.spyOn(bookingRepository, "existRoomId").mockImplementation((): any => {
      return undefined;
    });

    const booking = bookingService.createBooking(1, 1);

    expect(booking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  })

  it("deveria retornar um erro quando no have capacity ", () => {
    
    const mockEnrollment = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.finance.account(),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.direction(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const mockTicket = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobType(),
        price: 100,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const mockCapacity = {
      id: 1,
      name: faker.company.companyName(),
      capacity: 0,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Booking: [1],
    };
    
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementation((): any => {
      return mockEnrollment;
    });

    jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementation((): any => {
      return mockTicket;
    });

    jest.spyOn(bookingRepository, "existRoomId").mockImplementation((): any => {
      return mockCapacity;
    });

    const booking = bookingService.createBooking(1, 1);

    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Quebrou uma das regras de negócio!',
    });
  })

  it("Deveria retornar os dados no formato correto", async () => {
    
    const mockEnrollment = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.finance.account(),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.direction(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const mockTicket = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobType(),
        price: 100,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const mockCapacity = {
      id: 1,
      name: faker.company.companyName(),
      capacity: 2,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Booking: [1],
    };

    const mockReturn = {
      id: 1,
      userId: mockEnrollment.userId,
      roomId: mockCapacity.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementation((): any => {
      return mockEnrollment;
    });

    jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementation((): any => {
      return mockTicket;
    });

    jest.spyOn(bookingRepository, "existRoomId").mockImplementation((): any => {
      return mockCapacity;
    });

    jest.spyOn(bookingRepository, "createBooking").mockImplementation((): any => {
      return mockReturn;
    });

    const booking = await bookingService.createBooking(1, 1);

    expect(booking).toEqual({
      "bookingId": mockReturn.id,
    });
  })

})