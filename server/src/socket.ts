import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { FRONTEND_ORIGIN, JWT_SECRET_KEY } from "@settings";
import { SOCKET_EVENTS } from "@interfaces/socketEvents";
import { Request, Response, NextFunction } from "express";
import { authenticateSocketToken, authenticateToken } from "./middlewares/auth";
import { time } from "console";

export const initializeSocket = (httpServer: HttpServer) => {
  /* ________________________________ Socket Setup ________________________________ */
  const io = new Server(httpServer, {
    cors: {
      origin: FRONTEND_ORIGIN,
      credentials: true,
    },
  });

  // Add middleware to parse cookies
  io.engine.use(cookieParser());

  // Add middleware to authenticate token
  io.engine.use(authenticateSocketToken);

  // Socket.IO connection handling
  io.on(SOCKET_EVENTS.CONNECT, (socket: Socket, req: Request) => {
    console.log("Client connected:", socket.id);

    /* ________________________________ Socket Data ________________________________ */

    // Get auth token from cookie
    const cookies = socket.handshake.headers.cookie?.toString();
    const authToken = cookies
      ?.split(";")
      .find((c) => c.trim().startsWith("authToken="))
      ?.split("=")[1];
    if (!authToken) {
      socket.emit("error", { message: "No auth token found" });
      return;
    }
    // Add user id to socket data
    socket.data.user = (jwt.decode(authToken) as { id: number }).id;

    // Listen for client joining their own room
    socket.on(SOCKET_EVENTS.JOIN, async (room: string) => {
      try {
        const userRoom = `user_${socket.data.user}_${socket.id}`;
        // Check basic room name format
        if (room !== userRoom) {
          socket.emit("error", { message: "Invalid room name" });
          return;
        }

        // Check if user already in room
        const rooms = Array.from(socket.rooms);
        console.log("Rooms:", rooms);
        if (rooms.includes(userRoom)) {
          return;
        }

        await socket.join(userRoom);
        console.log("User joined room:", userRoom);
        // const response = socket
        // .to(userRoom)
        // .emit(SOCKET_EVENTS.MESSAGE, { message: "Welcome to the room" });
        console.log("Rooms", socket.rooms);
        const response = socket.emit(SOCKET_EVENTS.MESSAGE, {
          message: "Welcome to the room",
        });
        console.log("Response:", response);
      } catch (error) {
        console.error("Socket join error:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    /* ________________________________ Socket Events ________________________________ */

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};
