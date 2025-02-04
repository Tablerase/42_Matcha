import { SOCKET_EVENTS } from "@interfaces/socketEvents";

export interface NotificationPayload {
  type: NotificationType;
  ui_variant?: "default" | "success" | "info" | "warning" | "error";
  message: string;
  fromUserId: number;
  toUserId: number;
  createAt: Date;
}

export enum NotificationType {
  LIKE = "like",
  UNLIKE = "unlike",
  MATCH = "match",
  MESSAGE = "message",
  VIEW = "view",
}

export interface Notification {
  id: number;
  type: keyof typeof NotificationType;
  content: JSON;
  toUserID: number;
  fromUserID: number;
  isRead: boolean;
  status: NotificationStatus;
  readAt?: Date;
  createdAt: Date;
}

export enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}
