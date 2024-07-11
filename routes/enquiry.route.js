import express from "express";
const router = express.Router();

import {
  createEnquiry,
  deleteEnquiry,
  getAllEnquires,
} from "../controllers/enquiry.controller.js";
// Imports End

router.get("/all", getAllEnquires);
// router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", createEnquiry);
// router.update("update/:id", protectRoute, deletePost);
router.delete("/:id", deleteEnquiry);

export default router;
