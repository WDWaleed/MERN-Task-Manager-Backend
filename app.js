const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
require("express-async-errors");
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const authenticationMiddleware = require("./middleware/authenticationMiddleware");
const TasksRouter = require("./routes/tasks");
const AuthRouter = require("./routes/auth");
const app = express();

// Middleware

app.use(express.json());

//Routes
app.get("/", (req, res) => {
  res.send("MERN Task Manager");
});
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/tasks", authenticationMiddleware, TasksRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
// Starting Server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
