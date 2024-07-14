import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 6,
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required."],
      unique: true,
      minlength: 11,
      maxlength: 11,
    },

    aboutMe: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    profileImg: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },

    resumeImg: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },

    githubURL: String,
    instagramURL: String,
    facebookURL: String,
    twitterURL: String,
    linkedInURL: String,

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Method to create password reset token
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token and set the resetPasswordToken and expiration time
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes
  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
