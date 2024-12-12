import { Request, Response } from "express";
import { QueryResult } from "pg";
import { pool } from "../../settings";
import { User } from "@interfaces/userInterface";

// TODO: add filtering based on query params and pagination
const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const results: QueryResult<User> = await pool.query("SELECT * FROM users");
    res.json(results.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id);
  try {
    const results: QueryResult<User> = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    if (results.rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export { getUsers, getUserById };