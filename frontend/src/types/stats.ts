export interface AdminStats {
  total_visitors: number;
  monthly_visits: number;
  active_teams: number;
  performance: PerformanceData[];
  completion_rate: number;
  recent_activities: Array<any>;
}

export interface SupervisorStats {
  active_visitors: number;
  today_visits: number;
  completion_rate: number;
  team_performance: PerformanceData[];
}

export interface PerformanceData {
  month: string;
  completed_visits: number;
  total_visits: number;
  total_value: number;
}

export interface TeamMember {
  id: number;
  first_name: string;
  last_name: string;
  profile_photo?: string;
  visits_today: number;
  completion_rate: number;
}

export interface Team {
  id: number;
  name: string;
  member_count: number;
  completion_rate: number;
}

export interface Location {
  user_id: number;
  user_name: string;
  latitude: number;
  longitude: number;
  timestamp: string;
} 
