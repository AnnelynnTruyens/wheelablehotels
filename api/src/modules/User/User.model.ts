import { Document } from "mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "./User.types";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		firstname: {
			type: String,
			required: true,
		},
		lastname: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", function (next) {
	const user: Document = this;

	if (!user.isModified("password")) {
		return next();
	}

	try {
		bcrypt.hash(
			user.password,
			10,
			function (err: Error | null, hash: string | undefined) {
				if (err) {
					throw err;
				}
				if (!hash) {
					throw new Error("Hash is undefined");
				}

				user.password = hash;
				return next();
			}
		);
	} catch (err: any) {
		return next(err);
	}
});

userSchema.methods = {
	comparePassword: function (password: string) {
		const user = this;
		return new Promise((resolve, reject) => {
			bcrypt.compare(
				password,
				user.password,
				(err: Error | null, isMatch: boolean | undefined) => {
					if (isMatch) {
						resolve(true);
					} else if (err) {
						reject(err);
					} else {
						reject(new Error("isMatch is undefined"));
					}
				}
			);
		});
	},
	generateToken: function () {
		const user = this;
		return jwt.sign({ _id: user._id }, process.env.JWT_SECRET ?? "", {
			expiresIn: 60 * 120,
		});
	},
};

userSchema.set("toJSON", {
	transform: function (doc, ret) {
		delete ret.password;
	},
});

userSchema.set("toObject", {
	transform: function (doc, ret) {
		delete ret.password;
	},
});

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
