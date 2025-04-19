import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const registerUser = asyncHandler(async (req, res) => {
  //get user details
  // validation - not empty
  // check if already exists
  // check for image
  // create user
  //validation

  const { email, username, password, role } = req.body;

  if ([email, username, password].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    email,
    username: username.toLowerCase(),
    password,
    role,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  const {
    unHashedToken: forgotToken,
    hashedToken: hashedForgotToken,
    tokenExpiry: forgotExpiry,
  } = user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  user.forgotPasswordToken = hashedForgotToken;
  user.forgotPasswordExpiry = forgotExpiry;
  await user.save();

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mailOption = {
    from: process.env.MAILTRAP_SENDEREMAIL,
    to: user.email,
    subject: "Verify your email",
    text: `Please click on the following link:\n${process.env.BASE_URL}/api/v1/users/verify/${unHashedToken}`,
  };

  await transporter.sendMail(mailOption);

  return res.status(201).json(
    new ApiResponse(201, {
      message: "User created successfully",
      data: user,
    }),
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // get data
  // check if user exists
  // check password
  //validation

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid email or password");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save();

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    message: "User logged in Successfully",
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  //validation
  //we just have to delete cookies

  res.clearCookie("refreshToken");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  //validation
  // check token from url using params
  // check if token is valid
  // delete from db
  // send response

  const { token } = req.params;
  if (!token) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();

  res.status(200).json({
    message: "User verified successfully",
    success: true,
  });
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  //validation
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "User doesn't exist" });
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save();

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mailOption = {
    from: process.env.MAILTRAP_SENDEREMAIL,
    to: user.email,
    subject: "Verify your email",
    text: `Please click on the following link:\n${process.env.BASE_URL}/api/v1/users/verify/${unHashedToken}`,
  };

  await transporter.sendMail(mailOption);

  res
    .status(200)
    .json({ message: "Verification email sent again", success: true });
});

const resetForgottenPassword = asyncHandler(async (req, res) => {
  //validation
  // check if user exists
  // send email
  // take resetPassToken from url
  // check if token is valid
  // update password

  const { password } = req.body;
  const { forgotPassToken } = req.params;

  const hashedToken = crypto
    .createHash("sha256")
    .update(forgotPassToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  res.status(200).json({
    message: "Password reset successfully",
    success: true,
  });
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  //validation
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User doesn't exist" });
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;
  await user.save();

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mailOption = {
    from: process.env.MAILTRAP_SENDEREMAIL,
    to: user.email,
    subject: "Reset your password",
    text: `Click here to reset your password:\n${process.env.BASE_URL}/api/v1/users/reset/${unHashedToken}`,
  };

  await transporter.sendMail(mailOption);

  res.status(200).json({
    message: "Reset password link sent",
    success: true,
  });
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  //validation
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User doesn't exist" });
  }

  user.password = password;
  await user.save();

  res
    .status(200)
    .json({ message: "Password changed successfully", success: true });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  //validation
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User doesn't exist" });
  }

  res.status(200).json({
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //validation
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token found" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = user.generateAccessToken();

    res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken,
      success: true,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error });
  }
});

export {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  resetForgottenPassword,
  verifyEmail,
};
