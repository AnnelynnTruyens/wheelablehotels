import express from "express";
import { getAmenities, getAmenityById } from "./Amenity.controller";

const router = express.Router();

// Amenity routes
router.get("/amenities", getAmenities);
router.get("/amenities/:id", getAmenityById);

export default router;
