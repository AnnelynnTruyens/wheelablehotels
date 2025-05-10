import express from "express";
import { getRooms } from "./Room.controller";

const router = express.Router();

router.get("/rooms", getRooms);

export default router;
