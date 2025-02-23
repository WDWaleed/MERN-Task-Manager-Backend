const createTask = async (req, res) => {
  const { userId } = req.userId;
};
const getAllTasks = async (req, res) => {
  res.send("Get All Tasks");
};
const getSpecificTasks = async (req, res) => {
  res.send("Get Tasks");
};
const updateTask = async (req, res) => {
  res.send("Update Task");
};
const deleteTask = async (req, res) => {
  res.send("Delete Task");
};
const deleteSpecificTasks = async (req, res) => {
  res.send("Delete Tasks");
};

module.exports = {
  getAllTasks,
  getSpecificTasks,
  updateTask,
  deleteTask,
  deleteSpecificTasks,
  createTask,
};
