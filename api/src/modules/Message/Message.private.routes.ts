import express from "express";
import {
	getMessages,
	getMessageById,
	updateMessage,
	deleteMessage,
} from "./Message.controller";

const router = express.Router();

router.get("/messages", getMessages);
router.get("/messages/:id", getMessageById);
router.patch("/messages/:id", updateMessage);
router.delete("/messages/:id", deleteMessage);

export default router;
