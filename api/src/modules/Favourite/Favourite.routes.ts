import express from "express";
import {
	getFavouritesByUser,
	getFavouriteById,
	createFavourite,
	updateFavourite,
	deleteFavourite,
} from "./Favourite.controller";

const router = express.Router();

router.get("/favourites", getFavouritesByUser);
router.get("/favourites/:id", getFavouriteById);
router.post("/favourites", createFavourite);
router.patch("/favourites/:id", updateFavourite);
router.delete("/favourites/:id", deleteFavourite);

export default router;
