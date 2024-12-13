import { Request, Response } from "express";
import { QueryResult } from "pg";
import { pool } from "../settings";
import { User } from "@interfaces/userInterface";

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
      }
      const results: QueryResult<User> = await pool.query(query);
      return results.rows[0] || null;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
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
          userData.password,
        ],
      };
      const result: QueryResult<User> = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
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

  async getUserByUsername(username: string): Promise<User | null> {
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
}

export const user = new UserModel();
