import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";

import User from "../../modules/User/User.model";
import AuthError from "../error/AuthError";

const localOptions = {
	usernameField: "email",
};

// local strategy to check login with username and password
const localStrategy = new LocalStrategy(
	localOptions,
	async (
		email: string,
		password: string,
		done: (
			error: any,
			user?: Express.User | false,
			options?: IVerifyOptions
		) => void
	) => {
		try {
			const user = await User.findOne({ email });
			if (!user) {
				return done(new AuthError("Email or password incorrect", 401));
			}

			const isMatch = await user.comparePassword(password);
			if (!isMatch) {
				return done(new AuthError("Email or password incorrect", 401));
			}

			return done(null, user);
		} catch (e) {
			return done(e);
		}
	}
);

export default localStrategy;
