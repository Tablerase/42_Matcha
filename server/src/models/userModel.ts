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

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let parameterIndex = 1;
  
      for (const [key, value] of Object.entries(userData)) {
        if (value !== null && value !== undefined) {
          const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
          if (snakeKey === 'password') {
            continue;
          }
          updates.push(`${snakeKey} = $${parameterIndex}`);
          values.push(value);
          parameterIndex++;
        }
      }
  
      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }
  
      values.push(id);
  
      const query = {
        text: `
          UPDATE users
          SET ${updates.join(', ')}, updated_at = NOW()
          WHERE id = $${parameterIndex}
          RETURNING *
        `,
        values
      };
  
      const result: QueryResult<User> = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export const user = new UserModel();
