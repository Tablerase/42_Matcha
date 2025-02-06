import { QueryResult } from "pg";
import { io } from "@src/server";
import { SOCKET_EVENTS } from "@interfaces/socketEvents";
import { pool } from "../settings";
import {
  NotificationInterface,
  NotificationPayload,
  NotificationStatus,
  NotificationType,
} from "@src/interfaces/notificationInterface";
import { Server } from "socket.io";

class NotificationModel {
  async getNotifications(userId: number): Promise<any[]> {
    const query = {
      text: `SELECT * 
          FROM notification_recipients AS nr 
          JOIN notification_objects AS no ON nr.notification_object_id = no.id
          WHERE nr.notifier_id = $1`,
      values: [userId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  async createNotification(
    notification: NotificationInterface,
    userIds: number[]
  ): Promise<NotificationInterface[]> {
    const query = {
      text: `
        WITH notif_object AS (
          INSERT INTO notification_objects (type, content)
          VALUES ($1, $2)
          RETURNING id
        )
        INSERT INTO notification_recipients (to_user_id, from_user_id, notification_object_id, status)
        SELECT unnest($3::integer[]), $4, id, 'PENDING'
        FROM notif_object
        RETURNING notification_recipients.*
      `,
      values: [
        notification.type,
        JSON.stringify(notification.content),
        userIds,
        notification.fromUserID,
      ],
    };
    const result = await pool.query(query);
    const resultNotifications: NotificationInterface[] = result.rows.map(
      (row) => {
        return {
          id: row.id,
          type: notification.type as NotificationType,
          ui_variant: notification.ui_variant,
          content: notification.content,
          toUserID: row.to_user_id,
          fromUserID: row.from_user_id,
          status: row.status as NotificationStatus,
          isRead: row.is_read as boolean,
          readAt: row.read_at as Date,
          createdAt: row.created_at as Date,
        };
      }
    );
    return resultNotifications;
  }

  async markNotificationAsRead(notificationId: number[]): Promise<any[]> {
    const query = {
      text: `UPDATE notification_recipients
          SET status = 'SENT'::notification_status, is_read = true, read_at = NOW()
          WHERE id = ANY($1::integer[])
          RETURNING notification_recipients.*`,
      values: [notificationId],
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async updateNotification(notificationId: number[]): Promise<any[]> {
    const query = {
      text: `UPDATE notification_recipients
          SET status = 'SENT'::notification_status
          WHERE id = ANY($1::integer[])
          RETURNING notification_recipients.*`,
      values: [notificationId],
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async deleteNotification(notificationId: number): Promise<any[]> {
    // TODO check if the notification object is connected to multiple recipients
    // if so, delete only the notif recipient
    // if not, delete the notification object as well
    const query = {
      text: `DELETE FROM notification_recipients
          WHERE id = $1
          RETURNING *`,
      values: [notificationId],
    };
    const result = await pool.query(query);
    return result.rows;
  }
}

export const notificationModel = new NotificationModel();
