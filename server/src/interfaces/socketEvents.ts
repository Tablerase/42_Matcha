export const SOCKET_EVENTS = {
  // System events
  NOTIFICATION: "notification",
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  JOIN: "join",
  ERROR: "error",
  // Chats events
  MESSAGE: "message",
  MESSAGE_NEW: "newMessage",
  // Matching events
  MATCH_NEW: "newMatch",
  LIKE_NEW: "newLike",
  LIKE_DELETE: "newUnlike", // If user are already matched
  VIEW_PROFILE: "viewProfile",
};
export interface NotificationPayload {
  type: keyof typeof SOCKET_EVENTS;
  ui_variant?: "default" | "success" | "info" | "warning" | "error";
  message: string;
  fromUserId: number;
  toUserId: number;
  createAt: Date;
}
