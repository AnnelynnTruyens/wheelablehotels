import express from "express";
import { createImage, updateImage, deleteImage } from "./Image.controller";

const router = express.Router();

// Image routes
router.post("/images", createImage);
router.patch("/images/:id", updateImage);
router.delete("/images/:id", deleteImage);

export default router;
