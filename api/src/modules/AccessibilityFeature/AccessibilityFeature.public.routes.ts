import express from "express";
import {
	getAccessibilityFeatures,
	getAccessibilityFeatureById,
} from "./AccessibilityFeature.controller";

const router = express.Router();

// AccessibilityFeature routes
router.get("/accessibility-features", getAccessibilityFeatures);
router.get("/accessibility-features/:id", getAccessibilityFeatureById);

export default router;
