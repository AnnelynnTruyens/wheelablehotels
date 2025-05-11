import { NextFunction, Request, Response } from "express";
import NotFoundError from "../../middleware/error/NotFoundError";
import Amenity from "./Amenity.model";

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
		const amenity = new Amenity({ ...req.body });
		const result = await amenity.save();
		res.status(200).json(result);
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
		const { id } = req.params;
		const amenity = await Amenity.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!amenity) {
			throw new NotFoundError("Amenity not found");
		}
		res.json(amenity);
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
		const { id } = req.params;
		const amenity = await Amenity.findOneAndDelete({ _id: id });
		if (!amenity) {
			throw new NotFoundError("Amenity not found");
		}
		res.json({});
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
