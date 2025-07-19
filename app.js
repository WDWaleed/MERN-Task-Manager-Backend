const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
require("express-async-errors");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const authenticationMiddleware = require("./middleware/authenticationMiddleware");

const TasksRouter = require("./routes/tasks");
const AuthRouter = require("./routes/auth");
const UserRouter = require("./routes/user");
const app = express();

// Middleware
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 1 * 1000 * 60, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later",
  })
);
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(xss());

//Routes
app.get("/", (req, res) => {
  res.send("MERN Task Manager");
});
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);

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
    console.log(error.message);
  }
};

startServer();
