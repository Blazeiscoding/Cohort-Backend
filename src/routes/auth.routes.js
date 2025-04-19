import express from "express";
import {
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
} from "../controllers/auth.controllers.js";

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", getCurrentUser);
router.post("/change-password", changeCurrentPassword);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPasswordRequest);
router.post("/reset-password", resetForgottenPassword);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendEmailVerification);

export default router;
