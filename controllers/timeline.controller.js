import Timeline from "../models/timeline.model.js";

// PATH     : /api/timeline/create
// METHOD   : POST
// ACCESS   : PRIVATE
// DESC     : Create Timeline
export const createTimeline = async (req, res) => {
  const { title, description, from, to } = req.body;
  try {
    const newTimeline = await Timeline.create({
      title,
      description,
      timeline: { from, to },
    });

    res.status(201).json(newTimeline);
  } catch (error) {
    console.log("Error in createTimeline controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/timeline/update/id
// METHOD   : Put
// ACCESS   : Private
// DESC     : Update Timeline
export const updateTimeline = async (req, res) => {
  const { id } = req.params;
  const { title, description, from, to } = req.body;

  try {
    let timeline = await Timeline.findById(id);

    if (!timeline) {
      return res.status(404).json({ message: "Timeline not found" });
    }

    // Update the timeline fields
    if (title) timeline.title = title;
    if (description) timeline.description = description;
    if (from) timeline.timeline.from = from;
    if (to !== undefined) {
      timeline.timeline.to = to === "" ? null : to;
    }

    timeline = await timeline.save();

    return res.status(200).json(timeline);
  } catch (error) {
    console.error("Error in updateTimeline Controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/timeline/all"
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get all Timeline
export const getAllTimeline = async (req, res) => {
  try {
    const timelines = await Timeline.find().sort({ createdAt: -1 });

    if (!timelines || timelines.length === 0) return res.status(200).json([]);

    return res.status(200).json(timelines);
  } catch (error) {
    console.log("Error in getAllTimeline Controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/timeline/id"
// METHOD   : GET
// ACCESS   : Private
// DESC     : Get Timeline
export const getTimeline = async (req, res) => {
  const { id } = req.params;
  try {
    const timeline = await Timeline.findById(id);
    res.status(200).json(timeline);
  } catch (error) {
    console.log("Error in getTimeline Controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/timeline/id"
// METHOD   : DELETE
// ACCESS   : PRIVATE
// DESC     : Delete Timeline
export const deleteTimeline = async (req, res) => {
  const { id } = req.params;

  try {
    const timeline = await Timeline.findByIdAndDelete(id);

    if (!timeline) {
      return res.status(404).json({ error: "Timeline Not Found" });
    }

    res.status(200).json({ message: "Timeline deleted successfully" });
  } catch (error) {
    console.log("Error in deleteTimeline Controller", error.message);
    res.status(500).json({ error: error.message });
  }
};
