import { Router } from "express";
import {
	deleteCurrentUser,
	deleteUser,
	editCurrentUser,
	getCurrentUser,
	updateUser,
} from "./User.controller";

const router = Router();

router.get("/users/current", getCurrentUser);
router.patch("/users/current/edit", editCurrentUser);
router.delete("/users/current", deleteCurrentUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
