import express from "express";
import {
  login,
  firstLoginChangePassword,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * Login endpoints
 * Managers and Agents share one login portal
 * Customers have a separate portal
 *
 * Frontend must send:
 * {
 *   email: string,
 *   password: string,
 *   portal: 'manager-agent' | 'customer'
 * }
 */
router.post("/login", login);

/**
 * First login password change (temporary password)
 * Frontend must send:
 * {
 *   userId: string,
 *   tempPassword: string,
 *   newPassword: string
 * }
 */
router.post("/first-login", firstLoginChangePassword);

/**
 * Forgot password
 * Frontend sends:
 * {
 *   email: string
 * }
 * Response always generic
 */
router.post("/forgot-password", forgotPassword);

/**
 * Reset password
 * Frontend sends:
 * {
 *   token: string,
 *   newPassword: string
 * }
 */
router.post("/reset-password", resetPassword);

/**
 * Logout
 * Frontend can optionally send userId for future audit logging
 */
router.post("/logout", logout);

export default router;
