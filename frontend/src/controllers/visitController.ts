const db = require('../config/database');

const visitController = {
  // Créer une nouvelle visite
  async createVisit(req, res) {
    try {
      const { prescriber_id, planned_date, notes } = req.body;
      const visitor_id = req.user.id;

      const [result] = await db.query(
        `INSERT INTO visits (visitor_id, prescriber_id, planned_date, notes)
         VALUES (?, ?, ?, ?)`,
        [visitor_id, prescriber_id, planned_date, notes]
      );

      res.status(201).json({
        message: 'Visite planifiée avec succès',
        visitId: result.insertId
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Obtenir les visites à venir pour un visiteur
  async getUpcomingVisits(req, res) {
    try {
      const [visits] = await db.query(`
        SELECT v.*, 
               p.first_name as prescriber_first_name,
               p.last_name as prescriber_last_name,
               p.address as prescriber_address,
               p.latitude as prescriber_latitude,
               p.longitude as prescriber_longitude,
               pt.name as prescriber_type
        FROM visits v
        JOIN prescribers p ON v.prescriber_id = p.id
        JOIN prescriber_types pt ON p.type_id = pt.id
        WHERE v.visitor_id = ? 
        AND v.planned_date >= CURDATE()
        ORDER BY v.planned_date ASC
      `, [req.user.id]);

      res.json(visits);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Mettre à jour le statut d'une visite
  async executeVisit(req, res) {
    try {
      const { visitId } = req.params;
      const { notes, outcome, latitude, longitude } = req.body;

      // Vérifier que la visite appartient au visiteur
      const [visit] = await db.query(
        'SELECT * FROM visits WHERE id = ? AND visitor_id = ?',
        [visitId, req.user.id]
      );

      if (!visit.length) {
        return res.status(404).json({ message: 'Visite non trouvée' });
      }

      await db.query(`
        UPDATE visits 
        SET status = 'executed',
            execution_date = NOW(),
            notes = ?,
            outcome = ?,
            latitude = ?,
            longitude = ?
        WHERE id = ?
      `, [notes, outcome, latitude, longitude, visitId]);

      // Enregistrer la position
      await db.query(`
        INSERT INTO location_tracking (user_id, latitude, longitude)
        VALUES (?, ?, ?)
      `, [req.user.id, latitude, longitude]);

      res.json({ message: 'Visite exécutée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Obtenir les visites d'un visiteur ou d'une équipe
  async getVisits(req, res) {
    try {
      let query = `
        SELECT v.*, 
               p.first_name as prescriber_first_name,
               p.last_name as prescriber_last_name,
               u.first_name as visitor_first_name,
               u.last_name as visitor_last_name
        FROM visits v
        JOIN prescribers p ON v.prescriber_id = p.id
        JOIN users u ON v.visitor_id = u.id
      `;

      const params = [];

      if (req.user.role === 'medical_visitor') {
        query += ' WHERE v.visitor_id = ?';
        params.push(req.user.id);
      } else if (req.user.role === 'supervisor') {
        query += ' WHERE u.team_id = ?';
        params.push(req.user.team_id);
      }

      query += ' ORDER BY v.planned_date DESC';

      const [visits] = await db.query(query, params);
      res.json(visits);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Annuler une visite
  async cancelVisit(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      await db.query(
        `UPDATE visits 
         SET status = 'cancelled',
             notes = CONCAT(IFNULL(notes, ''), '\nAnnulée: ', ?)
         WHERE id = ? AND status = 'planned'`,
        [reason, id]
      );

      res.json({ message: 'Visite annulée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Obtenir les statistiques du visiteur
  async getVisitorStats(req, res) {
    try {
      // Statistiques du mois en cours
      const [monthlyStats] = await db.query(`
        SELECT 
          COUNT(CASE WHEN status = 'executed' THEN 1 END) as monthly_visits,
          (SELECT visit_objective 
           FROM monthly_objectives 
           WHERE user_id = ? 
           AND MONTH(month) = MONTH(CURRENT_DATE())
           AND YEAR(month) = YEAR(CURRENT_DATE())) as monthly_objective
        FROM visits
        WHERE visitor_id = ?
        AND MONTH(planned_date) = MONTH(CURRENT_DATE())
        AND YEAR(planned_date) = YEAR(CURRENT_DATE())
      `, [req.user.id, req.user.id]);

      // Performance sur les 6 derniers mois
      const [performance] = await db.query(`
        SELECT 
          DATE_FORMAT(planned_date, '%Y-%m') as month,
          COUNT(CASE WHEN status = 'executed' THEN 1 END) as visits,
          mo.visit_objective as objective
        FROM visits v
        LEFT JOIN monthly_objectives mo ON 
          mo.user_id = ? AND
          DATE_FORMAT(v.planned_date, '%Y-%m') = DATE_FORMAT(mo.month, '%Y-%m')
        WHERE v.visitor_id = ?
        AND v.planned_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(planned_date, '%Y-%m')
        ORDER BY month ASC
      `, [req.user.id, req.user.id]);

      res.json({
        monthly_visits: monthlyStats[0].monthly_visits,
        monthly_objective: monthlyStats[0].monthly_objective,
        performance
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Pour définir l'utilisateur courant pour les triggers
  async setCurrentUser(req, res, next) {
    await db.query('SET @user_id = ?', [req.user.id]);
    next();
  },

  // Pour obtenir les performances d'un visiteur
  async getVisitorPerformance(req, res) {
    try {
      const [performance] = await db.query(`
        SELECT * FROM vw_visitor_performance
        WHERE visitor_id = ?
        AND month >= DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH), '%Y-%m')
      `, [req.user.id]);

      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Pour définir les objectifs mensuels
  async setMonthlyObjective(req, res) {
    try {
      const { userId, month, visitObjective, financialObjective } = req.body;
      await db.query(
        'CALL sp_set_monthly_objective(?, ?, ?, ?)',
        [userId, month, visitObjective, financialObjective]
      );
      res.json({ message: 'Objectifs mis à jour avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = visitController; 
