import express from "express";
import authRoutes from "./routes/auth.route";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/auth", authRoutes);

export default app;
