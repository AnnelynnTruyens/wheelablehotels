import mongoose from "mongoose";

import { Hotel } from "./Hotel.types";

import validateModel from "../../validation/validateModel";
import RoomModel from "../Room/Room.model";

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
		amenities: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Amenity",
			},
		],
		accessibilityFeatures: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "AccessibilityFeature",
			},
		],
	},
	{
		timestamps: true,
	}
);

hotelSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

hotelSchema.pre("deleteOne", { document: true, query: false }, function (next) {
	// delete all rooms that belong to this hotel
	RoomModel.deleteMany({ hotelId: this._id }).exec();
	next();
});

hotelSchema.pre(["findOneAndDelete", "deleteMany"], function (next) {
	// delete all rooms that belong to this hotel
	const id = this.getFilter()["_id"];
	RoomModel.deleteMany({ hotelId: id }).exec();
	next();
});

const HotelModel = mongoose.model<Hotel>("Hotel", hotelSchema);

export default HotelModel;
