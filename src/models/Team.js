const db = require('../config/database');

class Team {
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM teams WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(teamData) {
    const { name, laboratory_name, supervisor_id } = teamData;
    const [result] = await db.query(
      `INSERT INTO teams (name, laboratory_name, supervisor_id)
       VALUES (?, ?, ?)`,
      [name, laboratory_name, supervisor_id]
    );
    return result.insertId;
  }

  static async getMembers(teamId) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE team_id = ?',
      [teamId]
    );
    return rows;
  }

  static async update(id, teamData) {
    const { name, laboratory_name, supervisor_id } = teamData;
    const [result] = await db.query(
      `UPDATE teams 
       SET name = ?, laboratory_name = ?, supervisor_id = ?
       WHERE id = ?`,
      [name, laboratory_name, supervisor_id, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Team; 