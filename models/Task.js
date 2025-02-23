const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 200,
  },
  status: {
    type: String,
    required: true,
    enum: ["Active", "Completed"],
    default: "Active",
  },
});

module.exports = mongoose.model("Task", TaskSchema);
