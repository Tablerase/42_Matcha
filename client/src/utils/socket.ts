import { io } from "socket.io-client";
import { enqueueSnackbar } from "notistack";
import { SERVER_URL } from "@/utils/config";

/* ______________________________ Socket Events ______________________________ */
export enum SOCKET_EVENTS {
  // System events
  NOTIFICATION = "notification",
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  JOIN = "join",
  ERROR = "error",
  // Chats events
  MESSAGE = "message",
  // Matching events
  MATCH = "match",
  LIKE = "like",
  UNLIKE = "unlike", // If user are already matched
  VIEW = "view",
}

export interface NotificationPayload {
  type: NotificationType;
  ui_variant?: "default" | "success" | "info" | "warning" | "error";
  message: string;
  fromUserId: number;
  toUserId: number;
  isRead: boolean;
  createAt: Date;
}

export enum NotificationType {
  LIKE = SOCKET_EVENTS.LIKE,
  UNLIKE = SOCKET_EVENTS.UNLIKE,
  MATCH = SOCKET_EVENTS.MATCH,
  MESSAGE = SOCKET_EVENTS.MESSAGE,
  VIEW = SOCKET_EVENTS.VIEW,
}

export interface NotificationContent {
  message: string;
  // Possibly add more fields here
}

export interface NotificationInterface {
  id?: number;
  type: NotificationType;
  ui_variant?: "default" | "success" | "info" | "warning" | "error";
  content: NotificationContent;
  toUserID: number;
  fromUserID: number;
  isRead?: boolean;
  status?: NotificationStatus;
  readAt?: Date;
  createdAt?: Date;
}

export enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

/* ________________________________ Socket.io ________________________________ */

export const initializeSocket = (userId: number) => {
  const socket = io(SERVER_URL, {
    withCredentials: true,
  });

  socket.on(SOCKET_EVENTS.CONNECT, () => {
    console.log("Socket: Connected to server");

    const userRoom = `user_${userId}`;
    socket.emit(SOCKET_EVENTS.JOIN, userRoom);
  });

  socket.on(SOCKET_EVENTS.MESSAGE, (payload: NotificationPayload) => {
    console.log("Socket: Message received", payload);
  });

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log("Socket: Disconnected from server");
  });

  socket.on(
    SOCKET_EVENTS.NOTIFICATION,
    (payload: NotificationPayload, callback) => {
      console.log("Socket: Notification", payload);
      enqueueSnackbar(payload.message, {
        variant: payload.ui_variant || "default",
      });
      callback("Notification received");
    }
  );

  return socket;
};
