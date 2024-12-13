import { Pool, QueryConfig, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const serverPort = process.env.SERVER_PORT || 8000;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "default secret";
export const ACCESSTOKEN_EXPIRES_IN = process.env.ACCESSTOKEN_EXPIRES_IN || "15m";
export const REFRESHTOKEN_EXPIRES_IN = process.env.REFRESHTOKEN_EXPIRES_IN || "7d";

const db_config = {
  user: process.env.POSTGRES_USER as string,
  host: process.env.POSTGRES_HOST as string,
  database: process.env.POSTGRES_DB as string,
  password: process.env.POSTGRES_PASSWORD as string,
  port: parseInt(process.env.DB_PORT as string, 10),
};

const pool = new Pool(db_config);

export interface DbQuery {
  query: <T extends QueryResult = any>(
    text: string,
    params?: any[]
  ) => Promise<QueryResult<T>>;
}

export const db: DbQuery = {
  query: <T extends QueryResult = any>(
    text: string,
    params?: any[]
  ): Promise<QueryResult<T>> => pool.query(text, params),
};

export { pool };

// console.log(pool)
async function seed() {
  try {
    await pool.connect();

    /*USERS TABLE*/
    const checkTypeQuery = `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender') THEN
          CREATE TYPE gender AS ENUM ('male', 'female', 'other');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'preferences') THEN
          CREATE TYPE preferences AS ENUM ('heterosexual', 'homosexual', 'bisexual');
        END IF;
      END;
      $$;
    `;
    await pool.query(checkTypeQuery);

    // Create the `users` table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        gender gender DEFAULT 'other',
        preferences preferences DEFAULT 'bisexual',
        date_of_birth DATE,
        bio VARCHAR(500),
        location POINT,
        fame_rate INT DEFAULT 0,
        last_seen TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    //TODO: add complex data types to users:
    /**
     * pictures
     * interests
     * matches
     * views
     * likes
     * blocked
     */

    await pool.query(createTableQuery);

    /*INTERESTS TAGS TABLE*/
    const createInterestsTagTableQuery = `
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        tag VARCHAR(100) UNIQUE NOT NULL
      );
    `;
    await pool.query(createInterestsTagTableQuery);

    const checkTagsTableQuery = `
      SELECT count(*) FROM tags;
    `;
    const res = await pool.query(checkTagsTableQuery);
    const insertTagsQuery = `
      INSERT INTO tags (tag)
      VALUES
        ('art'),
        ('photography'),
        ('fashion'),
        ('technology'),
        ('science'),
        ('cooking'),
        ('food'),
        ('fitness'),
        ('gaming'),
        ('sports'),
        ('music'),
        ('movies'),
        ('books'),
        ('travel'),
        ('outdoors'),
        ('animals'),
        ('politics'),
        ('history'),
        ('wine'),
        ('beer'),
        ('coffee'),
        ('tea'),
        ('matcha'),
        ('yoga'),
        ('meditation'),
        ('spirituality'),
        ('astrology'),
        ('tarot')
      ON CONFLICT (tag) DO NOTHING;
    `;
    if (parseInt(res.rows[0].count) === 0) {
      await pool.query(insertTagsQuery);
    }

    const createChatQuery = `
     CREATE TABLE IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        user_1 INT REFERENCES users(id) ON DELETE CASCADE,
        user_2 INT REFERENCES users(id) ON DELETE CASCADE,
        deleted_by INT[]
      );
    `;
    await pool.query(createChatQuery);

    /*MESSAGES TABLE*/
    const createMsgQuery = `
        CREATE TABLE IF NOT EXISTS msgs (
        id SERIAL PRIMARY KEY,
        content VARCHAR(100) NOT NULL,
        chat_id INT REFERENCES chats(id) ON DELETE CASCADE,
        sender_id INT REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createMsgQuery);

    /*VIEWS TABLE*/
    const createViewsQuery = `
        CREATE TABLE IF NOT EXISTS views (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            chat_id INT REFERENCES chats(id) ON DELETE CASCADE,
            viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await pool.query(createViewsQuery);

    /*REPORTED USERS TABLE*/
    const createReportedUsersQuery = `
        CREATE TABLE IF NOT EXISTS reported_users (
            id SERIAL PRIMARY KEY,
            reporter_id INT REFERENCES users(id) ON DELETE CASCADE,
            reported_id INT REFERENCES users(id) ON DELETE CASCADE,
            reason VARCHAR(255) NOT NULL,
            reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await pool.query(createReportedUsersQuery);

    /* REFRESH TOKENS TABLE */
    const createRefreshTokensQuery = `
        CREATE TABLE IF NOT EXISTS refresh_tokens (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            token VARCHAR(512) NOT NULL,
            expires_at TIMESTAMP NOT NULL
        );
    `;
    await pool.query(createRefreshTokensQuery);
  } catch (err) {
    console.error("Error seeding the database:", err);
  } finally {
    // Close the database connection
    // await pool.release();
  }
}

// Run the seed function
seed();
