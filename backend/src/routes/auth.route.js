import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { register, signIn, signOut } from "../controllers/auth.controller.js";
import verifyJWT from "../middleware/auth.Middleware.js";
const authRouter = express.Router();

authRouter.route("/register").post(upload.single("userImage"), register);
authRouter.route("/sign-In").post(signIn);
authRouter.route("/sign-Out").post(verifyJWT, signOut);

export default authRouter;
