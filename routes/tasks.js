const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  deleteTasks,
} = require("../controllers/tasks");

router.route("/").post(createTask).get(getTasks).delete(deleteTasks);
router.route("/:id").patch(updateTask).delete(deleteTask);

module.exports = router;
