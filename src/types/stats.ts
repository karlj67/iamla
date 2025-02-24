export interface AdminStats {
  total_visitors: number;
  monthly_visits: number;
  completion_rate: number;
  recent_activities: Activity[];
  active_teams: number;
  performance: PerformanceMetric[];
}

export interface Activity {
  id: string;
  type: 'visit' | 'meeting' | 'report';
  date: Date;
  description: string;
}

export interface PerformanceMetric {
  team_id: string;
  visits_completed: number;
  objective: number;
} 