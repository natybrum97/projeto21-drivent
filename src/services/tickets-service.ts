import { TicketType, Tickets } from "@/protocols";
import { ticketsRepository } from "@/repositories/tickets-repository";
import { notFoundError } from "@/errors";


async function getAllTicketType(): Promise<TicketType[]> {

    return await ticketsRepository.getTicketType();
}


async function getTickets(userId: number): Promise<Tickets> {

  const enrollment = await ticketsRepository.searchEnrollment(userId);
  if (!enrollment) throw notFoundError();

  const tickets = await ticketsRepository.searchTickets(enrollment.id);
  if (!tickets) throw notFoundError();

  return tickets;

}

export const ticketsService = {
  getAllTicketType,
  getTickets
};
