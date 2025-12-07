import express from "express";
import {
  createSnippet,
  getAllSnippets,
  getSnippetById,
  updateSnippet,
  toggleLike
} from "../controllers/snippetController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
import { getPopularSnippets } from "../controllers/snippetController.js";

router.get("/popular", getPopularSnippets);

router.post("/", protect, createSnippet);
router.get("/", getAllSnippets);
router.get("/:id", getSnippetById);
router.put("/:id", protect, updateSnippet);
router.post("/:id/like", protect, toggleLike);

export default router;
