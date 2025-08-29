"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPassword = exports.ForgotPasswordSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.ForgotPasswordSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
    },
    paramsEmail: {
        type: String,
        required: true,
    },
});
exports.ForgotPassword = mongoose_1.default.model("ForgotPassword", exports.ForgotPasswordSchema);
