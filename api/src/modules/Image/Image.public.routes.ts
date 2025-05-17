import express from "express";
import { getImages } from "./Image.controller";

const router = express.Router();

router.get("/rooms", getImages);

export default router;
