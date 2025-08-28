import { Request, Response } from "express";
import { User } from "../models/User.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { read } from "fs";
import { sendEmail } from "../services/emailService";

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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // throw new Error("User already exists");
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      address,
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

export const addAddress = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { house, city, zip, label = "Home", isDefault = false } = req.body;
    console.log(req.body, "jhgkjhgjhghjghjg");

    // Validate required fields
    if (!house) {
      return res
        .status(400)
        .json({ message: "House/Street address is required" });
    }
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }
    if (!zip) {
      return res.status(400).json({ message: "ZIP code is required" });
    }

    const userId = (req as any).user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If this is the first address or isDefault is true, set it as default
    let shouldSetAsDefault = isDefault;
    if (!user.addresses || user.addresses.length === 0) {
      shouldSetAsDefault = true;
    }

    // If setting as default, remove default from other addresses
    if (shouldSetAsDefault) {
      await User.updateMany(
        { _id: userId, "addresses.isDefault": true },
        { $set: { "addresses.$.isDefault": false } }
      );
    }

    // Add the new address
    const newAddress = {
      house,
      city,
      zip,
      label,
      isDefault: shouldSetAsDefault,
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: newAddress } },
      { new: true, select: "-password" }
    );

    res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params; // <-- address _id
    const userId = (req as any).user.id;

    // Remove address using MongoDB $pull
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: id } } },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressStillExists = updatedUser.addresses.some(
      (addr: any) => addr._id.toString() === id
    );

    if (addressStillExists) {
      return res.status(400).json({ message: "Address could not be deleted" });
    }

    res.status(200).json({
      message: "Address deleted successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

export const UpdateAddress = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params; // address _id
    const userId = (req as any).user.id;
    const { house, city, zip, label = "home", isDefault = false } = req.body;

    if (!house) {
      return res
        .status(400)
        .json({ message: "House/Street address is required" });
    }
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }
    if (!zip) {
      return res.status(400).json({ message: "ZIP code is required" });
    }

    // If isDefault is true, reset others first
    if (isDefault) {
      await User.updateMany(
        { _id: userId, "addresses.isDefault": true },
        { $set: { "addresses.$[elem].isDefault": false } },
        { arrayFilters: [{ "elem.isDefault": true }] }
      );
    }

    // Update the selected address
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "addresses._id": id },
      {
        $set: {
          "addresses.$.house": house,
          "addresses.$.city": city,
          "addresses.$.zip": zip,
          "addresses.$.label": label,
          "addresses.$.isDefault": !!isDefault,
        },
      },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({
      message: "Address updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

export const Logout = async (req: Request, res: Response) => {
  try {
    console.log("object");
    // Clear the authentication cookie
    res.clearCookie("Ecommerce", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (email) {
      const encodedEmail = await jwt.sign(
        { email },
        (process.env.JWT_SECRET as string) || "secret_key_Ecommerce",
        { expiresIn: "1h" }
      );
      const user = await User.findOne({ email });
      if (user) {
        await sendEmail({
          to: email,
          subject: "Link To Create New Password",
          templateName: "forgotPassword",
          templateData: {
            link: `http://localhost:3000/user/forgot-password/${encodedEmail}`,
          },
        });
        return res.status(200).json({
          message: `Email Send On Your Email ${email}`,
          success: true,
        });
      } else {
        return res.status(400).json({ message: "Email Is Not Registered" });
      }
    }
  } catch (err) {
    console.log(err, "error in forgot password");
    res.status(500).json({
      message: "Internal Server Error",
      error: (err as Error).message,
    });
  }
};

export const newPassword = async (req: Request, res: Response) => {
  const JWT_SECRET = process.env.JWT_SECRET || "secret_key_Ecommerce";
  try {
    const { id } = req.params; 
    const { password } = req.body;

    const decoded = jwt.verify(id, JWT_SECRET) as { email: string };

    if (!decoded || !decoded.email) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const encodedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(
      user._id,
      { $set: { password: encodedPassword } },
      { new: true, runValidators: true, select: "-password" }
    );

    return res
      .status(200)
      .json({ message: "Successfully created new password" });
  } catch (err) {
    console.error("Error occurred in creating new password:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
