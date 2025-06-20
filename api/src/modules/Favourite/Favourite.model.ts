import mongoose from "mongoose";

import { Favourite } from "./Favourite.types";

import validateModel from "../../validation/validateModel";

const favouriteSchema = new mongoose.Schema<Favourite>(
	{
		hotelId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

favouriteSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

const favouriteModel = mongoose.model<Favourite>("Favourite", favouriteSchema);

export default favouriteModel;
