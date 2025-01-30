import { io } from "socket.io-client";
import { SERVER_URL } from "@/utils/config";

/* ______________________________ Socket Events ______________________________ */

export const SOCKET_EVENTS = {
  // System events
  NOTIFICATION: "notification",
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  JOIN: "join",
  // Chats events
  MESSAGE_NEW: "newMessage",
  // Matching events
  MATCH_NEW: "newMatch",
  LIKE_NEW: "newLike",
  LIKE_DELETE: "newUnlike", // If user are already matched
  VIEW_PROFILE: "viewProfile",
};

export interface NotificationPayload {
  type: keyof typeof SOCKET_EVENTS;
  message: string;
  fromUserId: number;
  toUserId: number;
  createAt: Date;
}

/* ________________________________ Socket.io ________________________________ */

export const initializeSocket = (userId: number) => {
  const socket = io(SERVER_URL, {
    withCredentials: true,
  });

  socket.on(SOCKET_EVENTS.CONNECT, () => {
    console.log("Socket: Connected to server");

    const userRoom = `user_${userId}_${socket.id}`;
    console.log("Joining user room: ", userRoom);
    socket.emit(SOCKET_EVENTS.JOIN, userRoom);
  });
  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log("Socket: Disconnected from server");
  });

  socket.on(SOCKET_EVENTS.NOTIFICATION, (payload: NotificationPayload) => {
    console.log("Socket: Notification", payload);
  });

  return socket;
};
