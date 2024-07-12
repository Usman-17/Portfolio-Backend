import mongoose from "mongoose";

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

    resume: {
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

const User = mongoose.model("User", userSchema);

export default User;
