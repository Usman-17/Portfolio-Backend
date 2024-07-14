import express from "express";
const router = express.Router();

import {
  createSkill,
  deleteSkill,
  getAllSkills,
  getSkill,
  updateSkill,
} from "../controllers/skill.controller.js";
import { isAdmin, protectRoute } from "../middlewares/authMiddleware.js";
// Imports End

router.get("/all", getAllSkills);
router.get("/:id", protectRoute, isAdmin, getSkill);
router.post("/create", protectRoute, isAdmin, createSkill);
router.put("/update/:id", protectRoute, isAdmin, updateSkill);
router.delete("/:id", protectRoute, isAdmin, deleteSkill);

export default router;
