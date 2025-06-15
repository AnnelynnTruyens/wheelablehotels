import { NextFunction, Request, Response } from "express";

import NotFoundError from "../../middleware/error/NotFoundError";
import { AuthRequest } from "../../middleware/auth/authMiddleware";

import Message from "./Message.model";
import AuthError from "../../middleware/error/AuthError";

const getMessages = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;

		if (user.role === "admin") {
			const messages = await Message.find({});
			res.json(messages);
		} else {
			throw new AuthError("Authentication error", 401);
		}
	} catch (err) {
		next(err);
	}
};

const getMessageById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		if (user.role === "admin") {
			const message = await Message.findOne({
				_id: id,
			});
			if (!message) {
				throw new NotFoundError("Message not found");
			}
			res.json(message);
		} else {
			throw new AuthError("Authentication error", 401);
		}
	} catch (err) {
		next(err);
	}
};

const createMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const message = new Message({ ...req.body });
		const result = await message.save();
		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

const updateMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		if (user.role === "admin") {
			const message = await Message.findOneAndUpdate({ _id: id }, req.body, {
				new: true,
				runValidators: true,
			});
			if (!message) {
				throw new NotFoundError("Message not found");
			}
			res.json(message);
		} else {
			throw new AuthError("Authentication error", 401);
		}
	} catch (err) {
		next(err);
	}
};

const deleteMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		if (user.role === "admin") {
			const message = await Message.findOneAndDelete({ _id: id });
			if (!message) {
				throw new NotFoundError("Message not found");
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
	getMessages,
	getMessageById,
	createMessage,
	updateMessage,
	deleteMessage,
};
