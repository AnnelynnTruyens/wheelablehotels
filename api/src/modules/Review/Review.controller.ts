import { NextFunction, Request, Response } from "express";

import NotFoundError from "../../middleware/error/NotFoundError";
import { AuthRequest } from "../../middleware/auth/authMiddleware";

import Review from "./Review.model";
import HotelModel from "../Hotel/Hotel.model";

const getReviews = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { userId } = req.query;
		const { hotelId } = req.query;

		const reviews = await Review.find({
			...(userId ? { userId: userId } : {}),
			...(hotelId ? { hotelId: hotelId } : {}),
		})
			.lean()
			.populate("hotelId", ["name", "_id"])
			.populate("userId", ["username", "_id"]);
		res.json(reviews);
	} catch (err) {
		next(err);
	}
};

const getReviewsByUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { user } = req as AuthRequest;

	req.query.userId = user._id;
	return await getReviews(req, res, next);
};

const getReviewsByHotel = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const hotelId = req.params._id;

	req.query.hotelId = hotelId;
	return await getReviews(req, res, next);
};

const getReviewById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const review = await Review.findOne({
			_id: id,
		});
		if (!review) {
			throw new NotFoundError("Review not found");
		}
		res.json(review);
	} catch (err) {
		next(err);
	}
};

const createReview = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const review = new Review({ ...req.body, userId: user._id });
		const result = await review.save();

		// Recalculate hotel rating
		const reviews = await Review.find({ hotelId: review.hotelId });
		const averageRating = Number(
			(
				reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0) /
				reviews.length
			).toFixed(1)
		);

		// Update the hotel with new average rating
		await HotelModel.findByIdAndUpdate(review.hotelId, {
			rating: averageRating,
		});

		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

const updateReview = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		if (user.role === "admin") {
			const review = await Review.findOneAndUpdate({ _id: id }, req.body, {
				new: true,
				runValidators: true,
			});
			if (!review) {
				throw new NotFoundError("Review not found");
			}
			res.json(review);
		} else {
			const review = await Review.findOneAndUpdate(
				{ _id: id, userId: user._id },
				req.body,
				{
					new: true,
					runValidators: true,
				}
			);
			if (!review) {
				throw new NotFoundError("Review not found");
			}
			res.json(review);
		}
	} catch (err) {
		next(err);
	}
};

const deleteReview = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		const review = await Review.findOneAndDelete(
			user.role === "admin" ? { _id: id } : { _id: id, userId: user._id }
		);
		if (!review) throw new NotFoundError("Review not found");

		// Recalculate hotel rating
		const reviews = await Review.find({ hotelId: review.hotelId });
		const averageRating = reviews.length
			? Number(
					(
						reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0) /
						reviews.length
					).toFixed(1)
			  )
			: null;

		await HotelModel.findByIdAndUpdate(review.hotelId, {
			rating: averageRating,
		});

		res.json({});
	} catch (err) {
		next(err);
	}
};

export {
	getReviews,
	getReviewsByUser,
	getReviewsByHotel,
	getReviewById,
	createReview,
	updateReview,
	deleteReview,
};
