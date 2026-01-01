import {Server} from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer();

const io = new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        method:["GET","POST"]
    }
});

const userSocketMap = {}; // this map sotores socket id corresponding the user id; userid --> socketid

io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
        console.log(`user connected: UserId = ${userId} , Socket = ${socket.id}`);
    }

    io.emit("getOnlineUser",Object.keys(userSocketMap));//online user

    socket.on("disconnect",()=>{
        if(userId){
            console.log(`user connected: UserId = ${userId} , Socket = ${socket.id}`);
            delete userSocketMap[userId]
        }
        io.emit("getOnlineUser",Object.keys(userSocketMap))
    })
});


export {app ,server ,io}