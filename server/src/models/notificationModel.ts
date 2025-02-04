import { QueryResult } from "pg";
import { pool } from "../settings";
import { Notification } from "@src/interfaces/notificationInterface";

class NotificationModel {
  async getNotifications(userId: number): Promise<any[]> {
    const query = {
      text: `SELECT * 
          FROM notification_notifiers AS nn 
          JOIN notification_objects AS no ON nn.notification_object_id = no.id
          WHERE nn.notifier_id = $1`,
      values: [userId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  async createNotification(
    notification: Notification,
    userIds: number[]
  ): Promise<any[]> {
    // TODO: Implement the multiple notifiers creation connected to the same notification object
    const query = {
      text: `
        WITH notif_object AS (
          INSERT INTO notification_objects (type, content)
          VALUES ($1, $2)
          RETURNING id
        )
        INSERT INTO notification_notifiers (to_user_id, from_user_id, notification_object_id, status)
        SELECT $3, $4, id, 'PENDING'
        FROM notif_object
        RETURNING notification_object_id
      `,
      values: [
        notification.type,
        JSON.stringify(notification.content),
        notification.toUserID,
        notification.fromUserID,
      ],
    };
    const result = await pool.query(query);
    return result.rows;
  }
}

export const notificationModel = new NotificationModel();
