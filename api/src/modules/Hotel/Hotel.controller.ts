import { NextFunction, Request, Response } from "express";

import NotFoundError from "../../middleware/error/NotFoundError";

import Hotel from "./Hotel.model";
import Review from "../Review/Review.model";
import { AuthRequest } from "../../middleware/auth/authMiddleware";
import AuthError from "../../middleware/error/AuthError";

const calculateAverageRating = async (
	hotelId: string
): Promise<number | null> => {
	const reviews = await Review.find({ hotelId });
	if (!reviews.length) return null;

	const sum = reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0);
	return Number((sum / reviews.length).toFixed(1));
};

const getHotels = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { userId } = req.query;

		const hotels = await Hotel.find({
			...(userId ? { userId: userId } : {}),
		})
			.populate("amenities")
			.populate("accessibilityFeatures");

		// Add average ratings
		const hotelsWithRatings = await Promise.all(
			hotels.map(async (hotel) => {
				const avgRating = await calculateAverageRating(hotel._id.toString());
				return {
					...hotel.toObject(),
					rating: avgRating,
				};
			})
		);

		res.json(hotelsWithRatings);
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
			.populate("accessibilityFeatures")
			.populate("userId", "username");
		if (!hotel) {
			throw new NotFoundError("Hotel not found");
		}
		const avgRating = await calculateAverageRating(id);

		res.json({
			...hotel.toObject(),
			rating: avgRating,
		});
	} catch (err) {
		next(err);
	}
};

const getHotelsByUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const userId = req.params.id;
	req.query.userId = userId;
	return await getHotels(req, res, next);
};

const createHotel = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;
		const hotel = new Hotel({ ...req.body, userId: user._id });
		const result = await hotel.save();
		res.status(200).json(result);
	} catch (err: any) {
		// MongoDB duplicate key error
		if (err.code === 11000) {
			return next(
				new AuthError(
					`It seems like someone already added this hotel. If you're sure that's not the case, try adding something extra to the hotel name (like the city).`,
					409 // Conflict status code
				)
			);
		}
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
			throw new AuthError("Authentication error", 401);
		}
	} catch (err) {
		next(err);
	}
};

export {
	getHotels,
	getHotelsByUser,
	getHotelById,
	createHotel,
	updateHotel,
	deleteHotel,
};
