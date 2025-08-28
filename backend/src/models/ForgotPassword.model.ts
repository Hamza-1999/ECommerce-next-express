import mongoose from "mongoose";

export const ForgotPasswordSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  paramsEmail: {
    type: String,
    required: true,
  },
});

export const ForgotPassword = mongoose.model(
  "ForgotPassword",
  ForgotPasswordSchema
);
