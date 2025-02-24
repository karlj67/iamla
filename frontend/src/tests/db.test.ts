const { pool } = require('../config/database');

test('Test TiDB connection', async () => {
  const [rows] = await pool.query('SELECT NOW() AS current_time');
  expect(rows[0]).toHaveProperty('current_time');
}); 
