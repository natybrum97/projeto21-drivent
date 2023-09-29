import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {

    const { userId } = req;

    const hotels = await hotelsService.getHotels(userId);

    console.log(hotels);

    res.status(httpStatus.OK).send(hotels);
  }

  export async function getHotelsById(req: AuthenticatedRequest, res: Response) {

    const { userId } = req;

    const idHotel = Number(req.params.id);

    console.log(idHotel);

    const hotel = await hotelsService.getHotelsById(userId, idHotel);

    res.status(httpStatus.OK).send(hotel);
  }

  export const hotelsController = {
    getHotels,
    getHotelsById
  };
  
  