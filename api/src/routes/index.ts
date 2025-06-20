import { ErrorRequestHandler, Express, Router } from "express";

import { errorHandler } from "../middleware/error/errorHandlerMiddleware";
import { authJwt } from "../middleware/auth/authMiddleware";

import userPublicRoutes from "../modules/User/User.public.routes";
import userPrivateRoutes from "../modules/User/User.private.routes";
import hotelPublicRoutes from "../modules/Hotel/Hotel.public.routes";
import hotelPrivateRoutes from "../modules/Hotel/Hotel.private.routes";
import roomPublicRoutes from "../modules/Room/Room.public.routes";
import roomPrivateRoutes from "../modules/Room/Room.private.routes";
import amenityPublicRoutes from "../modules/Amenity/Amenity.public.routes";
import amenityPrivateRoutes from "../modules/Amenity/Amenity.private.routes";
import accessibilityFeaturePublicRoutes from "../modules/AccessibilityFeature/AccessibilityFeature.public.routes";
import accessibilityFeaturePrivateRoutes from "../modules/AccessibilityFeature/AccessibilityFeature.private.routes";
import reviewPublicRoutes from "../modules/Review/Review.public.routes";
import reviewPrivateRoutes from "../modules/Review/Review.private.routes";
import messagePublicRoutes from "../modules/Message/Message.public.routes";
import messagePrivateRoutes from "../modules/Message/Message.private.routes";
import favouriteRoutes from "../modules/Favourite/Favourite.routes";
import imagePublicRoutes from "../modules/Image/Image.public.routes";
import imagePrivateRoutes from "../modules/Image/Image.private.routes";

const registerRoutes = (app: Express) => {
	const publicRoutes = Router();
	publicRoutes.use("/", userPublicRoutes);
	publicRoutes.use("/", hotelPublicRoutes);
	publicRoutes.use("/", roomPublicRoutes);
	publicRoutes.use("/", amenityPublicRoutes);
	publicRoutes.use("/", accessibilityFeaturePublicRoutes);
	publicRoutes.use("/", reviewPublicRoutes);
	publicRoutes.use("/", messagePublicRoutes);
	publicRoutes.use("/", imagePublicRoutes);

	const authRoutes = Router();
	authRoutes.use("/", userPrivateRoutes);
	authRoutes.use("/", hotelPrivateRoutes);
	authRoutes.use("/", roomPrivateRoutes);
	authRoutes.use("/", amenityPrivateRoutes);
	authRoutes.use("/", accessibilityFeaturePrivateRoutes);
	authRoutes.use("/", reviewPrivateRoutes);
	authRoutes.use("/", messagePrivateRoutes);
	authRoutes.use("/", favouriteRoutes);
	authRoutes.use("/", imagePrivateRoutes);

	// Register public routes
	app.use(publicRoutes);

	// Register authenticated routes with auth middleware
	app.use(authJwt, authRoutes);

	// Register error-handling middleware AFTER all routes
	app.use(errorHandler as unknown as ErrorRequestHandler);
};

export { registerRoutes };
