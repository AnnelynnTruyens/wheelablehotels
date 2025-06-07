import express from "express";
import { createImage, deleteImage } from "./Image.controller";
import upload from "../../middleware/uploads/upload";

const router = express.Router();

// Image routes
router.post("/images", upload.single("file"), createImage);
router.delete("/images/:id", deleteImage);

export default router;
