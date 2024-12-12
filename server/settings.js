const dotenv = require("dotenv");
dotenv.config();
const serverPort = process.env.PORT || 8000;

const Pool = require("pg").Pool;

// console.log(process.env.POSTGRES_USER, process.env.POSTGRES_HOST, process.env.POSTGRES_DB, process.env.POSTGRES_PASSWORD, process.env.DB_PORT)
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DB_PORT,
});

// console.log(pool)
async function seed() {
  try {
    await pool.connect();

    await pool.query("DROP TABLE IF EXISTS tags;");
    await pool.query("DROP TABLE IF EXISTS chats;");
    await pool.query("DROP TABLE IF EXISTS msgs;");
    await pool.query("DROP TABLE IF EXISTS users;");

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
      END
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
        password_hash VARCHAR(255) NOT NULL,
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

    const insertDataQuery = `
      INSERT INTO users (first_name, last_name, username, email, password_hash)
      VALUES
        ('John', 'Doe', 'username', 'john.doe@example.com', 'hashed_password_1'),
        ('Jane', 'Smith', 'username1', 'jane.smith@example.com', 'hashed_password_2'),
        ('Emily', 'Johnson', 'username2', 'emily.johnson@example.com', 'hashed_password_3'),
        ('Michael', 'Williams', 'username3', 'michael.williams@example.com', 'hashed_password_4'),
        ('Sarah', 'Brown', 'username4', 'sarah.brown@example.com', 'hashed_password_5')
    `;
    await pool.query(insertDataQuery);

    /*INTERESTS TAGS TABLE*/
    const createInterestsTagTableQuery = `
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        tag VARCHAR(100) UNIQUE NOT NULL
      );
    `;
    await pool.query(createInterestsTagTableQuery);

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
        ;
    `;
    await pool.query(insertTagsQuery);

    
    /*CHAT TABLE*/
    const createChatQuery = `
     CREATE TABLE IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        user_1 INT REFERENCES users(id),
        user_2 INT REFERENCES users(id),
        deleted_by INT[]
      );
    `
    await pool.query(createChatQuery);
   
    /*MESSAGES TABLE*/
    const createMsgQuery = `
        CREATE TABLE IF NOT EXISTS msgs (
        id SERIAL PRIMARY KEY,
        content VARCHAR(100) NOT NULL,
        chat_id INT REFERENCES chats(id),
        sender_id INT REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createMsgQuery);

    /*VIEWS TABLE*/
    const createViewsQuery = `
        CREATE TABLE IF NOT EXISTS views (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            chat_id INT REFERENCES chats(id),
            viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await pool.query(createViewsQuery);

    /*VIEWS HISTORY TABLE*/
    
    /*REPORTED USERS TABLE*/
    
  } catch (err) {
    console.error("Error seeding the database:", err);
  } 
  // TODO: Close the database connection (like await pool.end()) somewhere ?!
}

// Run the seed function
seed();



module.exports = {
  query: (text, params) => pool.query(text, params),
  serverPort,
};
