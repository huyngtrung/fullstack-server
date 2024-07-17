const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);

const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);

const userRouter = require("./routes/Users");
app.use("/auth", userRouter);

const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

db.sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3001;
  const DATABASE_HOST = process.env.DATABASE_HOST;
  const DATABASE_USER = process.env.DATABASE_USER;
  const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
  const DATABASE_DBNAME = process.env.DATABASE_DBNAME;

  // Replace your Sequelize connection setup with environment variables
  db.sequelize
    .authenticate()
    .then(() => {
      console.log("Database connection has been established successfully.");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
});
