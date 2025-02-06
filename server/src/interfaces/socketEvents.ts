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
