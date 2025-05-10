import { ErrorRequestHandler, Express, Router } from "express";

import { errorHandler } from "../middleware/error/errorHandlerMiddleware";
import { authJwt } from "../middleware/auth/authMiddleware";

import userPublicRoutes from "../modules/User/User.public.routes";
import userPrivateRoutes from "../modules/User/User.private.routes";

const registerRoutes = (app: Express) => {
	const publicRoutes = Router();
	publicRoutes.use("/", userPublicRoutes);

	const authRoutes = Router();
	authRoutes.use("/", userPrivateRoutes);

	// Register public routes
	app.use(publicRoutes);

	// Register authenticated routes with auth middleware
	app.use(authJwt, authRoutes);

	// Register error-handling middleware AFTER all routes
	app.use(errorHandler as unknown as ErrorRequestHandler);
};

export { registerRoutes };
