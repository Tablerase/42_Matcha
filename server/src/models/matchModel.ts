import { QueryResult } from "pg";
import { pool } from "../settings";

class MatchModel {
  async getUserMatches(userId: number): Promise<any[]> {
    const query = {
      text: `SELECT * FROM matches WHERE user_id = $1 ORDER BY created_at DESC`,
      values: [userId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  async addUserMatch(userId: number, matchedUserId: number): Promise<any> {
    const query = {
      text: `INSERT INTO matches (user_id, matched_user_id)
            SELECT $1, $2
            WHERE NOT EXISTS (
              SELECT 1 FROM matches WHERE user_id = $1 AND matched_user_id = $2
            )`,
      values: [userId, matchedUserId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  async checkForMatch(likerUserId: number, likedUserId: number): Promise<void> {
    // Check if the liked user has also liked the liker user
    const query = {
      text: `SELECT * FROM likes WHERE liker_user_id = $1 AND liked_user_id = $2`,
      values: [likedUserId, likerUserId],
    };
    const result: QueryResult = await pool.query(query);
    // If the liked user has also liked the liker user, create a match
    if (result.rows.length > 0) {
      await this.addUserMatch(likerUserId, likedUserId);
      await this.addUserMatch(likedUserId, likerUserId);
    }
  }

  async removeUserMatch(userId: number, matchedUserId: number): Promise<any> {
    const query = {
      text: `DELETE FROM matches WHERE user_id = $1 AND matched_user_id = $2`,
      values: [userId, matchedUserId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }
}

export const matchModel = new MatchModel();
