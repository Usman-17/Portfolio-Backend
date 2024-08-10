import express from "express";
const router = express.Router();

import {
  createEnquiry,
  deleteEnquiry,
  getAllEnquires,
  getEnquiry,
} from "../controllers/enquiry.controller.js";
import { isAdmin, protectRoute } from "../middlewares/authMiddleware.js";
// Imports End

router.get("/all", getAllEnquires);
router.get("/:id", protectRoute, isAdmin, getEnquiry);
router.post("/create", createEnquiry);
router.delete("/:id", protectRoute, isAdmin, deleteEnquiry);

export default router;
