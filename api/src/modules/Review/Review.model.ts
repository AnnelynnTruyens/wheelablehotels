import mongoose from "mongoose";

import { Review } from "./Review.types";

import validateModel from "../../validation/validateModel";

const reviewSchema = new mongoose.Schema<Review>(
	{
		title: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: false,
		},
		rating: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		hotelId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

reviewSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

const reviewModel = mongoose.model<Review>("Review", reviewSchema);

export default reviewModel;
