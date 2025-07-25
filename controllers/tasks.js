const Task = require("../models/Task");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getTasks = async (req, res) => {
  const { userId } = req;
  const { status } = req.query;
  let tasks;
  if (status != undefined) {
    tasks = await Task.find({ createdBy: userId, status }).sort("-createdAt");
  } else {
    tasks = await Task.find({ createdBy: userId }).sort("-createdAt");
  }

  res.status(StatusCodes.OK).json({ count: tasks.length, tasks });
};

const createTask = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new BadRequestError("Please provide a name");
  }

  const { userId } = req;
  req.body.createdBy = userId;

  const task = await Task.create(req.body);

  res.sendStatus(StatusCodes.CREATED);
};

const toggleTask = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  const task = await Task.findOne({ _id: id, createdBy: userId });
  if (!task) {
    throw new NotFoundError("Task not found");
  }

  task.completed = !task.completed;
  await task.save();

  res.status(StatusCodes.OK).json(task);
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const task = await Task.deleteOne({ _id: id, createdBy: userId });

  if (task.deletedCount == 0) {
    throw new NotFoundError(`No task with id ${req.params.id} was found`);
  }

  res.status(StatusCodes.OK).send("Task deleted");
};

const deleteCompletedTasks = async (req, res) => {
  const tasks = await Task.deleteMany({ completed: true });
  res.status(StatusCodes.OK).send("Completed tasks cleared");
};

module.exports = {
  getTasks,
  toggleTask,
  deleteTask,
  deleteCompletedTasks,
  createTask,
};
