import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

const handleError = (res, message = "Internal Server Error", status = 500) => {
  return res.status(status).json({ message });
};

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return handleError(res, "All fields are required", 400);
  }

  if (password.length < 6) {
    return handleError(res, "Password must be at least 6 characters", 400);
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return handleError(res, "Email already exists", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    handleError(res);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return handleError(res, "All fields are required", 400);
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return handleError(res, "Invalid credentials", 400);
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    handleError(res);
  }
};

export const logout = (_req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    handleError(res);
  }
};

export const updateProfile = async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;

  if (!profilePic) {
    return handleError(res, "Profile pic is required", 400);
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResult.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error.message);
    handleError(res);
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Check auth error:", error.message);
    handleError(res);
  }
};
