const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200,
  },

  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000,
  },

  type: {
    type: String,
    enum: ["complaint", "feedback", "suggestion", "bug-report"],
    default: "complaint",
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },

  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved", "closed"],
    default: "pending",
  },

  category: {
    type: String,
    enum: [
      "order-issue",
      "book-quality",
      "website-issue",
      "payment-issue",
      "delivery-issue",
      "other",
    ],
    default: "other",
  },

  adminResponse: {
    type: String,
    default: "",
  },

  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  respondedAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
complaintSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Complaint", complaintSchema);
