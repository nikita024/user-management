import express from "express";
import { register, login, getAllUsers, logout, validateToken } from "../controllers/user.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/validateToken", validateToken)
router.get("/", getAllUsers);

export default router;