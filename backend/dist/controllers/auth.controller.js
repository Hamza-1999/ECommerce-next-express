"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPassword = exports.forgotPassword = exports.Logout = exports.UpdateAddress = exports.deleteAddress = exports.addAddress = exports.updateProfile = exports.MyProfile = exports.Register = exports.Login = void 0;
const User_model_1 = require("../models/User.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailService_1 = require("../services/emailService");
const JWT_SECRET = process.env.JWT_SECRET || "secret_key_Ecommerce";
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const { password: _, ...userWithoutPassword } = user.toObject();
        const token = jsonwebtoken_1.default.sign({ id: user._id, user: user }, // Minimal info
        JWT_SECRET, { expiresIn: "7d" } // Token valid for 7 days
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
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.Login = Login;
const Register = async (req, res) => {
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
        const existingUser = await User_model_1.User.findOne({ email });
        if (existingUser) {
            // throw new Error("User already exists");
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await User_model_1.User.create({
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
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.Register = Register;
const MyProfile = async (req, res) => {
    console.log(req.cookies, req.user, "req.cookies");
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User_model_1.User.findById(req.user.id).select("-password");
    res.status(200).json({ user });
};
exports.MyProfile = MyProfile;
const updateProfile = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        // Get only allowed fields from request body
        const updates = {};
        if (req.body.firstName)
            updates.firstName = req.body.firstName;
        if (req.body.lastName)
            updates.lastName = req.body.lastName;
        if (req.body.phone)
            updates.phone = req.body.phone;
        if (req.body.address)
            updates.address = req.body.address;
        // Update user document
        const updatedUser = await User_model_1.User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true, runValidators: true, select: "-password" });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.updateProfile = updateProfile;
const addAddress = async (req, res) => {
    try {
        if (!req.user) {
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
        const userId = req.user.id;
        const user = await User_model_1.User.findById(userId);
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
            await User_model_1.User.updateMany({ _id: userId, "addresses.isDefault": true }, { $set: { "addresses.$.isDefault": false } });
        }
        // Add the new address
        const newAddress = {
            house,
            city,
            zip,
            label,
            isDefault: shouldSetAsDefault,
        };
        const updatedUser = await User_model_1.User.findByIdAndUpdate(userId, { $push: { addresses: newAddress } }, { new: true, select: "-password" });
        res.status(201).json({
            message: "Address added successfully",
            address: newAddress,
            user: updatedUser,
        });
    }
    catch (error) {
        console.error("Add address error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.addAddress = addAddress;
const deleteAddress = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params; // <-- address _id
        const userId = req.user.id;
        // Remove address using MongoDB $pull
        const updatedUser = await User_model_1.User.findByIdAndUpdate(userId, { $pull: { addresses: { _id: id } } }, { new: true, select: "-password" });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const addressStillExists = updatedUser.addresses.some((addr) => addr._id.toString() === id);
        if (addressStillExists) {
            return res.status(400).json({ message: "Address could not be deleted" });
        }
        res.status(200).json({
            message: "Address deleted successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error("Delete address error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.deleteAddress = deleteAddress;
const UpdateAddress = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params; // address _id
        const userId = req.user.id;
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
            await User_model_1.User.updateMany({ _id: userId, "addresses.isDefault": true }, { $set: { "addresses.$[elem].isDefault": false } }, { arrayFilters: [{ "elem.isDefault": true }] });
        }
        // Update the selected address
        const updatedUser = await User_model_1.User.findOneAndUpdate({ _id: userId, "addresses._id": id }, {
            $set: {
                "addresses.$.house": house,
                "addresses.$.city": city,
                "addresses.$.zip": zip,
                "addresses.$.label": label,
                "addresses.$.isDefault": !!isDefault,
            },
        }, { new: true, select: "-password" });
        if (!updatedUser) {
            return res.status(404).json({ message: "Address not found" });
        }
        res.status(200).json({
            message: "Address updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error("Update address error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.UpdateAddress = UpdateAddress;
const Logout = async (req, res) => {
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
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.Logout = Logout;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (email) {
            const encodedEmail = await jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET || "secret_key_Ecommerce", { expiresIn: "1h" });
            const user = await User_model_1.User.findOne({ email });
            if (user) {
                await (0, emailService_1.sendEmail)({
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
            }
            else {
                return res.status(400).json({ message: "Email Is Not Registered" });
            }
        }
    }
    catch (err) {
        console.log(err, "error in forgot password");
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};
exports.forgotPassword = forgotPassword;
const newPassword = async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET || "secret_key_Ecommerce";
    try {
        const { id } = req.params;
        const { password } = req.body;
        const decoded = jsonwebtoken_1.default.verify(id, JWT_SECRET);
        if (!decoded || !decoded.email) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        const user = await User_model_1.User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const encodedPassword = await bcrypt_1.default.hash(password, 10);
        await User_model_1.User.findByIdAndUpdate(user._id, { $set: { password: encodedPassword } }, { new: true, runValidators: true, select: "-password" });
        return res
            .status(200)
            .json({ message: "Successfully created new password" });
    }
    catch (err) {
        console.error("Error occurred in creating new password:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.newPassword = newPassword;
