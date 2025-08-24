import { Request, Response } from "express";
import { User } from "../models/User.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_Ecommerce";

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const { password: _, ...userWithoutPassword } = user.toObject();
    const token = jwt.sign(
      { id: user._id, user: user }, // Minimal info
      JWT_SECRET,
      { expiresIn: "7d" } // Token valid for 7 days
    );
    res.cookie("Ecommerce", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      // sameSite: "strict",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
    });
    res
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, address } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!firstName) {
      return res.status(400).json({ message: "First name is required" });
    }
    if (!lastName) {
      return res.status(400).json({ message: "Last name is required" });
    }
    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }
    if (!address) {
      return res.status(400).json({ message: "address is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      address
    });
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

export const MyProfile = async (req: Request, res: Response) => {
  console.log(req.cookies, (req as any).user, "req.cookies");
  if (!(req as any).user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await User.findById((req as any).user.id).select("-password");
  res.status(200).json({ user });
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user)
      return res.status(401).json({ message: "Unauthorized" });

    // Get only allowed fields from request body
    const updates: Partial<{
      firstName: string;
      lastName: string;
      phone: string;
      address: { house: string; city: string; zip: string };
    }> = {};
    if (req.body.firstName) updates.firstName = req.body.firstName;
    if (req.body.lastName) updates.lastName = req.body.lastName;
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.body.address) updates.address = req.body.address;

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      (req as any).user.id,
      { $set: updates },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};
