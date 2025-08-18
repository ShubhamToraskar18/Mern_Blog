// index.js = Entry Point
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config({
  path: "./.env",
});

import express from "express";
const app = express();

//middleware
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));

import connectionDB from "./db/databaseConnection.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

connectionDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Sever running on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("Server connection failed:", error);
  });

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
