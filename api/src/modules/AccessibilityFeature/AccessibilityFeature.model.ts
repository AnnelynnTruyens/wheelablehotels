import mongoose from "mongoose";
import { AccessibilityFeature } from "./AccessibilityFeature.types";
import validateModel from "../../validation/validateModel";

const accessibilityFeatureSchema = new mongoose.Schema<AccessibilityFeature>(
	{
		name: {
			type: String,
			required: true,
		},
		iconUrl: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

accessibilityFeatureSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

const AccessibilityFeatureModel = mongoose.model<AccessibilityFeature>(
	"AccessibilityFeature",
	accessibilityFeatureSchema
);

export default AccessibilityFeatureModel;
