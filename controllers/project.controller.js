import Project from "../models/project.model.js";
import { v2 as cloudinary } from "cloudinary";

// PATH     : /api/project/create
// METHOD   : POST
// ACCESS   : PRIVATE
// DESC     : Create Project
export const createProject = async (req, res) => {
  try {
    const { projectImg } = req.files;
    const {
      title,
      description,
      gitRepoLink,
      projectLink,
      technologies,
      stack,
      deployed,
    } = req.body;

    // Check for required fields
    if (
      !title ||
      !description ||
      !projectImg ||
      !gitRepoLink ||
      !projectLink ||
      !technologies ||
      !stack ||
      !deployed
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Upload projectImg to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      projectImg.tempFilePath,
      { folder: "PROJECTS_IMAGES" }
    );

    const newProject = new Project({
      title,
      description,
      gitRepoLink,
      projectLink,
      technologies,
      stack,
      deployed,

      projectImg: {
        url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
      },
    });

    await newProject.save();
    return res.status(201).json(newProject);
  } catch (error) {
    console.error("Error in createProject controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/project/update/id
// METHOD   : POST
// ACCESS   : PRIVATE
// DESC     : Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      gitRepoLink,
      projectLink,
      technologies,
      stack,
      deployed,
    } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (gitRepoLink) project.gitRepoLink = gitRepoLink;
    if (projectLink) project.projectLink = projectLink;
    if (technologies) project.technologies = technologies;
    if (stack) project.stack = stack;
    if (deployed) project.deployed = deployed;

    // Handle Project Image Upload
    if (req.files && req.files.projectImg) {
      if (project.projectImg && project.projectImg.public_id) {
        await cloudinary.uploader.destroy(project.projectImg.public_id);
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        req.files.projectImg.tempFilePath,
        { folder: "PROJECTS_IMAGES" }
      );

      project.projectImg = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

    await project.save();
    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Error in updateProject", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/project/all
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    if (!projects || projects.length === 0) return res.status(200).json([]);

    return res.status(200).json(projects);
  } catch (error) {
    console.log("Error in getAllSProject Controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/project/id"
// METHOD   : GET
// ACCESS   : Public
// DESC     : Get Single Project
export const getProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    res.status(200).json(project);
  } catch (error) {
    console.log("Error in getProject Controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/project/id"
// METHOD   : DELETE
// ACCESS   : PRIVATE
// DESC     : Delete project
export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Delete the project Img from Cloudinary if it exists
    if (project.projectImg && project.projectImg.public_id) {
      await cloudinary.uploader.destroy(project.projectImg.public_id);
    }

    await Project.findByIdAndDelete(id);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProject controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};
