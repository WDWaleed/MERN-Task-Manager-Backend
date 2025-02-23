const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getSpecificTasks,
  updateTask,
  deleteTask,
  deleteSpecificTasks,
} = require("../controllers/tasks");

router.route("/").post(createTask).get(getAllTasks);
router.route("/:status").get(getSpecificTasks).delete(deleteSpecificTasks);
router.route("/:id").patch(updateTask).delete(deleteTask);

module.exports = router;
