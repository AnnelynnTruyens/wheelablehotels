import express from "express";
import { getReviews } from "./Review.controller";

const router = express.Router();

router.get("/reviews", getReviews);

export default router;
