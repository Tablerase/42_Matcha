import { pool } from "./settings";

async function truncateAndInsertFixtures(shouldClosePool = false) {
  try {
    console.log("Starting database fixtures...");

    // Cleaning Tables content
    console.log("Cleaning existing data...");
    await pool.query("TRUNCATE TABLE chats RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE msgs RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE views RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE reported_users RESTART IDENTITY CASCADE;");

    // Insert data into the `users` table
    console.log("Inserting users...");
    const insertUsersQuery = `
      INSERT INTO users (first_name, last_name, username, email, password, gender, preferences, date_of_birth, bio, location, fame_rate, last_seen)
      VALUES
        ('John', 'Doe', 'johndoe', 'john@example.com', 'hashedpassword', 'male', 'heterosexual', '1990-01-01', 'Bio of John', POINT(48.862842, 2.342815), 10, NOW()),
        ('Jane', 'Doe', 'janedoe', 'jane@example.com', 'hashedpassword', 'female', 'homosexual', '1992-02-02', 'Bio of Jane', POINT(48.853119, 2.349494), 20, NOW()),
        ('Alice', 'Smith', 'alicesmith', 'alice@example.com', 'hashedpassword', 'female', 'bisexual', '1995-05-05', 'Bio of Alice', POINT(37.7749, -122.4194), 30, NOW()),
        ('Bob', 'Smith', 'bobsmith', 'bobsmith@example.com', 'hashedpassword', 'other', 'bisexual', '1998-08-08', 'Bio of Bob', POINT(41.8781, -87.6298), 40, NOW()),
        ('Charlie', 'Brown', 'charliebrown', 'charliebrown@example.com', 'hashedpassword', 'male', 'heterosexual', '2000-10-10', 'Bio of Charlie', POINT(29.7604, -95.3698), 50, NOW())
    `;
    await pool.query(insertUsersQuery);

    // Insert data into the `chats` table
    console.log("Inserting chats...");
    const insertChatsQuery = `
      INSERT INTO chats (user_1, user_2, deleted_by)
      VALUES
        (1, 2, '{}');
    `;
    await pool.query(insertChatsQuery);

    // Insert data into the `msgs` table
    console.log("Inserting messages...");
    const insertMsgsQuery = `
      INSERT INTO msgs (content, chat_id, sender_id)
      VALUES
        ('Hello, how are you?', 1, 1);
    `;
    await pool.query(insertMsgsQuery);

    // Insert data into the `views` table
    console.log("Inserting views...");
    const insertViewsQuery = `
      INSERT INTO views (viewer_user_id, viewed_user_id)
      VALUES
        (1, 2),
        (2, 1);
    `;
    await pool.query(insertViewsQuery);

    console.log("Fixtures completed successfully!");
  } catch (error) {
    console.error("Error inserting fixtures:", error);
    throw error;
  } finally {
    if (shouldClosePool) {
      await pool.end();
    }
  }
}

// Execute if running directly
if (require.main === module) {
  truncateAndInsertFixtures(true)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { truncateAndInsertFixtures };
