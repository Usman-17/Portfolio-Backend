import express from "express";
const router = express.Router();

import {
  createTimeline,
  deleteTimeline,
  getAllTimeline,
  getTimeline,
  updateTimeline,
} from "../controllers/timeline.controller.js";
import { isAdmin, protectRoute } from "../middlewares/authMiddleware.js";
// Imports End

router.get("/all", getAllTimeline);
router.get("/:id", protectRoute, isAdmin, getTimeline);
router.post("/create", protectRoute, isAdmin, createTimeline);
router.put("/update/:id", protectRoute, isAdmin, updateTimeline);
router.delete("/:id", protectRoute, isAdmin, deleteTimeline);

export default router;
