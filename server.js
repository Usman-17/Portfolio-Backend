import express from "express";

import dbConnect from "./db/ConnectMongoDB.js";
import dotenv from "dotenv";

import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import { errorMiddleware } from "./middlewares/errors.js";

import enquiryRoutes from "./routes/enquiry.route.js";
import authRoutes from "./routes/auth.route.js";
// Imports End

const app = express();
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //to parse from data(urlencoded)

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    method: ["GET", "POST", "PUT", "DELETE"],
    credential: true,
  })
);

// Routes Setup
app.use("/api/v1/enquiry", enquiryRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(errorMiddleware);

// Running App
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  dbConnect();
});
