import { QueryResult } from "pg";
import { pool } from "../settings";
import { User, SortParams } from "@interfaces/userInterface";
import { generateHash } from "@utils/bcrypt";
import { UserSearchQuery } from "@interfaces/userSearchQuery";

class UserModel {
  async getUsers(params: SortParams | undefined): Promise<User[]> {
    let query = {
      text: "SELECT * FROM users",
    };

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

  async searchUsers(params: UserSearchQuery): Promise<any[]> {
    try {
      const conditions: string[] = [];
      const values: any[] = [];
      let parameterIndex = 1;

      // Base query with age calculation
      let query = `
        SELECT DISTINCT u.*,
        EXTRACT(YEAR FROM AGE(NOW(), u.birth_date)) as age,
      `;

      // Add distance calculation if coordinates provided
      if (params.latitude && params.longitude) {
        query += `
          point(u.longitude, u.latitude) <@> point($${parameterIndex}, $${
          parameterIndex + 1
        }) as distance,
        `;
        values.push(params.longitude, params.latitude);
        parameterIndex += 2;
      }

      query += ` FROM users u`;

      // Join with tags if tag filtering is needed
      if (params.tags && params.tags.length > 0) {
        query += `
          INNER JOIN user_tags ut ON u.id = ut.user_id
          INNER JOIN tags t ON ut.tag_id = t.id
        `;
        conditions.push(`t.name = ANY($${parameterIndex})`);
        values.push(params.tags);
        parameterIndex++;
      }

      // Add age range conditions
      if (params.minAge) {
        conditions.push(
          `EXTRACT(YEAR FROM AGE(NOW(), u.birth_date)) >= $${parameterIndex}`
        );
        values.push(params.minAge);
        parameterIndex++;
      }
      if (params.maxAge) {
        conditions.push(
          `EXTRACT(YEAR FROM AGE(NOW(), u.birth_date)) <= $${parameterIndex}`
        );
        values.push(params.maxAge);
        parameterIndex++;
      }

      // Add fame rating range conditions
      if (params.minFameRating) {
        conditions.push(`u.fame_rating >= $${parameterIndex}`);
        values.push(params.minFameRating);
        parameterIndex++;
      }
      if (params.maxFameRating) {
        conditions.push(`u.fame_rating <= $${parameterIndex}`);
        values.push(params.maxFameRating);
        parameterIndex++;
      }

      // Add distance condition if specified
      if (params.distance && params.latitude && params.longitude) {
        conditions.push(
          `point(u.longitude, u.latitude) <@> point($1, $2) <= $${parameterIndex}`
        );
        values.push(params.distance);
        parameterIndex++;
      }

      // Combine conditions
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }

      // Add sorting
      if (params.sortBy) {
        const order = params.order || "asc";
        switch (params.sortBy) {
          case "distance":
            if (params.latitude && params.longitude) {
              query += ` ORDER BY distance ${order}`;
            }
            break;
          case "age":
            query += ` ORDER BY age ${order}`;
            break;
          case "fameRating":
            query += ` ORDER BY fame_rating ${order}`;
            break;
        }
      }

      // Add pagination
      if (params.limit) {
        query += ` LIMIT $${parameterIndex}`;
        values.push(params.limit);
        parameterIndex++;
      }
      if (params.offset) {
        query += ` OFFSET $${parameterIndex}`;
        values.push(params.offset);
      }

      const result: QueryResult = await pool.query({
        text: query,
        values: values,
      });

      return result.rows;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export const user = new UserModel();
