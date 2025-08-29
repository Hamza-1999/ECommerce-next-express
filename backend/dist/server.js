"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./index"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const cookie_1 = __importDefault(require("cookie"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
// Middleware
index_1.default.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
index_1.default.use((0, cookie_parser_1.default)());
index_1.default.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    next();
});
// MongoDB Connection
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";
mongoose_1.default
    .connect(mongoUri)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
// Start Server
const PORT = process.env.PORT || 5000;
const server = http_1.default.createServer(index_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});
io.use((socket, next) => {
    try {
        const cookies = socket.handshake.headers.cookie;
        if (!cookies)
            return next(new Error("No cookies found"));
        const parsedCookies = cookie_1.default.parse(cookies);
        const token = parsedCookies.Ecommerce;
        if (!token)
            return next(new Error("No token found"));
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    }
    catch (err) {
        next(new Error("Authentication error"));
    }
});
// Handle Socket.IO Connections
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}`);
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.user.id}`);
    });
});
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
