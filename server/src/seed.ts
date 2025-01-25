import { pool } from "./settings";

async function truncateAndInsertFixtures(shouldClosePool = false) {
  try {
    console.log("Starting database fixtures...");

    // Cleaning Tables content
    console.log("Cleaning existing data...");
    await pool.query("TRUNCATE TABLE chats RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE msgs RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE images RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE likes RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE blocked RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE matches RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE user_tags RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE views RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE reported_users RESTART IDENTITY CASCADE;");

    // Insert data into the `users` table
    console.log("Inserting users...");
    const insertUsersQuery = `
      INSERT INTO users (first_name, last_name, username, email, password, gender, preferences, date_of_birth, bio, location, fame_rate, last_seen)
      VALUES
        ('John', 'Doe', 'johndoe', 'john@example.com', 'hashedpassword', 'male', '{"female"}', '1990-01-01', 'Bio of John', POINT(48.862842, 2.342815), 10, NOW()),
        ('Jane', 'Doe', 'janedoe', 'jane@example.com', 'hashedpassword', 'female', '{"female"}', '1992-02-02', 'Bio of Jane', POINT(48.853119, 2.349494), 20, NOW()),
        ('Alice', 'Smith', 'alicesmith', 'alice@example.com', 'hashedpassword', 'female', '{"male", "female", "other"}', '1995-05-05', 'Bio of Alice', POINT(37.7749, -122.4194), 30, NOW()),
        ('Bob', 'Smith', 'bobsmith', 'bobsmith@example.com', 'hashedpassword', 'other', '{"male", "female"}', '1998-08-08', 'Bio of Bob', POINT(41.8781, -87.6298), 40, NOW()),
        ('Charlie', 'Brown', 'charliebrown', 'charliebrown@example.com', 'hashedpassword', 'male', '{"male"}', '2000-10-10', 'Bio of Charlie', POINT(29.7604, -95.3698), 50, NOW()),
        ('David', 'White', 'davidwhite', 'davidwhite@example.com', 'hashedpassword', 'male', '{"other"}', '2002-12-12', 'Bio of David', POINT(34.0522, -118.2437), 60, NOW()),
        ('Eve', 'Black', 'eveblack', 'eveblack@example.com', 'hashedpassword', 'female', '{"male"}', '1991-03-03', 'Bio of Eve', POINT(40.7128, -74.0060), 70, NOW()),
        ('Frank', 'Green', 'frankgreen', 'frankgreen@example.com', 'hashedpassword', 'male', '{"female"}', '1989-04-04', 'Bio of Frank', POINT(34.0522, -118.2437), 80, NOW()),
        ('Grace', 'Blue', 'graceblue', 'graceblue@example.com', 'hashedpassword', 'female', '{"male", "female"}', '1993-06-06', 'Bio of Grace', POINT(51.5074, -0.1278), 90, NOW()),
        ('Hank', 'Yellow', 'hankyellow', 'hankyellow@example.com', 'hashedpassword', 'male', '{"female", "other"}', '1994-07-07', 'Bio of Hank', POINT(35.6895, 139.6917), 100, NOW()),
        ('Ivy', 'Red', 'ivyred', 'ivyred@example.com', 'hashedpassword', 'female', '{"male"}', '1996-09-09', 'Bio of Ivy', POINT(48.8566, 2.3522), 110, NOW()),
        ('Jack', 'White', 'jackwhite', 'jackwhite@example.com', 'hashedpassword', 'male', '{"female"}', '1988-11-11', 'Bio of Jack', POINT(40.7306, -73.9352), 120, NOW()),
        ('Karen', 'Black', 'karenblack', 'karenblack@example.com', 'hashedpassword', 'female', '{"male", "other", "female"}', '1997-12-12', 'Bio of Karen', POINT(34.0522, -118.2437), 130, NOW()),
        ('Leo', 'Green', 'leogreen', 'leogreen@example.com', 'hashedpassword', 'male', '{"female"}', '1999-01-01', 'Bio of Leo', POINT(51.5074, -0.1278), 140, NOW()),
        ('Mia', 'Blue', 'miablue', 'miablue@example.com', 'hashedpassword', 'female', '{"male"}', '1993-02-02', 'Bio of Mia', POINT(35.6895, 139.6917), 150, NOW())
        ;
    `;
    await pool.query(insertUsersQuery);

    // Insert data into the `images` table
    console.log("Inserting images...");
    const insertImagesQuery = `
      INSERT INTO images (user_id, image_url, is_profile)
      VALUES
      (1, 'https://randomuser.me/api/portraits/men/1.jpg', TRUE),
      (2, 'https://randomuser.me/api/portraits/women/1.jpg', TRUE),
      (3, 'https://randomuser.me/api/portraits/women/2.jpg', TRUE),
      (4, 'https://randomuser.me/api/portraits/men/2.jpg', TRUE),
      (5, 'https://randomuser.me/api/portraits/men/3.jpg', TRUE);
    `;
    await pool.query(insertImagesQuery);

    // Insert data into the `user_tags` table
    console.log("Inserting user tags...");
    const insertUsersTagsQuery = `
      INSERT INTO user_tags (user_id, tag_id)
      VALUES
        (1, 30),
        (1, 7),
        (1, 8),
        (2, 2),
        (2, 5),
        (3, 3),
        (4, 4),
        (5, 5);
    `;
    await pool.query(insertUsersTagsQuery);

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
