import express from "express";
const router = express.Router();

import {
  getUser,
  getUserForPortfolio,
  updateProfile,
  updateUserPassword,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import { isAdmin, protectRoute } from "../middlewares/authMiddleware.js";
// Imports End

router.get("/:id", protectRoute, isAdmin, getUser);
router.get("/me/portfolio", getUserForPortfolio);
router.put("/update-profile", protectRoute, isAdmin, updateProfile);
router.put("/update-password", protectRoute, isAdmin, updateUserPassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;
