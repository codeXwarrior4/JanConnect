const express = require("express");
const mongoose = require("mongoose");
const Issue = require("../models/Issue");

const router = express.Router();

// Generate complaint ID like JAN123456
const generateComplaintId = async () => {
  let complaintId;
  let exists = true;

  while (exists) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    complaintId = `JAN${randomNumber}`;

    const existingIssue = await Issue.findOne({ complaintId });
    if (!existingIssue) {
      exists = false;
    }
  }

  return complaintId;
};

// POST /api/issues
// Create new issue
router.post("/", async (req, res, next) => {
  try {
    const { name, title, category, description, area, latitude, longitude } =
      req.body;

    if (
      !name ||
      !title ||
      !category ||
      !description ||
      !area ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be valid numbers",
      });
    }

    const complaintId = await generateComplaintId();

    const newIssue = await Issue.create({
      complaintId,
      name,
      title,
      category,
      description,
      area,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
    });

    res.status(201).json({
      success: true,
      message: "Issue reported successfully",
      data: newIssue,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/issues
// Get all issues latest first
router.get("/", async (req, res, next) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/issues/:complaintId
// Get single issue by complaintId
router.get("/:complaintId", async (req, res, next) => {
  try {
    const { complaintId } = req.params;

    const issue = await Issue.findOne({ complaintId });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/issues/:id/status
// Update issue status by MongoDB _id
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Submitted",
      "Under Review",
      "In Progress",
      "Resolved",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue id",
      });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue status updated successfully",
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;