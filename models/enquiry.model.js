import mongoose from "mongoose";

var enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required."],
      minlength: 11,
      maxlength: 11,
    },

    subject: {
      type: String,
      required: [true, "Subject is required."],
      minlength: [2, "Subject must be at least 2 characters long."],
    },

    comment: {
      type: String,
      required: [true, "Comment is required."],
      minlength: [2, "Comment must be at least 2 characters long."],
    },
  },
  { timestamps: true }
);

export const Enquiry = mongoose.model("Enquiry", enquirySchema);
