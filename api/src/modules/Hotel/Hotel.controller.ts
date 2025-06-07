import { NextFunction, Request, Response } from "express";

import NotFoundError from "../../middleware/error/NotFoundError";

import Hotel from "./Hotel.model";
import { AuthRequest } from "../../middleware/auth/authMiddleware";
import AuthError from "../../middleware/error/AuthError";

const getHotels = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const hotels = await Hotel.find({})
			.populate("amenities")
			.populate("accessibilityFeatures");
		res.json(hotels);
	} catch (err) {
		next(err);
	}
};

const getHotelById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const hotel = await Hotel.findOne({
			_id: id,
		})
			.populate("amenities")
			.populate("accessibilityFeatures");
		if (!hotel) {
			throw new NotFoundError("Hotel not found");
		}
		res.json(hotel);
	} catch (err) {
		next(err);
	}
};

const createHotel = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;
		const hotel = new Hotel({ ...req.body, userId: user._id });
		const result = await hotel.save();
		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

const updateHotel = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		if (user.role === "admin") {
			const hotel = await Hotel.findOneAndUpdate({ _id: id }, req.body, {
				new: true,
				runValidators: true,
			});
			if (!hotel) {
				throw new NotFoundError("Hotel not found");
			}
			res.json(hotel);
		} else {
			const hotel = await Hotel.findOneAndUpdate(
				{ _id: id, userId: user._id },
				req.body,
				{
					new: true,
					runValidators: true,
				}
			);
			if (!hotel) {
				throw new NotFoundError("Hotel not found");
			}
			res.json(hotel);
		}
	} catch (err) {
		next(err);
	}
};

const deleteHotel = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;
		if (user.role === "admin") {
			const hotel = await Hotel.findOneAndDelete({
				_id: id,
			});
			if (!hotel) {
				throw new NotFoundError("Hotel not found");
			}
			res.json({});
		} else {
			throw new AuthError();
		}
	} catch (err) {
		next(err);
	}
};

export { getHotels, getHotelById, createHotel, updateHotel, deleteHotel };
