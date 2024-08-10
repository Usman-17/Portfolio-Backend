import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    projectImg: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    gitRepoLink: String,
    projectLink: String,
    technologies: String,
    stack: String,
    deployed: String,
  },

  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
