import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

import { ApiResponse } from "../utils/apiResponse.js";

const updateDetails = async (req, res) => {
  //logic
  try {
    const { userName, email } = req.body;

    if (!userName || !email) {
      throw new ApiError(400, "All fields are required");
    }

    const updateUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          userName: userName.trim(),
          email: email.trim(),
        },
      },
      { new: true }
    );
    if (!updateUser) {
      throw new ApiError(400, "User updation proccess failed");
    }

    const user = await updateUser.save();

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const updateUserImage = async (req, res) => {
  //logic
};

const changePassword = async (req, res) => {
  //logic
  try {
    const { oldPass, newPass } = req.body;
    if (!oldPass || !newPass) {
      throw new ApiError(400, "All fields required");
    }

    console.log(req.user?._id);

    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new ApiError(400, "Invalid user");
    }

    const comparePass = bcrypt.compareSync(oldPass, user.password);
    if (!comparePass) {
      throw new ApiError(400, "password not match");
    }

    const hashedNewPass = bcrypt.hashSync(newPass, 10);
    user.password = hashedNewPass;

    await user.save();
    return res.status(200).json(200, {}, "Password changed successfully");
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const deleteUser = async (req, res) => {
  //logic
  try {
    await User.findByIdAndDelete(req.user?._id, { new: true });

    const options = {
      httpOnly: true,
      secure: false,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .json(new ApiResponse(200, {}, "User deleted successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export { updateDetails, updateUserImage, changePassword, deleteUser };
