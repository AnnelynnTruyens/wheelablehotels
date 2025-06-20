import express from "express";
import {
	createReview,
	deleteReview,
	getReviewById,
	getReviewsByUser,
	updateReview,
} from "./Review.controller";

const router = express.Router();

router.get("/reviews/:id", getReviewById);
router.post("/reviews", createReview);
router.patch("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);

export default router;
