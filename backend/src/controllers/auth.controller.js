import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import validator from "validator";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const isExistUser = await User.findOne({
      $or: [{ userName: userName.trim() }, { email: email.trim() }],
    });

    if (isExistUser) {
      throw new ApiError(400, "User already exists");
    }

    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Email invalid");
    }

    if (password.length < 6) {
      throw new ApiError(400, " Password should be greater then 6 characters");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const userImagePath = req.file?.path;

    if (!userImagePath) {
      throw new ApiError(400, "UserImage file not found");
    }

    const userImage = await uploadOnCloudinary(userImagePath);

    if (!userImage) {
      throw new ApiError(400, "user image not foound on cloudinary");
    }

    const user = await User.create({
      userName: userName.trim(),
      email: email.trim(),
      userImage: userImage.url,
      password: hashedPassword,
    });
    console.log("user is", user);

    const createdUser = await User.findById(user._id).select(" -password ");

    if (!createdUser) {
      throw new ApiError(400, "User not created properly");
    }

    const savedUser = await createdUser.save();
    return res
      .status(201)
      .json(new ApiResponse(201, savedUser, "User created successfully"));
  } catch (error) {
    throw new ApiError("Something went wrong", error);
  }
};

const signIn = async (req, res) => {
  //logic
  try {
    const { userName, email, password } = req.body;
    console.log("Body ----------> ", req.body);
    if (!userName || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    //checking if image is correct
    console.log("Here1");
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Invalid Email");
    }

    //checking in the database if the user exists
    console.log("DB Access");
    const isExistUser = await User.findOne({
      $or: [{ userName: userName.trim() }, { email: email.trim() }],
    });

    console.log("DB Done");

    if (!isExistUser) {
      throw new ApiError(400, "User Not Found");
    }

    console.log("before");

    const comparePassword = await bcrypt.compareSync(
      password,
      isExistUser.password
    ); //Comparing the paswords
    console.log("com", comparePassword);
    console.log("after");

    if (!comparePassword) {
      throw new ApiError(400, "Incorrect password");
    }

    //JWT(json web token) is used generating or verifying tokens/cookies.

    const token = jwt.sign(
      { id: isExistUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    if (!token) {
      throw new ApiError(400, "Token not found");
    }

    const loggedInUser = await User.findById(isExistUser._id).select(
      "-password"
    );

    //conditions
    const options = {
      httpOnly: true,
      secure: false,
    };

    return res
      .status(200)
      .cookie("accessToken", token, options)
      .json(
        new ApiResponse(
          200,
          {
            loggedInUser,
            token,
          },
          "User Logged in successfully"
        )
      );
  } catch (error) {
    throw new ApiError(400, error);
  }
};
const signOut = async (req, res) => {
  //logic
  const options = {
    httpOnly: true,
    secure: false,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logout successfully"));
};

export { register, signIn, signOut };
