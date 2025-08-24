import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    house: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true }
    // You can add more address fields here as needed, e.g. street, city, etc.
  },
});

export const User = mongoose.model("User", UserSchema);
