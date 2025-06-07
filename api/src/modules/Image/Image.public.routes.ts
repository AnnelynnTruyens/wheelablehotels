import express from "express";
import { getImages } from "./Image.controller";

const router = express.Router();

router.get("/images", getImages);

export default router;
