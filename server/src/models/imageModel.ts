import { QueryResult } from "pg";
import { pool } from "../settings";
import { Image } from "@interfaces/imageInterface";

class ImageModel {
    async createImage(params: Partial<Image>): Promise<Image> {
        const query = {
            text: "INSERT INTO images (user_id, image_url) VALUES ($1, $2) RETURNING *",
            values: [params.userId, params.url],
        };

        try {
            const result: QueryResult<Image> = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getImagesByUserId(userId: number): Promise<Image[]> {
        const query = {
            text: "SELECT * FROM images WHERE user_id = $1",
            values: [userId],
        };

        try {
            const result: QueryResult<Image> = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}

export const image = new ImageModel();