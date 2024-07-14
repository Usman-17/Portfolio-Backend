import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User Not Found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Middleware for checking if a user is an admin
export const isAdmin = async (req, res, next) => {
  try {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });

    if (!adminUser || adminUser.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied: You do not have admin" });
    }

    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
