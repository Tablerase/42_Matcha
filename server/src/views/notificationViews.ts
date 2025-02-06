import { NotificationInterface } from "@interfaces/notificationInterface";
import { notificationModel } from "@src/models/notificationModel";
import { io } from "@src/server";
import { NotificationPayload } from "@interfaces/notificationInterface";
import { SOCKET_EVENTS } from "@src/interfaces/socketEvents";

export const addNotification = async (
  notification: NotificationInterface,
  userIds: number[]
): Promise<void> => {
  // Save notification to database
  const notifs = await notificationModel.createNotification(
    notification,
    userIds
  );

  // Emit notification to users if any exist
  if (notifs.length > 0) {
    const notificationPayload: NotificationPayload = {
      type: notification.type,
      ui_variant: notification.ui_variant,
      message: notification.content.message,
      toUserId: 0,
      fromUserId: notification.fromUserID,
      isRead: false,
      createAt: new Date(),
    };

    for (const notif of notifs) {
      // Update payload with recipient specific data
      notificationPayload.toUserId = notif.toUserID;
      notificationPayload.isRead = notif.isRead ?? false;
      notificationPayload.createAt = notif.createdAt ?? new Date();

      try {
        const userRoom = `user_${notif.toUserID}`;
        if (!io.sockets.adapter.rooms.has(userRoom)) {
          // User is offline
          continue;
        }
        const response = await io
          .to(userRoom)
          .timeout(1000)
          .emitWithAck(SOCKET_EVENTS.NOTIFICATION, notificationPayload);
        // Update notification status to sent
        if (response && notif.id) {
          const response = await notificationModel.updateNotification([
            notif.id,
          ]);
        }
      } catch (error) {
        console.log(
          `[Socket] Error emitting notification to user_${notif.toUserID}:`,
          error
        );
      }
    }
  }
  return;
};
