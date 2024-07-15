import express from "express";
const router = express.Router();

import { isAdmin, protectRoute } from "../middlewares/authMiddleware.js";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProject,
  updateProject,
} from "../controllers/project.controller.js";
// Imports End

router.get("/all", getAllProjects);
router.get("/:id", getProject);
router.post("/create", protectRoute, isAdmin, createProject);
router.put("/update/:id", protectRoute, isAdmin, updateProject);
router.delete("/:id", protectRoute, isAdmin, deleteProject);

export default router;
