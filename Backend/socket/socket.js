import { Server } from "socket.io";
import express from "express";
import http from "http";
import { generateUserKeyPair } from "../utils/encryption.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    method: ["GET", "POST"],
  },
});

const userSocketMap = {}; // userId --> socketId
export const getReciverSocketId = (reciverId) => userSocketMap[reciverId];

// Function to broadcast online users to all connected clients
const broadcastOnlineUsers = () => {
  const onlineUserIds = Object.keys(userSocketMap);
  console.log(
    `Broadcasting online users to all clients: [${onlineUserIds.join(", ")}]`,
  );
  io.emit("getOnlineUser", onlineUserIds);
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`Socket connection attempt, userId: ${userId}`);

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    // Generate encryption keys for the user on connection
    generateUserKeyPair(userId);
    console.log(`User connected: UserId = ${userId} , Socket = ${socket.id}`);
    console.log(`Encryption keys generated for user: ${userId}`);
    console.log(`Current online users:`, Object.keys(userSocketMap));
  }

  // Broadcast online users to ALL clients
  broadcastOnlineUsers();

  // Handle encrypted message transmission
  socket.on("sendEncryptedMessage", (data) => {
    const { recipientId, encryptedMessage, encryptedKey } = data;
    const recipientSocketId = getReciverSocketId(recipientId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveEncryptedMessage", {
        senderId: userId,
        encryptedMessage,
        encryptedKey,
        timestamp: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    if (userId && userId !== "undefined") {
      console.log(
        `User disconnected: UserId = ${userId} , Socket = ${socket.id}`,
      );
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
      }
    }
    // Broadcast updated online users after disconnect
    broadcastOnlineUsers();
  });
});

export { app, server, io };
