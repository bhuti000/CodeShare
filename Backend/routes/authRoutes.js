import express from "express";
import { register, login, getUserById } from "../controllers/authController.js"; // ✅ Add getUserById here

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/:id", getUserById); // ✅ Add this route

export default router;
