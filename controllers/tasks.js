const Task = require("../models/Task");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createTask = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new BadRequestError("Please provide a name");
  }

  const { userId } = req.user;
  req.body.createdBy = userId;

  // console.log(req.body);

  const task = await Task.create(req.body);
  const tasks = await Task.find({ createdBy: userId }).sort("-createdAt");

  res.status(StatusCodes.CREATED).json(tasks);
};
const getTasks = async (req, res) => {
  const { userId } = req.user;
  const { status } = req.query;
  let tasks;
  if (status != undefined) {
    tasks = await Task.find({ createdBy: userId, status }).sort("-createdAt");
  } else {
    tasks = await Task.find({ createdBy: userId }).sort("-createdAt");
  }

  res.status(StatusCodes.OK).json({ count: tasks.length, tasks });
};
const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.body.createdBy;
  console.log(userId);
  const { name, completed } = req.body;
  console.log(req.body);
  if (name === "" || completed === undefined) {
    throw new BadRequestError("Please provide a name");
  }

  const task = await Task.findByIdAndUpdate(
    { _id: id, createdBy: userId },
    { name, completed },
    { new: true }
  );
  res.status(StatusCodes.OK).json(task);
};
const deleteTask = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const task = await Task.deleteOne({ _id: id, createdBy: userId });

  if (task.deletedCount == 0) {
    throw new NotFoundError(`No task with id ${req.params.id} was found`);
  }

  res.status(StatusCodes.OK).send("Task deleted");
};
const deleteTasks = async (req, res) => {
  const tasks = await Task.deleteMany({ completed: true });
  res.status(StatusCodes.OK).send(tasks);
};

module.exports = {
  getTasks,
  updateTask,
  deleteTask,
  deleteTasks,
  createTask,
};
