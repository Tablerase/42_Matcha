import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { FRONTEND_ORIGIN, JWT_SECRET_KEY } from "@settings";
import { SOCKET_EVENTS } from "@interfaces/socketEvents";
import { Request, Response, NextFunction } from "express";

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: FRONTEND_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Add middleware to parse cookies
  io.engine.use(cookieParser());

  // Add middleware to check auth token
  io.engine.use((req: Request, res: Response, next: NextFunction) => {
    const authToken = req.cookies?.authToken;
    if (!authToken) {
      return next(new Error("No auth token found"));
    }

    try {
      const decoded = jwt.verify(authToken, JWT_SECRET_KEY) as { id: number };
      if (!decoded.id) {
        return next(new Error("Invalid token"));
      }
      next();
    } catch (error) {
      return next(new Error("Invalid token"));
    }
  });

  // Socket.IO connection handling
  io.on(SOCKET_EVENTS.CONNECT, (socket) => {
    console.log("Client connected:", socket.id);

    // Get auth token from cookie
    const authToken = socket.handshake.headers.cookie
      ?.split("authToken=")[1]
      ?.split(";")[0];

    if (!authToken) {
      socket.emit("error", { message: "No auth token found" });
      socket.disconnect();
      return;
    }

    // Listen for client joining their own room
    socket.on(SOCKET_EVENTS.JOIN, async (room: string) => {
      try {
        const decoded = jwt.verify(authToken, JWT_SECRET_KEY) as { id: number };

        if (!decoded.id) {
          socket.emit("error", { message: "Invalid token" });
          return;
        }

        const userRoom = `user_${decoded.id}_${socket.id}`;
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
        console.log(`User ${decoded.id} joined room ${userRoom}`);
      } catch (error) {
        console.error("Socket join error:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};
