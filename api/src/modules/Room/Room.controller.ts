import { NextFunction, Request, Response } from "express";

import { AuthRequest } from "../../middleware/auth/authMiddleware";
import NotFoundError from "../../middleware/error/NotFoundError";

import Room from "./Room.model";
import Hotel from "../Hotel/Hotel.model";

const getRooms = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { hotelId } = req.query;

		const room = await Room.find({
			...(hotelId ? { hotelId: hotelId } : {}),
		})
			.lean()
			.populate("hotel", ["name", "id"])
			.populate("accessibilityFeatures");
		res.json(room);
	} catch (e) {
		next(e);
	}
};

const getRoomByHotel = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const hotelId = req.params.id;
	req.query.hotelId = hotelId;
	return await getRooms(req, res, next);
};

const createRoom = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;

		const hotel = await Hotel.findOne({
			_id: req.body.hotelId,
		});

		if (!hotel) {
			throw new NotFoundError("Hotel not found");
		}

		const room = new Room({
			...req.body,
			userId: user._id,
		});
		const result = await room.save();
		res.json(result);
	} catch (e) {
		next(e);
	}
};

const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		if (user.role === "admin") {
			if (req.body.hotelId) {
				const hotel = await Hotel.findOne({
					_id: req.body.hotelId,
				});

				if (!hotel) {
					throw new NotFoundError("Hotel not found");
				}
			}

			const room = await Room.findOneAndUpdate(
				{
					_id: id,
				},
				req.body,
				{ new: true, runValidators: true }
			);
			if (!room) {
				throw new NotFoundError("Room not found");
			}
			res.json(room);
		} else {
			if (req.body.hotelId) {
				const hotel = await Hotel.findOne({
					_id: req.body.hotelId,
					userId: user._id,
				});

				if (!hotel) {
					throw new NotFoundError("Hotel not found");
				}
			}

			const room = await Room.findOneAndUpdate(
				{
					_id: id,
					userId: user._id,
				},
				req.body,
				{ new: true, runValidators: true }
			);
			if (!room) {
				throw new NotFoundError("Room not found");
			}
			res.json(room);
		}
	} catch (e) {
		next(e);
	}
};

const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		if (user.role === "admin") {
			const room = await Room.findOneAndDelete({
				_id: id,
			});
			if (!room) {
				throw new NotFoundError("Room not found");
			}
			res.json({});
		} else {
			const room = await Room.findOneAndDelete({
				_id: id,
				userId: user._id,
			});
			if (!room) {
				throw new NotFoundError("Room not found");
			}
			res.json({});
		}
	} catch (e) {
		next(e);
	}
};

export { getRooms, getRoomByHotel, createRoom, updateRoom, deleteRoom };
