import { pool } from "./settings";

async function truncateAndInsertFixtures() {
  try {
    await pool.connect();

    // Cleaning Tables content
    await pool.query("TRUNCATE TABLE chats RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE msgs RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE views RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE reported_users RESTART IDENTITY CASCADE;");

    // Insert data into the `users` table
    const insertUsersQuery = `
      INSERT INTO users (first_name, last_name, username, email, password_hash, gender, preferences, date_of_birth, bio, location, fame_rate, last_seen)
      VALUES
        ('John', 'Doe', 'johndoe', 'john@example.com', 'hashedpassword', 'male', 'heterosexual', '1990-01-01', 'Bio of John', POINT(40.7128, -74.0060), 10, NOW()),
        ('Jane', 'Doe', 'janedoe', 'jane@example.com', 'hashedpassword', 'female', 'homosexual', '1992-02-02', 'Bio of Jane', POINT(34.0522, -118.2437), 20, NOW());
    `;
    await pool.query(insertUsersQuery);

    // Insert data into the `chats` table
    const insertChatsQuery = `
      INSERT INTO chats (user_1, user_2, deleted_by)
      VALUES
        (1, 2, '{}');
    `;
    await pool.query(insertChatsQuery);

    // Insert data into the `msgs` table
    const insertMsgsQuery = `
      INSERT INTO msgs (content, chat_id, sender_id)
      VALUES
        ('Hello, how are you?', 1, 1);
    `;
    await pool.query(insertMsgsQuery);

    // Insert data into the `views` table
    const insertViewsQuery = `
      INSERT INTO views (user_id, chat_id)
      VALUES
        (1, 1);
    `;
    await pool.query(insertViewsQuery);
    // Insert data into the `reported_users` table
    const insertReportedUsersQuery = `
      INSERT INTO reported_users (reporter_id, reported_id, reason)
      VALUES
        (1, 2, 'Inappropriate behavior');
    `;
    await pool.query(insertReportedUsersQuery);
  } catch (err) {
    console.error("Error seeding the database:", err);
  } finally {
    // await pool.release();
  }
}

truncateAndInsertFixtures();
