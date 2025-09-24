import Auth from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      tenantId: user.tenantId,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password, portal } = req.body; // portal: 'manager-agent' or 'customer'

    const user = await Auth.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password." });
    if (!user.isActive)
      return res
        .status(403)
        .json({ message: "Account inactive. Contact administrator." });

    // Portal role check
    if (
      portal === "manager-agent" &&
      !["manager", "agent"].includes(user.role)
    ) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    if (portal === "customer" && user.role !== "customer") {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // First login with temp password
    if (user.isFirstLogin && user.tempPassword) {
      if (password !== user.tempPassword) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
      // Force password change
      return res
        .status(200)
        .json({
          message: "First login. Please change your password.",
          firstLogin: true,
          userId: user._id,
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password." });

    const token = generateToken(user);
    res.status(200).json({ token, role: user.role, tenantId: user.tenantId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// First login: change password
export const firstLoginChangePassword = async (req, res) => {
  try {
    const { userId, tempPassword, newPassword } = req.body;

    const user = await Auth.findById(userId);
    if (!user || !user.isActive)
      return res
        .status(403)
        .json({ message: "Account inactive. Contact administrator." });
    if (tempPassword !== user.tempPassword)
      return res
        .status(401)
        .json({ message: "Temporary password is invalid." });

    user.password = await bcrypt.hash(newPassword, 10);
    user.tempPassword = undefined;
    user.isFirstLogin = false;
    user.passwordChanged = true;
    await user.save();

    const token = generateToken(user);
    res
      .status(200)
      .json({
        message: "Password updated successfully.",
        token,
        role: user.role,
        tenantId: user.tenantId,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Forgot password: generate reset token
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Auth.findOne({ email: email.toLowerCase() });
    if (!user)
      return res
        .status(200)
        .json({
          message:
            "If your email is registered, you will receive reset instructions.",
        });

    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "24h",
    });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // TODO: send reset email with link https://[portal]/reset-password?token=<resetToken>

    res
      .status(200)
      .json({
        message:
          "If your email is registered, you will receive reset instructions.",
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await Auth.findById(decoded.id);
    if (!user || !user.isActive || user.resetPasswordExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "Reset link is invalid or expired." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Password updated successfully. Please log in." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "You have been logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
