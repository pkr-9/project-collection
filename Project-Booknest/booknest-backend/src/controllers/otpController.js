import { generateOTP, verifyStoredOTP } from "../services";
import transporter from "../config/mailConfig.js";
import User from "../models/user.model.js";
import { hashPassword } from "../utils/passwordUtils.js";

export const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = await generateOTP(email);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      html: `<p>Your OTP for verification is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    res.status(429).json({ message: error.message || "Failed to send OTP." });
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyStoredOTP(email, otp);
    if (!result.status) {
      return res.status(400).json({
        message: result.reason === "expired" ? "OTP expired." : "Invalid OTP.",
      });
    }
    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    next(error);
  }
};

export const registerWithOTP = async (req, res, next) => {
  try {
    const { name, email, password, otp } = req.body;
    const isValid = await verifyStoredOTP(email, otp);
    if (!isValid.status) {
      return res.status(400).json({
        message: result.reason === "expired" ? "OTP expired." : "Invalid OTP.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: "Registration successful.", userId: newUser._id });
  } catch (error) {
    next(error);
  }
};

export const updatePasswordWithOTP = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const isValid = await verifyStoredOTP(email, otp);
    if (!isValid.status) {
      return res.status(400).json({
        message: result.reason === "expired" ? "OTP expired." : "Invalid OTP.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};
