export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  height: number;
  weight: number;
  position: string;
  club: string;
  nationality: string;
  sport: 'football' | 'basketball';
  avatar?: string;
}

export interface Performance {
  id: string;
  date: string;
  matchType: 'match' | 'training';
  opponent?: string;
  stats: Record<string, number>;
  rating: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'short' | 'medium' | 'long';
  targetDate: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface Event {
  id: string;
  title: string;
  type: 'training' | 'match' | 'medical' | 'meeting';
  date: string;
  time: string;
  location?: string;
  description?: string;
}

export interface ProgressAxis {
  id: string;
  name: string;
  currentLevel: number;
  targetLevel: number;
  color: string;
  improvements: string[];
}

export interface Club {
  id: string;
  name: string;
  sport: 'football' | 'basketball';
  country: string;
  league: string;
  logo?: string;
  description: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  referent: {
    name: string;
    role: string;
    email: string;
  };
  founded: number;
  website?: string;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  createdAt: string;
  isVerified: boolean;
}

export interface JobPosting {
  id: string;
  clubId: string;
  title: string;
  type: 'recruitment' | 'trial' | 'temporary' | 'loan';
  position: string;
  sport: 'football' | 'basketball';
  description: string;
  requirements: {
    ageMin?: number;
    ageMax?: number;
    level: string;
    nationality?: string[];
    minStats?: Record<string, number>;
    experience?: string;
  };
  contract: {
    duration?: string;
    salary?: string;
    benefits?: string[];
  };
  availabilityDate: string;
  expiryDate: string;
  status: 'active' | 'paused' | 'closed' | 'expired';
  views: number;
  applications: number;
  createdAt: string;
  updatedAt: string;
}

export interface MatchResult {
  id: string;
  jobPostingId: string;
  athleteId: string;
  score: number;
  reasons: string[];
  status: 'pending' | 'contacted' | 'interested' | 'rejected';
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalClubs: number;
  totalJobPostings: number;
  totalMatches: number;
  activeUsers: number;
  newRegistrations: number;
  successfulMatches: number;
  platformActivity: number;
}