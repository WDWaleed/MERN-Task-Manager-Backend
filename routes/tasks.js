const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  toggleTask,
  deleteTask,
  deleteCompletedTasks,
} = require("../controllers/tasks");

router.route("/").post(createTask).get(getTasks);
router.route("/clear-completed").delete(deleteCompletedTasks);
router.route("/:id/toggle").patch(toggleTask).delete(deleteTask);
router.route("/:id").delete(deleteTask);

module.exports = router;
