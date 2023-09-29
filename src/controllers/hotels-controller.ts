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
    const hotel = await hotelsService.getHotelsById(userId);
    res.status(httpStatus.OK).send(hotel);
  }

  export const hotelsController = {
    getHotels,
    getHotelsById
  };
  
  