import express from "express";
import { createRoom, deleteRoom, updateRoom } from "./Room.controller";

const router = express.Router();

router.post("/rooms", createRoom);
router.patch("/rooms/:id", updateRoom);
router.delete("/rooms/:id", deleteRoom);

export default router;
