import Skill from "../models/skill.model.js";
import { v2 as cloudinary } from "cloudinary";

// PATH     : /api/skill/create
// METHOD   : POST
// ACCESS   : PRIVATE
// DESC     : Create Skill
export const createSkill = async (req, res) => {
  try {
    const { name } = req.body;
    const { svg } = req.files;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Check if the skill name already exists
    const existingSkill = await Skill.findOne({ name });
    if (existingSkill) {
      return res
        .status(400)
        .json({ error: "Skill with this name already exists." });
    }

    // Upload SVG to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      svg.tempFilePath,
      { folder: "SKILLS" }
    );

    const newSkill = new Skill({
      name,
      svg: {
        url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
      },
    });

    await newSkill.save();
    return res.status(201).json(newSkill);
  } catch (error) {
    console.error("Error in createSkill controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/skill/update/id
// METHOD   : POST
// ACCESS   : PRIVATE
// DESC     : Create Skill
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    if (name) skill.name = name;

    // Handle Skill Svg Upload
    if (req.files && req.files.svg) {
      if (skill.svg && skill.svg.public_id) {
        await cloudinary.uploader.destroy(skill.svg.public_id);
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        req.files.svg.tempFilePath,
        { folder: "SKILLS" }
      );

      skill.svg = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

    await skill.save();
    res.status(200).json({
      success: true,
      skill,
    });
  } catch (error) {
    console.error("Error in updateSkill", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/skill/all"
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get all Skills
export const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find();

    if (!skills || skills.length === 0) return res.status(200).json([]);

    return res.status(200).json(skills);
  } catch (error) {
    console.log("Error in getAllSkills Controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/Skill/id"
// METHOD   : GET
// ACCESS   : Private
// DESC     : Get Skill
export const getSkill = async (req, res) => {
  const { id } = req.params;
  try {
    const skill = await Skill.findById(id);
    res.status(200).json(skill);
  } catch (error) {
    console.log("Error in getSkill Controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/skill/id"
// METHOD   : DELETE
// ACCESS   : PRIVATE
// DESC     : Delete Skill
export const deleteSkill = async (req, res) => {
  const { id } = req.params;

  try {
    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    // Delete the SVG from Cloudinary if it exists
    if (skill.svg && skill.svg.public_id) {
      await cloudinary.uploader.destroy(skill.svg.public_id);
    }

    await Skill.findByIdAndDelete(id);
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSkill controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};
