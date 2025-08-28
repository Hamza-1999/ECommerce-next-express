import { Router } from "express";
import {
  Login,
  MyProfile,
  Register,
  updateProfile,
  Logout,
  addAddress,
  deleteAddress,
  UpdateAddress,
  forgotPassword,
  newPassword,
} from "../controllers/auth.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const authRoutes = Router();

authRoutes.post("/login", Login);
authRoutes.post("/register", Register);
authRoutes.get("/myProfile", authenticateUser, MyProfile);
authRoutes.patch("/updateProfile", authenticateUser, updateProfile);
authRoutes.post("/addAddress", authenticateUser, addAddress);
authRoutes.delete("/address/:id", authenticateUser, deleteAddress);
authRoutes.put("/address/:id", authenticateUser, UpdateAddress);
authRoutes.get("/logout", authenticateUser, Logout);
authRoutes.post("/forgotPassword", forgotPassword);
authRoutes.post("/create-password/:id", newPassword);

export default authRoutes;
