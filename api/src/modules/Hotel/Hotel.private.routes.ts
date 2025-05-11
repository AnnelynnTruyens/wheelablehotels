import express from "express";
import {
	createHotel,
	updateHotel,
	deleteHotel,
	addAmenitiesToHotel,
	addAccessibilityFeaturesToHotel,
} from "./Hotel.controller";

const router = express.Router();

router.post("/hotels", createHotel);
router.patch("/hotels/:id", updateHotel);
router.delete("/hotels/:id", deleteHotel);

// Add amenities to a hotel
router.post("/hotels/:id/amenities", addAmenitiesToHotel);

// Add accessibility features to a hotel
router.post(
	"/hotels/:id/accessibility-features",
	addAccessibilityFeaturesToHotel
);

export default router;
