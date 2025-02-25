const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 200,
    },
    status: {
      type: String,
      enum: ["Active", "Completed"],
      default: "Active",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
