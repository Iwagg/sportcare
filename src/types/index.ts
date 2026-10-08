export type UserRole = 'athlete' | 'club' | 'admin';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  club_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface AthleteProfile {
  id: string;
  user_id: string;
  age: number;
  height: number;
  weight: number;
  position: string;
  nationality: string;
  sport: 'football' | 'basketball';
  club: string;
  matches_played: number;
  goals_scored: number;
  assists_made: number;
}

export interface Performance {
  id: string;
  user_id: string;
  date: string;
  match_type: 'match' | 'training';
  opponent?: string;
  stats: Record<string, number>;
  rating: number;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: 'short' | 'medium' | 'long';
  target_date: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface Event {
  id: string;
  user_id: string;
  title: string;
  type: 'training' | 'match' | 'medical' | 'meeting';
  date: string;
  time: string;
  location?: string;
  description?: string;
}

export interface ProgressAxis {
  id: string;
  user_id: string;
  name: string;
  current_level: number;
  target_level: number;
  color: string;
  improvements: string[];
}

export interface Club {
  id: string;
  user_id: string;
  name: string;
  sport: 'football' | 'basketball';
  country: string;
  league: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  referent_name: string;
  referent_role: string;
  referent_email: string;
  founded: number;
  website: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobPosting {
  id: string;
  club_id: string;
  title: string;
  description: string;
  position: string;
  type: 'recruitment' | 'trial' | 'temporary' | 'loan';
  sport: 'football' | 'basketball';
  requirements: {
    ageMin?: number;
    ageMax?: number;
    level?: string;
    nationality?: string[];
    minStats?: Record<string, number>;
    experience?: string;
  };
  contract: {
    duration?: string;
    salary?: string;
    benefits?: string[];
  };
  availability_date: string;
  expiry_date: string;
  status: 'active' | 'paused' | 'closed' | 'expired';
  views: number;
  applications: number;
  created_at: string;
  updated_at: string;
}

export interface MatchResult {
  id: string;
  job_posting_id: string;
  athlete_id: string;
  score: number;
  reasons: string[];
  status: 'pending' | 'contacted' | 'interested' | 'rejected';
  created_at: string;
}
