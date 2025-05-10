import { Document, ObjectId } from "mongoose";

export type Hotel = Document & {
	_id?: string;
	name: string;
	location: string;
	contactEmail: string;
	contactPhone: Number;
	description: string;
	accessibilityInfo: string;
	rating?: Number;
	userId: ObjectId;
	status: string;
};
