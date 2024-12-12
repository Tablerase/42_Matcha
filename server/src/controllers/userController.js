const pool = require("../../settings.js");

// TODO: add filtering based on query params and pagination
const getUsers = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM users");
    res.json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const results = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    response.status(200).json(results.rows);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
};
