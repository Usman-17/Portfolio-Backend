import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
    },

    timeline: {
      from: String,
      to: String,
    },
  },
  { timestamps: true }
);

const Timeline = mongoose.model("Timeline", timelineSchema);

export default Timeline;
