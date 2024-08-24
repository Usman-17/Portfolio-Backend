import express from "express";

import dbConnect from "./db/ConnectMongoDB.js";
import dotenv from "dotenv";

import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import enquiryRoutes from "./routes/enquiry.route.js";
import timelineRoutes from "./routes/timeline.route.js";
import skillRoutes from "./routes/skill.route.js";
import projectRoutes from "./routes/project.route.js";
// Imports End

const app = express();
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //to parse from data(urlencoded)
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:4000",
      "https://muhammadusman-portfolio.vercel.app",
      "https://usman-dashboard.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes Setup
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/enquiry", enquiryRoutes);
app.use("/api/v1/timeline", timelineRoutes);
app.use("/api/v1/skill", skillRoutes);
app.use("/api/v1/project", projectRoutes);

// Running App
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  dbConnect();
});
