import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';
import { bookingService } from '@/services/booking-service';
import { InputBooking, InputTicketBody } from '@/protocols';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const booking = await bookingService.findBooking(userId);
    return res.status(httpStatus.OK).send(booking);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body as InputBooking;

    const booking = await bookingService.createBooking(userId, roomId);
    return res.status(httpStatus.OK).send(booking);
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body as InputBooking;
    const bookingId = parseInt(req.params.bookingId);

    const booking = await bookingService.putBooking(userId, roomId, bookingId);
    return res.status(httpStatus.OK).send(booking);
}

export const bookingControllers = {
    getBooking,
    postBooking,
    putBooking
};

