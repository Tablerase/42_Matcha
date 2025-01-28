import { QueryResult } from "pg";
import { pool } from "../settings";

class ViewModel {
  async getUserViews(userId: number): Promise<any[]> {
    const query = {
      text: `SELECT * FROM views WHERE viewed_user_id = $1 ORDER BY last_viewed_at DESC`,
      values: [userId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }
}

export const viewModel = new ViewModel();
