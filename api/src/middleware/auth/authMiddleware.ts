import passport from "passport";
import { NextFunction, Request, Response } from "express";

import AuthError from "../error/AuthError";
import localStrategy from "./localStrategy";
import jwtStrategy from "./jwtStrategy";

import { User } from "../../modules/User/User.types";

passport.use("local", localStrategy);
passport.use("jwt", jwtStrategy);

export interface AuthRequest extends Request {
	user: User;
}

const passportHandler = (strategy: string) => {
	return function (req: Request, res: Response, next: NextFunction) {
		passport.authenticate(
			strategy,
			{ session: false },
			function (err: any, user?: User | false) {
				if (err) {
					return next(err);
				}
				if (!user) {
					return next(new AuthError("Authentication error", 401));
				} else {
					req.user = user;
					return next();
				}
			}
		)(req, res, next);
	};
};

const authLocal = passportHandler("local");
const authJwt = passportHandler("jwt");

export { authLocal, authJwt };
