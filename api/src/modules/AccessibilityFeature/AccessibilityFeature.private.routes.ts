import express from "express";
import {
	createAccessibilityFeature,
	updateAccessibilityFeature,
	deleteAccessibilityFeature,
} from "./AccessibilityFeature.controller";

const router = express.Router();

// AccessibilityFeature routes
router.post("/accessibility-features", createAccessibilityFeature);
router.patch("/accessibility-features/:id", updateAccessibilityFeature);
router.delete("/accessibility-features/:id", deleteAccessibilityFeature);

export default router;
