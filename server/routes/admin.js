import express from "express";
import { deleteUser, updateUser } from "../controllers/admin.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.put("/:userId", verifyToken, updateUser);
router.delete("/:userId", verifyToken, deleteUser);

export default router;