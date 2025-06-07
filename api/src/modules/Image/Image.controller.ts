import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";

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

const createImage = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { user } = req as AuthRequest;

		const file = req.file;
		if (!file) {
			res.status(400).json({ message: "No file uploaded" });
			return;
		}

		const { name, alt, hotelId, roomId } = req.body;

		const hotel = hotelId ? await Hotel.findById(hotelId) : null;
		const room = roomId ? await Room.findById(roomId) : null;

		if (!hotel && !room) {
			throw new NotFoundError("Hotel or room not found");
		}

		const image = new Image({
			name,
			alt,
			imageUrl: `/uploads/${file.filename}`,
			hotelId,
			roomId,
			userId: user._id,
		});

		const saved = await image.save();
		res.status(201).json(saved);
	} catch (e) {
		next(e);
	}
};

const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		let image;

		if (user.role === "admin") {
			image = await Image.findOneAndDelete({ _id: id });
		} else {
			image = await Image.findOneAndDelete({ _id: id, userId: user._id });
		}

		if (!image) {
			throw new NotFoundError("Image not found");
		}

		// Construct full path to the image file
		const filePath = path.join(__dirname, "../../../public", image.imageUrl);

		// Delete the file from the uploads folder
		fs.unlink(filePath, (err) => {
			if (err) {
				console.error("Failed to delete image file:", err);
			}
		});

		res.json({});
	} catch (e) {
		next(e);
	}
};

export {
	getImages,
	getImagesByHotel,
	getImagesByRoom,
	createImage,
	deleteImage,
};
