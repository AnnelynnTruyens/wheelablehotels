import express from "express";
import {
	addAccessibilityFeaturesToRoom,
	createRoom,
	deleteRoom,
	updateRoom,
} from "./Room.controller";

const router = express.Router();

router.post("/rooms", createRoom);
router.patch("/rooms/:id", updateRoom);
router.delete("/rooms/:id", deleteRoom);

// Add accessibility features to a room
router.post(
	"/rooms/:id/accessibility-features",
	addAccessibilityFeaturesToRoom
);

export default router;
