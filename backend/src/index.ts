import express from 'express';
import {Server} from 'socket.io'
import http from 'http'

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
    }
})

io.on("connection", (socket) => {
    console.log(`User connected : ${socket.id}`)

    socket.emit("welcome", "Welcome to the server")

    socket.on("join_room",(data)=>{
        socket.join(data)
    })

    socket.on("send_message", (data: {message: string, room: string})=>{
        io.to(data.room).emit("receive_message", data.message)
    })
})

server.listen(3000, () => {
    console.log("Server Running on port 3000")
})