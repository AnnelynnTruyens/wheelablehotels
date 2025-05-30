import { Router } from "express";
import { authLocal } from "../../middleware/auth/authMiddleware";
import { getUserById, getUsers, login, register } from "./User.controller";

const router = Router();
router.post("/login", authLocal, login);
router.post("/register", register);
router.get("/users", getUsers);
//router.get("/users/:id", getUserById);

export default router;
