import { QueryResult } from "pg";
import { pool } from "../settings";

class ViewModel {
  private async getLastViewTime(
    userId: number,
    viewedUserId: number
  ): Promise<Date | null> {
    const query = {
      text: `SELECT last_viewed_at FROM views 
             WHERE viewer_user_id = $1 AND viewed_user_id = $2`,
      values: [userId, viewedUserId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows[0]?.last_viewed_at || null;
  }

  async getUserViews(userId: number): Promise<any[]> {
    const query = {
      text: `SELECT * FROM views WHERE viewed_user_id = $1 ORDER BY last_viewed_at DESC`,
      values: [userId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  async addUserView(userId: number, viewedUserId: number): Promise<boolean> {
    const lastViewTime = await this.getLastViewTime(userId, viewedUserId);

    if (lastViewTime) {
      const timeDiff = Date.now() - lastViewTime.getTime();
      if (timeDiff < 60000) {
        // 60000ms = 1 minute
        return false;
      }
    }

    const query = {
      text: `
        INSERT INTO views (viewer_user_id, viewed_user_id, view_count, last_viewed_at)
        VALUES ($1, $2, 1, NOW())
        ON CONFLICT (viewer_user_id, viewed_user_id)
        DO UPDATE SET 
          view_count = views.view_count + 1,
          last_viewed_at = NOW()
      `,
      values: [userId, viewedUserId],
    };

    await pool.query(query);
    return true;
  }
}

export const viewModel = new ViewModel();
