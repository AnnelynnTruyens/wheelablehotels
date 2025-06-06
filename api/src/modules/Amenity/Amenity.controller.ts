import { NextFunction, Request, Response } from "express";
import NotFoundError from "../../middleware/error/NotFoundError";
import Amenity from "./Amenity.model";
import AuthError from "../../middleware/error/AuthError";
import { AuthRequest } from "../../middleware/auth/authMiddleware";

const getAmenities = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const amenities = await Amenity.find({});
		res.json(amenities);
	} catch (err) {
		next(err);
	}
};

const getAmenityById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const amenity = await Amenity.findOne({ _id: id });
		if (!amenity) {
			throw new NotFoundError("Amenity not found");
		}
		res.json(amenity);
	} catch (err) {
		next(err);
	}
};

const createAmenity = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;

		if (user.role === "admin") {
			const amenity = new Amenity({ ...req.body });
			const result = await amenity.save();
			res.status(200).json(result);
		} else {
			throw new AuthError();
		}
	} catch (err) {
		next(err);
	}
};

const updateAmenity = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		if (user.role === "admin") {
			const amenity = await Amenity.findOneAndUpdate({ _id: id }, req.body, {
				new: true,
				runValidators: true,
			});
			if (!amenity) {
				throw new NotFoundError("Amenity not found");
			}
			res.json(amenity);
		} else {
			throw new AuthError();
		}
	} catch (err) {
		next(err);
	}
};

const deleteAmenity = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		if (user.role === "admin") {
			const amenity = await Amenity.findOneAndDelete({ _id: id });
			if (!amenity) {
				throw new NotFoundError("Amenity not found");
			}
			res.json({});
		} else {
			throw new AuthError();
		}
	} catch (err) {
		next(err);
	}
};

export {
	getAmenities,
	getAmenityById,
	createAmenity,
	updateAmenity,
	deleteAmenity,
};
