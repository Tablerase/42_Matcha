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
