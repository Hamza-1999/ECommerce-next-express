import { Router } from "express";
import { Login, MyProfile, Register } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/login", Login);
authRoutes.post("/register", Register);
authRoutes.get("/myProfile", MyProfile);

export default authRoutes;
