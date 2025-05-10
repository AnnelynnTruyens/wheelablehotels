import mongoose from "mongoose";

import { Hotel } from "./Hotel.types";

import validateModel from "../../validation/validateModel";

const hotelSchema = new mongoose.Schema<Hotel>(
	{
		name: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		contactEmail: {
			type: String,
			required: true,
		},
		contactPhone: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		accessibilityInfo: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

hotelSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

const HotelModel = mongoose.model<Hotel>("Hotel", hotelSchema);

export default HotelModel;
