import { NextFunction, Request, Response } from "express";

import NotFoundError from "../../middleware/error/NotFoundError";
import { AuthRequest } from "../../middleware/auth/authMiddleware";

import Favourite from "./Favourite.model";

const getFavourites = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const favourites = await Favourite.find({});
		res.json(favourites);
	} catch (err) {
		next(err);
	}
};

const getFavouritesByUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const { hotelId } = req.query;

		const favourites = await Favourite.find({
			userId: user._id,
			...(hotelId ? { hotelId: hotelId } : {}),
		});
		res.json(favourites);
	} catch (err) {
		next(err);
	}
};

const findFavouriteByHotel = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const hotelId = req.params.id;
	req.query.hotelId = hotelId;
	return await getFavouritesByUser(req, res, next);
};

const getFavouriteById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const favourite = await Favourite.findOne({
			_id: id,
		});
		if (!favourite) {
			throw new NotFoundError("Favourite not found");
		}
		res.json(favourite);
	} catch (err) {
		next(err);
	}
};

const createFavourite = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const favourite = new Favourite({ ...req.body, userId: user._id });
		const result = await favourite.save();
		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

const updateFavourite = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		const favourite = await Favourite.findOneAndUpdate(
			{ _id: id, userId: user._id },
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);
		if (!favourite) {
			throw new NotFoundError("Favourite not found");
		}
		res.json(favourite);
	} catch (err) {
		next(err);
	}
};

const deleteFavourite = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		const favourite = await Favourite.findOneAndDelete({
			_id: id,
			userId: user._id,
		});
		if (!favourite) {
			throw new NotFoundError("favourite not found");
		}
		res.json({});
	} catch (err) {
		next(err);
	}
};

export {
	getFavourites,
	getFavouritesByUser,
	findFavouriteByHotel,
	getFavouriteById,
	createFavourite,
	updateFavourite,
	deleteFavourite,
};
