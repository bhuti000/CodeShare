import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addComment, getComments } from "../controllers/commentController.js";

const router = express.Router();

// ADD COMMENT
router.post("/:snippetId", authMiddleware, addComment);

// GET COMMENTS
router.get("/:snippetId", getComments);

export default router;
