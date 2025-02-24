import db from '../config/database.js';

class Team {
  static async findAll() {
    const [rows] = await db.query(
      'SELECT t.*, u.first_name as supervisor_first_name, u.last_name as supervisor_last_name, COUNT(m.id) as member_count ' +
      'FROM teams t ' +
      'LEFT JOIN users u ON t.supervisor_id = u.id ' +
      'LEFT JOIN users m ON m.team_id = t.id ' +
      'GROUP BY t.id'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT t.*, u.first_name as supervisor_first_name, u.last_name as supervisor_last_name ' +
      'FROM teams t ' +
      'LEFT JOIN users u ON t.supervisor_id = u.id ' +
      'WHERE t.id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(teamData) {
    const { name, laboratory_name, supervisor_id } = teamData;
    const [result] = await db.query(
      'INSERT INTO teams (name, laboratory_name, supervisor_id) VALUES (?, ?, ?)',
      [name, laboratory_name, supervisor_id]
    );
    return result.insertId;
  }

  static async update(id, teamData) {
    const { name, laboratory_name, supervisor_id } = teamData;
    const [result] = await db.query(
      'UPDATE teams SET name = ?, laboratory_name = ?, supervisor_id = ? WHERE id = ?',
      [name, laboratory_name, supervisor_id, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM teams WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getMembers(teamId) {
    const [rows] = await db.query(
      'SELECT u.*, COUNT(v.id) as visits_today ' +
      'FROM users u ' +
      'LEFT JOIN visits v ON v.visitor_id = u.id AND DATE(v.planned_date) = CURDATE() ' +
      'WHERE u.team_id = ? ' +
      'GROUP BY u.id',
      [teamId]
    );
    return rows;
  }
}

export default Team;
