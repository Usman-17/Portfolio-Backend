import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Title is required."],
      unique: true,
      trim: true,
    },

    proficiency: {
      type: String,
    },

    svg: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
