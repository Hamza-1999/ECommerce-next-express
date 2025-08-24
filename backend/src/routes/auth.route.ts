import { Router } from "express";
import {
  Login,
  MyProfile,
  Register,
  updateProfile,
  Logout,
} from "../controllers/auth.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const authRoutes = Router();

authRoutes.post("/login", Login);
authRoutes.post("/register", Register);
authRoutes.get("/myProfile", authenticateUser, MyProfile);
authRoutes.patch("/updateProfile", authenticateUser, updateProfile);
authRoutes.get("/logout", authenticateUser, Logout);

export default authRoutes;
