import { Document } from "mongoose";

export type Message = Document & {
	_id?: string;
	name: string;
	email: string;
	message: string;
	status: string;
};
