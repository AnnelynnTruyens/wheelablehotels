import express from "express";
import { createMessage } from "./Message.controller";

const router = express.Router();

router.post("/messages", createMessage);

export default router;
