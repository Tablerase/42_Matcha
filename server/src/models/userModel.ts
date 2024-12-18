import { QueryResult } from "pg";
import { pool } from "../settings";
import { User, SortParams } from "@interfaces/userInterface";
import { generateHash } from "@utils/bcrypt";

class UserModel {
  // async getUsers(params: SortParams | undefined): Promise<User[]> {
  //   let query = {
  //     text: "SELECT * FROM users",
  //   };
  //   if (params) {
  //     query.text = "";
  //   }
  //   try {
  //     const results: QueryResult<User> = await pool.query(query);
  //     return results.rows;
  //   } catch (error) {
  //     throw new Error((error as Error).message);
  //   }
  // }

  async getUsers(params: SortParams | undefined): Promise<User[]> {
    let query = {
      text: "SELECT * FROM users",
      values: [] as any[],
    };
  
    const conditions: string[] = [];
  
    if (params) {
      let counter = 1; // Parameter placeholder counter
  
      if (params.age) {
        // console.log(params.age.max);
        conditions.push(`age BETWEEN $${counter} AND $${counter + 1}`);
        query.values.push(params.age.min, params.age.max);
        counter += 2;
      }
  
      // if (params.location) {
      //   conditions.push(`location_x = $${counter} AND location_y = $${counter + 1}`);
      //   query.values.push(params.location.x, params.location.y);
      //   counter += 2;
      // }
  
      if (params.fameRate !== undefined) {
        conditions.push(`fame_rate >= $${counter}`);
        query.values.push(params.fameRate);
        counter += 1;
      }
  
      if (params.tags && params.tags.length > 0) {
        const tagPlaceholders = params.tags.map((_, i) => `$${counter + i}`).join(", ");
        conditions.push(`tags && ARRAY[${tagPlaceholders}]::text[]`);
        query.values.push(...params.tags);
        counter += params.tags.length;
      }
  
      if (conditions.length > 0) {
        query.text += ` WHERE ${conditions.join(" AND ")}`;
      }
    }
  
    try {
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
      throw new Error((error as Error).message);
    }
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let parameterIndex = 1;

      for (const [key, value] of Object.entries(userData)) {
        if (value !== null && value !== undefined) {
          const snakeKey = key.replace(
            /[A-Z]/g,
            (letter) => `_${letter.toLowerCase()}`
          );
          if (
            snakeKey === "password" ||
            snakeKey === "id" ||
            snakeKey === "created_at"
          ) {
            continue;
          }
          updates.push(`${snakeKey} = $${parameterIndex}`);
          values.push(value);
          parameterIndex++;
        }
      }

      if (updates.length === 0) {
        throw new Error("No valid fields to update");
      }

      values.push(id);

      const query = {
        text: `
          UPDATE users
          SET ${updates.join(", ")}, updated_at = NOW()
          WHERE id = $${parameterIndex}
          RETURNING *
        `,
        values,
      };

      const result: QueryResult<User> = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    }
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
