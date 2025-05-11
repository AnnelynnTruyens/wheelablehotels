import express from "express";
import {
	createAmenity,
	updateAmenity,
	deleteAmenity,
} from "./Amenity.controller";

const router = express.Router();

// Amenity routes
router.post("/amenities", createAmenity);
router.patch("/amenities/:id", updateAmenity);
router.delete("/amenities/:id", deleteAmenity);

export default router;
