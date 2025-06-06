import { NextFunction, Request, Response } from "express";
import NotFoundError from "../../middleware/error/NotFoundError";
import AccessibilityFeature from "./AccessibilityFeature.model";
import { AuthRequest } from "../../middleware/auth/authMiddleware";
import AuthError from "../../middleware/error/AuthError";

const getAccessibilityFeatures = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const accessibilityFeatures = await AccessibilityFeature.find({});
		res.json(accessibilityFeatures);
	} catch (err) {
		next(err);
	}
};

const getAccessibilityFeatureById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const accessibilityFeature = await AccessibilityFeature.findOne({
			_id: id,
		});
		if (!accessibilityFeature) {
			throw new NotFoundError("Accessibility feature not found");
		}
		res.json(accessibilityFeature);
	} catch (err) {
		next(err);
	}
};

const createAccessibilityFeature = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;

		if (user.role === "admin") {
			const accessibilityFeature = new AccessibilityFeature({ ...req.body });
			const result = await accessibilityFeature.save();
			res.status(200).json(result);
		} else {
			throw new AuthError();
		}
	} catch (err) {
		next(err);
	}
};

const updateAccessibilityFeature = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		if (user.role === "admin") {
			const accessibilityFeature = await AccessibilityFeature.findOneAndUpdate(
				{ _id: id },
				req.body,
				{
					new: true,
					runValidators: true,
				}
			);
			if (!accessibilityFeature) {
				throw new NotFoundError("Accessibility feature not found");
			}
			res.json(accessibilityFeature);
		} else {
			throw new AuthError();
		}
	} catch (err) {
		next(err);
	}
};

const deleteAccessibilityFeature = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const { id } = req.params;

		if (user.role === "admin") {
			const accessibilityFeature = await AccessibilityFeature.findOneAndDelete({
				_id: id,
			});
			if (!accessibilityFeature) {
				throw new NotFoundError("Accessibility feature not found");
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
	getAccessibilityFeatures,
	getAccessibilityFeatureById,
	createAccessibilityFeature,
	updateAccessibilityFeature,
	deleteAccessibilityFeature,
};
