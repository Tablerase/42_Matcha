import { QueryResult } from "pg";
import { pool } from "../settings";
import { NotificationInterface } from "@src/interfaces/notificationInterface";

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
  ): Promise<any[]> {
    // TODO: Implement the multiple recipients creation connected to the same notification object
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
        RETURNING notification_object_id
      `,
      values: [
        notification.type,
        JSON.stringify(notification.content),
        userIds,
        notification.fromUserID,
      ],
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async markNotificationAsRead(notificationId: number): Promise<any[]> {
    const query = {
      text: `UPDATE notification_recipients
          SET status = 'READ'
          WHERE notification_object_id = $1
          RETURNING *`,
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
          WHERE notification_object_id = $1
          RETURNING *`,
      values: [notificationId],
    };
    const result = await pool.query(query);
    return result.rows;
  }
}

export const notificationModel = new NotificationModel();
