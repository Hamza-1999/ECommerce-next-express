import { Request, Response } from "express";
import { User } from "../models/User.model";
import bcrypt from "bcrypt";

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
    res.cookie("Ecommerce", JSON.stringify(userWithoutPassword), {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      // sameSite: "strict",
      sameSite: "none",
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
    const { email, password, firstName, lastName, phone } = req.body;
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
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
  console.log(req.cookies,"req.cookies")
};
