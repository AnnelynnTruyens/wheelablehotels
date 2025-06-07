import express from "express";
import { createHotel, updateHotel, deleteHotel } from "./Hotel.controller";

const router = express.Router();

router.post("/hotels", createHotel);
router.patch("/hotels/:id", updateHotel);
router.delete("/hotels/:id", deleteHotel);

export default router;
