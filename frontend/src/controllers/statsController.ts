const db = require('../config/database');

const statsController = {
  // Obtenir les statistiques mensuelles d'un VM ou d'une équipe
  async getMonthlyStats(req, res) {
    try {
      const { month, year, userId, teamId } = req.query;
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-31`;

      let query = `
        SELECT 
          u.id as user_id,
          u.first_name,
          u.last_name,
          t.name as team_name,
          COUNT(v.id) as total_visits,
          SUM(CASE WHEN v.status = 'executed' THEN 1 ELSE 0 END) as executed_visits,
          SUM(CASE WHEN v.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_visits,
          COALESCE(SUM(vv.amount), 0) as total_amount,
          mo.visit_objective,
          mo.financial_objective
        FROM users u
        LEFT JOIN teams t ON u.team_id = t.id
        LEFT JOIN visits v ON u.id = v.visitor_id 
          AND v.planned_date BETWEEN ? AND ?
        LEFT JOIN visit_values vv ON v.id = vv.visit_id
        LEFT JOIN monthly_objectives mo ON u.id = mo.user_id 
          AND mo.month = ?
        WHERE u.role = 'medical_visitor'
      `;

      const params = [startDate, endDate, startDate];

      // Filtrer selon les permissions
      if (req.user.role === 'medical_visitor') {
        query += ' AND u.id = ?';
        params.push(req.user.id);
      } else if (req.user.role === 'supervisor') {
        query += ' AND u.team_id = ?';
        params.push(req.user.team_id);
      }

      // Filtres optionnels
      if (userId) {
        query += ' AND u.id = ?';
        params.push(userId);
      }
      if (teamId) {
        query += ' AND u.team_id = ?';
        params.push(teamId);
      }

      query += ' GROUP BY u.id';

      const [stats] = await db.query(query, params);

      // Calculer les pourcentages de réalisation
      const enrichedStats = stats.map(stat => ({
        ...stat,
        visit_completion: stat.visit_objective ? 
          (stat.executed_visits / stat.visit_objective * 100).toFixed(2) : null,
        financial_completion: stat.financial_objective ? 
          (stat.total_amount / stat.financial_objective * 100).toFixed(2) : null
      }));

      res.json(enrichedStats);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Obtenir les performances détaillées par type de prescripteur
  async getPrescriberTypeStats(req, res) {
    try {
      const { month, year, userId, teamId } = req.query;
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-31`;

      let query = `
        SELECT 
          u.id as user_id,
          u.first_name,
          u.last_name,
          pt.name as prescriber_type,
          COUNT(v.id) as total_visits,
          SUM(CASE WHEN v.status = 'executed' THEN 1 ELSE 0 END) as executed_visits,
          COALESCE(SUM(vv.amount), 0) as total_amount
        FROM users u
        LEFT JOIN visits v ON u.id = v.visitor_id 
          AND v.planned_date BETWEEN ? AND ?
        LEFT JOIN prescribers p ON v.prescriber_id = p.id
        LEFT JOIN prescriber_types pt ON p.type_id = pt.id
        LEFT JOIN visit_values vv ON v.id = vv.visit_id
        WHERE u.role = 'medical_visitor'
      `;

      const params = [startDate, endDate];

      // Appliquer les mêmes filtres que précédemment
      if (req.user.role === 'medical_visitor') {
        query += ' AND u.id = ?';
        params.push(req.user.id);
      } else if (req.user.role === 'supervisor') {
        query += ' AND u.team_id = ?';
        params.push(req.user.team_id);
      }

      if (userId) {
        query += ' AND u.id = ?';
        params.push(userId);
      }
      if (teamId) {
        query += ' AND u.team_id = ?';
        params.push(teamId);
      }

      query += ' GROUP BY u.id, pt.id';

      const [stats] = await db.query(query, params);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Définir les objectifs mensuels
  async setMonthlyObjectives(req, res) {
    try {
      const { userId, month, visitObjective, financialObjective } = req.body;

      // Vérifier les permissions
      if (req.user.role === 'medical_visitor') {
        return res.status(403).json({ message: 'Permission non accordée' });
      }

      if (req.user.role === 'supervisor') {
        // Vérifier que l'utilisateur est dans l'équipe du superviseur
        const [userTeam] = await db.query(
          'SELECT team_id FROM users WHERE id = ?',
          [userId]
        );
        if (!userTeam.length || userTeam[0].team_id !== req.user.team_id) {
          return res.status(403).json({ message: 'Utilisateur non autorisé' });
        }
      }

      // Insérer ou mettre à jour les objectifs
      await db.query(
        `INSERT INTO monthly_objectives (user_id, month, visit_objective, financial_objective)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         visit_objective = VALUES(visit_objective),
         financial_objective = VALUES(financial_objective)`,
        [userId, month, visitObjective, financialObjective]
      );

      res.json({ message: 'Objectifs mis à jour avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async getStats(req, res) {
    try {
      console.log('Récupération des statistiques...');
      // Statistiques des visites
      const [visitStats] = await db.query(`
        SELECT 
          COUNT(*) as total_visits,
          SUM(CASE WHEN status = 'executed' THEN 1 ELSE 0 END) as executed_visits,
          SUM(CASE WHEN status = 'planned' THEN 1 ELSE 0 END) as planned_visits
        FROM visits
      `);
      console.log('Statistiques des visites:', visitStats[0]);

      // Statistiques des prescripteurs
      const [prescriberStats] = await db.query(`
        SELECT COUNT(*) as total_prescribers
        FROM prescribers
      `);
      console.log('Statistiques des prescripteurs:', prescriberStats[0]);

      // Si pas de données, retourner des valeurs par défaut
      const stats = {
        visits: {
          total_visits: visitStats[0].total_visits || 0,
          executed_visits: visitStats[0].executed_visits || 0,
          planned_visits: visitStats[0].planned_visits || 0
        },
        prescribers: {
          total_prescribers: prescriberStats[0].total_prescribers || 0
        }
      };

      res.json(stats);
    } catch (error) {
      console.error('Erreur dans getStats:', error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Statistiques pour l'admin
  async getAdminStats(req, res) {
    try {
      // Total des visiteurs
      const [totalVisitors] = await db.query(`
        SELECT COUNT(*) as total
        FROM users
        WHERE role = 'medical_visitor'
      `);

      // Visites du mois
      const [monthlyVisits] = await db.query(`
        SELECT COUNT(*) as total
        FROM visits
        WHERE MONTH(planned_date) = MONTH(CURRENT_DATE())
        AND YEAR(planned_date) = YEAR(CURRENT_DATE())
        AND status = 'executed'
      `);

      // Équipes actives
      const [activeTeams] = await db.query(`
        SELECT COUNT(DISTINCT team_id) as total
        FROM users
        WHERE role = 'medical_visitor'
        AND team_id IS NOT NULL
      `);

      // Performance globale sur 6 mois
      const [performance] = await db.query(`
        SELECT 
          DATE_FORMAT(v.planned_date, '%Y-%m') as month,
          COUNT(CASE WHEN v.status = 'executed' THEN 1 END) as completed_visits,
          COUNT(*) as total_visits,
          COALESCE(SUM(vv.amount), 0) as total_value
        FROM visits v
        LEFT JOIN visit_values vv ON v.id = vv.visit_id
        WHERE v.planned_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(v.planned_date, '%Y-%m')
        ORDER BY month ASC
      `);

      res.json({
        total_visitors: totalVisitors[0].total,
        monthly_visits: monthlyVisits[0].total,
        active_teams: activeTeams[0].total,
        performance
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Statistiques pour le superviseur
  async getSupervisorStats(req, res) {
    try {
      const teamId = req.user.team_id;

      // Visiteurs actifs aujourd'hui
      const [activeVisitors] = await db.query(`
        SELECT COUNT(DISTINCT visitor_id) as total
        FROM visits v
        JOIN users u ON v.visitor_id = u.id
        WHERE u.team_id = ?
        AND DATE(v.planned_date) = CURRENT_DATE()
      `, [teamId]);

      // Visites du jour
      const [todayVisits] = await db.query(`
        SELECT COUNT(*) as total
        FROM visits v
        JOIN users u ON v.visitor_id = u.id
        WHERE u.team_id = ?
        AND DATE(v.planned_date) = CURRENT_DATE()
        AND v.status = 'executed'
      `, [teamId]);

      // Taux de réalisation
      const [completionRate] = await db.query(`
        SELECT 
          ROUND((COUNT(CASE WHEN v.status = 'executed' THEN 1 END) / COUNT(*)) * 100, 2) as rate
        FROM visits v
        JOIN users u ON v.visitor_id = u.id
        WHERE u.team_id = ?
        AND MONTH(v.planned_date) = MONTH(CURRENT_DATE())
        AND YEAR(v.planned_date) = YEAR(CURRENT_DATE())
      `, [teamId]);

      // Performance de l'équipe
      const [teamPerformance] = await db.query(`
        SELECT 
          DATE_FORMAT(v.planned_date, '%Y-%m') as month,
          COUNT(CASE WHEN v.status = 'executed' THEN 1 END) as completed_visits,
          COUNT(*) as total_visits,
          COALESCE(SUM(vv.amount), 0) as total_value
        FROM visits v
        JOIN users u ON v.visitor_id = u.id
        LEFT JOIN visit_values vv ON v.id = vv.visit_id
        WHERE u.team_id = ?
        AND v.planned_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(v.planned_date, '%Y-%m')
        ORDER BY month ASC
      `, [teamId]);

      res.json({
        active_visitors: activeVisitors[0].total,
        today_visits: todayVisits[0].total,
        completion_rate: completionRate[0].rate,
        team_performance: teamPerformance
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = statsController; 
