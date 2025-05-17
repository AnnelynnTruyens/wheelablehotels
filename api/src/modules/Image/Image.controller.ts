import { NextFunction, Request, Response } from "express";

import { AuthRequest } from "../../middleware/auth/authMiddleware";
import NotFoundError from "../../middleware/error/NotFoundError";

import Image from "./Image.model";
import Hotel from "../Hotel/Hotel.model";
import Room from "../Room/Room.model";

const getImages = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { hotelId } = req.query;
		const { roomId } = req.query;

		const image = await Image.find({
			...(hotelId ? { hotelId: hotelId } : {}),
			...(roomId ? { roomId: roomId } : {}),
		})
			.lean()
			.populate("hotel", ["name", "id"]);
		res.json(image);
	} catch (e) {
		next(e);
	}
};

const getImagesByHotel = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const hotelId = req.params.id;
	req.query.hotelId = hotelId;
	return await getImages(req, res, next);
};

const getImagesByRoom = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const roomId = req.params.id;
	req.query.roomId = roomId;
	return await getImages(req, res, next);
};

const createImage = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;

		const hotel = await Hotel.findOne({
			_id: req.body.hotelId,
		});

		const room = await Room.findOne({
			_id: req.body.roomId,
		});

		if (!hotel && !room) {
			throw new NotFoundError("Hotel or room not found");
		}

		const image = new Image({
			...req.body,
			userId: user._id,
		});
		const result = await image.save();
		res.json(result);
	} catch (e) {
		next(e);
	}
};

const updateImage = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		if (user.role === "Admin") {
			if (req.body.hotelId || req.body.roomId) {
				const hotel = await Hotel.findOne({
					_id: req.body.hotelId,
				});

				const room = await Room.findOne({
					_id: req.body.roomId,
				});

				if (!hotel && !room) {
					throw new NotFoundError("Hotel or room not found");
				}
			}

			const image = await Image.findOneAndUpdate(
				{
					_id: id,
				},
				req.body,
				{ new: true, runValidators: true }
			);
			if (!image) {
				throw new NotFoundError("image not found");
			}
			res.json(image);
		} else {
			if (req.body.hotelId || req.body.roomId) {
				const hotel = await Hotel.findOne({
					_id: req.body.hotelId,
					userId: user._id,
				});

				const room = await Room.findOne({
					_id: req.body.roomId,
					userId: user._id,
				});

				if (!hotel && !room) {
					throw new NotFoundError("Hotel or room not found");
				}
			}

			const image = await Image.findOneAndUpdate(
				{
					_id: id,
				},
				req.body,
				{ new: true, runValidators: true }
			);
			if (!image) {
				throw new NotFoundError("Image not found");
			}
			res.json(image);
		}
	} catch (e) {
		next(e);
	}
};

const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		if (user.role === "Admin") {
			const image = await Image.findOneAndDelete({
				_id: id,
			});
			if (!image) {
				throw new NotFoundError("Image not found");
			}
			res.json({});
		} else {
			const image = await Image.findOneAndDelete({
				_id: id,
				userId: user._id,
			});
			if (!image) {
				throw new NotFoundError("Image not found");
			}
			res.json({});
		}
	} catch (e) {
		next(e);
	}
};

export {
	getImages,
	getImagesByHotel,
	getImagesByRoom,
	createImage,
	updateImage,
	deleteImage,
};
