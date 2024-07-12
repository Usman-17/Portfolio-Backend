import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ error: "Authentication failed: Token is missing" });
    }

    // Verify token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unautorized:Invalid Token" });
    }

    // Fetch user details based on decoded userId
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User Not Found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res.status(500).json({ error: "Internel Server Error" });
  }
};

// Middleware for checking if a user is an admin
// export const isAdmin = async (req, res, next) => {
//   const { email } = req.user;
//   const adminUser = await User.findOne({ email });
//   if (adminUser.role !== "admin") {
//     throw new Error("You are not an admin");
//   } else {
//     next();
//   }
// };

export const isAdmin = async (req, res, next) => {
  try {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });

    if (!adminUser || adminUser.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized: You are not an admin" });
    }

    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
