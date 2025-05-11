import { NextFunction, Request, Response } from "express";
import NotFoundError from "../../middleware/error/NotFoundError";
import AccessibilityFeature from "./AccessibilityFeature.model";

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
		const accessibilityFeature = new AccessibilityFeature({ ...req.body });
		const result = await accessibilityFeature.save();
		res.status(200).json(result);
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
		const { id } = req.params;
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
		const { id } = req.params;
		const accessibilityFeature = await AccessibilityFeature.findOneAndDelete({
			_id: id,
		});
		if (!accessibilityFeature) {
			throw new NotFoundError("Accessibility feature not found");
		}
		res.json({});
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
