const db = require('../config/database');

class User {
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(userData) {
    const { email, password, first_name, last_name, role, team_id } = userData;
    const [result] = await db.query(
      `INSERT INTO users (email, password, first_name, last_name, role, team_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, password, first_name, last_name, role, team_id]
    );
    return result.insertId;
  }

  static async update(id, userData) {
    const { first_name, last_name, team_id, profile_photo } = userData;
    const [result] = await db.query(
      `UPDATE users 
       SET first_name = ?, last_name = ?, team_id = ?, profile_photo = ?
       WHERE id = ?`,
      [first_name, last_name, team_id, profile_photo, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = User; 