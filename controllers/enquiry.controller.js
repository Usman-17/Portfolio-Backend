import { Enquiry } from "../models/enquiry.model.js";

// PATH     : /api/enquiry/create
// METHOD   : POST
// ACCESS   : Public
// DESC     : Create Enquiry
export const createEnquiry = async (req, res) => {
  const { name, email, mobile, subject, comment } = req.body;
  try {
    if (!name || !email || !mobile || !subject || !comment)
      return res.status(400).json({ message: "Please fill full form" });

    const enquiry = await Enquiry.create({
      name,
      email,
      mobile,
      subject,
      comment,
    });

    res.status(201).json(enquiry);
  } catch (error) {
    console.log("Error in createEnquiry controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PATH     : /api/enquiry/all"
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get all Enquires
export const getAllEnquires = async (req, res) => {
  try {
    const Enquires = await Enquiry.find().sort({ createdAt: -1 });

    if (!Enquires || Enquires.length === 0) return res.status(200).json([]);

    return res.status(200).json(Enquires);
  } catch (error) {
    console.log("Error in getAllEnquires Controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/enquiry/id"
// METHOD   : GET
// ACCESS   : Private
// DESC     : Get enquiry
export const getEnquiry = async (req, res) => {
  const { id } = req.params;
  try {
    const enquiry = await Enquiry.findById(id);
    res.status(200).json(enquiry);
  } catch (error) {
    console.log("Error in getEnquiry Controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/enquiry/id"
// METHOD   : DELETE
// ACCESS   : PUBLIC
// DESC     : Delete Enquiry
export const deleteEnquiry = async (req, res) => {
  const { id } = req.params;

  try {
    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({ error: "Enquiry Not Found" });
    }

    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    console.log("Error in deleteEnquiry Controller", error.message);
    res.status(500).json({ error: error.message });
  }
};
