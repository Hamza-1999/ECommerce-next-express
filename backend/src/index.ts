import express from "express";
import authRoutes from "./routes/auth.route";
import cors from "cors";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use("/auth", authRoutes);

export default app;