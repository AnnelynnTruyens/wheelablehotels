import express from "express";
import { getHotels, getHotelById } from "./Hotel.controller";

const router = express.Router();

router.get("/hotels", getHotels);
router.get("/hotels/:id", getHotelById);

export default router;
