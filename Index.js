const express = require("express");
const env = require("dotenv").config();
const connect = require("./Config/dbConnection");
const BlogsRouter = require("./Routes/BlogsRoutes");
const cors = require("cors");
const mongoose = require("mongoose");
const CommentsRouter = require("./Routes/CommentRoutes");
const userRoutes = require("./Routes/UserRoutes");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: "*" }));
app.use("/Api", BlogsRouter);
app.use("/Api/Comments", CommentsRouter);
app.use("/Api/Users", userRoutes);

connect();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
