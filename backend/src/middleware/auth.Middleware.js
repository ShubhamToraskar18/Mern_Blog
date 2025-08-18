import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
const verifyJWT = async (req, res, next) => {
  try {
    const tokenFromClient =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    console.log(tokenFromClient);

    if (!tokenFromClient) {
      throw new ApiError(400, "Token Not Found");
    }

    const decodedToken = jwt.verify(
      tokenFromClient,
      process.env.ACCESS_TOKEN_SECRET
    );

    console.log(decodedToken);

    if (!decodedToken) {
      throw new ApiError(400, "Invalid access token");
    }

    const user = await User.findById(decodedToken?.id).select(" -password ");
    console.log("user", user);

    if (!user) {
      throw new ApiError(400, "Invalid user");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export default verifyJWT;
