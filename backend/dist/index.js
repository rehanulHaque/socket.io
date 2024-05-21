"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173',
    }
});
io.on("connection", (socket) => {
    console.log(`User connected : ${socket.id}`);
    socket.emit("welcome", "Welcome to the server");
    socket.on("join_room", (data) => {
        socket.join(data);
    });
    socket.on("send_message", (data) => {
        io.to(data.room).emit("receive_message", data.message);
    });
});
server.listen(3000, () => {
    console.log("Server Running on port 3000");
});
