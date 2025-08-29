"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.UserSchema = new mongoose_1.default.Schema({
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
exports.User = mongoose_1.default.model("User", exports.UserSchema);
