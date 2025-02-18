import { NotificationInterface } from "@interfaces/notificationInterface";
import { notificationModel } from "@src/models/notificationModel";
import { io } from "@src/server";
import { NotificationPayload } from "@interfaces/notificationInterface";
import { SOCKET_EVENTS } from "@src/interfaces/socketEventsInterface";

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
    const notificationPayload: NotificationInterface = {
      id: 0,
      type: notification.type,
      ui_variant: notification.ui_variant,
      content: notification.content,
      toUserID: 0,
      fromUserID: notification.fromUserID,
      isRead: false,
      createdAt: new Date(),
    };

    for (const notif of notifs) {
      // Update payload with recipient specific data
      notificationPayload.id = notif.id;
      notificationPayload.toUserID = notif.toUserID;
      notificationPayload.isRead = notif.isRead;
      notificationPayload.createdAt = notif.createdAt;

      try {
        const userRoom = `user_${notif.toUserID}`;
        if (!io.sockets.adapter.rooms.has(userRoom)) {
          // User is offline
          console.log(
            `[Socket] User_${notif.toUserID} is offline, skipping notification`
          );
          return;
        }
        const response = await io
          .to(userRoom)
          .timeout(5000)
          .emitWithAck(SOCKET_EVENTS.NOTIFICATION_NEW, notificationPayload);
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
