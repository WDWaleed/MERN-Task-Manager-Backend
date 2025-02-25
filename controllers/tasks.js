const Task = require("../models/Task");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createTask = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new BadRequestError("Please provide a name");
  }
  req.body.createdBy = req.user.userId;

  const task = await Task.create(req.body);
  res.status(StatusCodes.CREATED).json(task);
};
const getTasks = async (req, res) => {
  const { userId } = req.user;
  const { status } = req.query;
  let tasks;
  if (status) {
    tasks = await Task.find({ createdBy: userId, status }).sort("-createdAt");
  } else {
    tasks = await Task.find({ createdBy: userId }).sort("-createdAt");
  }

  res.status(StatusCodes.OK).json({ count: tasks.length, tasks });
};
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { body } = req;
  if (body.name === "" || body.status === "") {
    throw new BadRequestError("Please provide a name");
  }

  const task = await Task.findByIdAndUpdate(
    { _id: id, createdBy: userId },
    body,
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
  const { clear } = req.query;
  const tasks = await Task.deleteMany({ status: clear });
  res.status(StatusCodes.OK).send(`${clear} tasks deleted`);
};

module.exports = {
  getTasks,
  updateTask,
  deleteTask,
  deleteTasks,
  createTask,
};
