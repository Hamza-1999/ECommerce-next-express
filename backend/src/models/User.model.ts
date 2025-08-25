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
  addresses: [{
    house: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    label: { type: String, default: "Home" } // e.g., "Home", "Work", "Office"
  }],
  // Keep the original address field for backward compatibility
  address: {
    house: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true }
  },
});

export const User = mongoose.model("User", UserSchema);
