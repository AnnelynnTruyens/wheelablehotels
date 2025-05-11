import express from "express";
import {
	createHotel,
	updateHotel,
	deleteHotel,
	addAmenitiesToHotel,
} from "./Hotel.controller";

const router = express.Router();

router.post("/hotels", createHotel);
router.patch("/hotels/:id", updateHotel);
router.delete("/hotels/:id", deleteHotel);

// Add amenities to a hotel
router.post("/hotels/:id/amenities", addAmenitiesToHotel);

export default router;
