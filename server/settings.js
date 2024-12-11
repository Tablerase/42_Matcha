const Pool = require('pg').Pool
const pool = new Pool({
  user: 'matcha',
  host: 'localhost',
  database: 'matcha',
  password: 'matcha',
  port: 5432,
})

console.log(`POOOOL: ${pool}`)

module.exports = { pool }