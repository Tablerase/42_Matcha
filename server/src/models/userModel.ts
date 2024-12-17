import { QueryResult } from "pg";
import { pool } from "../settings";
import { User } from "@interfaces/userInterface";
import { generateHash } from "@utils/bcrypt";

class UserModel {
  async getUsers(): Promise<User[]> {
    try {
      const query = {
        text: "SELECT * FROM users",
      };
      const results: QueryResult<User> = await pool.query(query);
      return results.rows;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const query = {
        text: "SELECT * FROM users WHERE id = $1",
        values: [id],
      };
      const results: QueryResult<User> = await pool.query(query);
      return results.rows[0] || null;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getUserByEmail(email: string | undefined): Promise<User | null> {
    try {
      const query = {
        text: "SELECT * FROM users WHERE email = $1",
        values: [email],
      };
      const result: QueryResult<User> = await pool.query(query);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getUserByUsername(username: string | undefined): Promise<User | null> {
    try {
      const query = {
        text: "SELECT * FROM users WHERE username = $1",
        values: [username],
      };
      const result: QueryResult<User> = await pool.query(query);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const password = await generateHash(userData.password);
      const query = {
        text: `
			  INSERT INTO users (first_name, last_name, username, email, password)
			  VALUES ($1, $2, $3, $4, $5)
			  RETURNING *
			`,
        values: [
          userData.firstName,
          userData.lastName,
          userData.username,
          userData.email,
          password,
        ],
      };
      const result: QueryResult<User> = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error((error as Error).message);
    }
  }

  /**
   * TAGS
   */

  async getUserTags(userId: number): Promise<any[]> {
    const query = {
      text: `SELECT t.* FROM tags t JOIN user_tags ut ON t.id = ut.tag_id WHERE ut.user_id = $1`,
      values: [userId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  async addUserTag(userId: number, tagId: number): Promise<any> {
    const query = {
      text: `INSERT INTO user_tags (user_id, tag_id)
         SELECT $1, $2
         WHERE NOT EXISTS (
           SELECT 1 FROM user_tags WHERE user_id = $1 AND tag_id = $2
         )`,
      values: [userId, tagId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  async deleteUserTag(userId: number, tagId: number): Promise<any> {
    const query = {
      text: `DELETE FROM user_tags WHERE user_id = $1 AND tag_id = $2`,
      values: [userId, tagId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  /**
   * LIKES
   */

  async getUserLikes(userId: number): Promise<any[]> {
    const query = {
      text: `SELECT * FROM likes WHERE liked_user_id = $1`,
      values: [userId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  async addUserLike(likerUserId: number, likedUserId: number): Promise<any> {
    const query = {
      text: `INSERT INTO likes (liker_user_id, liked_user_id) VALUES ($1, $2)`,
      values: [likerUserId, likedUserId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  async deleteUserLike(likerUserId: number, likedUserId: number): Promise<any> {
    const query = {
      text: `DELETE FROM likes WHERE liker_user_id = $1 AND liked_user_id = $2`,
      values: [likerUserId, likedUserId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  /**
   * MATCHES
   */

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
      text: `INSERT INTO matches (user_id, matched_user_id) VALUES ($1, $2)`,
      values: [userId, matchedUserId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }
  async removeUserMatch(userId: number, matchedUserId: number): Promise<any> {
    const query = {
      text: `DELETE FROM matches WHERE user_id = $1 AND matched_user_id = $2`,
      values: [userId, matchedUserId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  /**
   * VIEWS
   */
  async getUserViews(userId: number): Promise<any[]> {
    const query = {
      text: `SELECT * FROM views WHERE viewer_id = $1`,
      values: [userId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }
  async addUserView(
    viewer_user_id: number,
    viewedUserId: number
  ): Promise<any> {
    const query = {
      text: `INSERT INTO views (viewer_user_id, viewed_user_id) VALUES ($1, $2)`,
      values: [viewer_user_id, viewedUserId],
    };
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }
}

export const user = new UserModel();
