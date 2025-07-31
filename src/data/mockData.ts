import { Athlete, Performance, Goal, Event, ProgressAxis, Club, JobPosting, MatchResult, AdminStats } from '../types';

export const mockAthlete: Athlete = {
  id: '1',
  firstName: 'Antoine',
  lastName: 'Martin',
  age: 25,
  height: 185,
  weight: 78,
  position: 'Milieu offensif',
  club: 'FC Lions',
  nationality: 'France',
  sport: 'football',
  avatar: 'https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
};

export const mockPerformances: Performance[] = [
  {
    id: '1',
    date: '2024-01-15',
    matchType: 'match',
    opponent: 'FC Eagles',
    stats: { goals: 2, assists: 1, passes: 45, tackles: 3, distance: 11.2 },
    rating: 8.5
  },
  {
    id: '2',
    date: '2024-01-10',
    matchType: 'training',
    stats: { goals: 3, assists: 2, passes: 67, tackles: 5, distance: 8.7 },
    rating: 7.8
  },
  {
    id: '3',
    date: '2024-01-05',
    matchType: 'match',
    opponent: 'SC Tigers',
    stats: { goals: 1, assists: 3, passes: 52, tackles: 2, distance: 10.5 },
    rating: 9.0
  }
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Améliorer précision des passes',
    description: 'Atteindre 90% de précision sur longues passes',
    type: 'short',
    targetDate: '2024-03-01',
    progress: 75,
    status: 'in-progress'
  },
  {
    id: '2',
    title: 'Qualification Équipe Nationale',
    description: 'Intégrer la sélection pour les prochaines compétitions',
    type: 'medium',
    targetDate: '2024-08-01',
    progress: 45,
    status: 'in-progress'
  },
  {
    id: '3',
    title: 'Reconversion Entraîneur',
    description: 'Obtenir diplôme d\'entraîneur UEFA B',
    type: 'long',
    targetDate: '2026-12-01',
    progress: 20,
    status: 'pending'
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Entraînement Technique',
    type: 'training',
    date: '2024-01-20',
    time: '09:00',
    location: 'Centre d\'entraînement',
    description: 'Travail sur les centres et finitions'
  },
  {
    id: '2',
    title: 'FC Wolves vs FC Lions',
    type: 'match',
    date: '2024-01-22',
    time: '15:00',
    location: 'Stade Municipal',
    description: 'Match de championnat - Domicile'
  },
  {
    id: '3',
    title: 'Visite médicale',
    type: 'medical',
    date: '2024-01-25',
    time: '14:30',
    location: 'Centre médical du sport'
  }
];

export const mockProgressAxes: ProgressAxis[] = [
  {
    id: '1',
    name: 'Technique',
    currentLevel: 8.2,
    targetLevel: 9.0,
    color: '#2563EB',
    improvements: ['Précision des passes', 'Contrôle orienté', 'Frappes à distance']
  },
  {
    id: '2',
    name: 'Physique',
    currentLevel: 7.8,
    targetLevel: 8.5,
    color: '#059669',
    improvements: ['Endurance', 'Vitesse de sprint', 'Force explosive']
  },
  {
    id: '3',
    name: 'Tactique',
    currentLevel: 8.5,
    targetLevel: 9.2,
    color: '#EA580C',
    improvements: ['Positionnement défensif', 'Lectures de jeu', 'Communication']
  },
  {
    id: '4',
    name: 'Mental',
    currentLevel: 7.5,
    targetLevel: 8.8,
    color: '#7C3AED',
    improvements: ['Gestion du stress', 'Concentration', 'Leadership']
  }
];

export const mockClubs: Club[] = [
  {
    id: '1',
    name: 'FC Barcelona',
    sport: 'football',
    country: 'Espagne',
    league: 'La Liga',
    logo: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    description: 'Club de football professionnel basé à Barcelone, fondé en 1899.',
    contact: {
      email: 'recrutement@fcbarcelona.com',
      phone: '+34 93 496 36 00',
      address: 'Camp Nou, Barcelona, Espagne'
    },
    referent: {
      name: 'Carlos Martinez',
      role: 'Directeur Sportif',
      email: 'c.martinez@fcbarcelona.com'
    },
    founded: 1899,
    website: 'https://www.fcbarcelona.com',
    socialMedia: {
      twitter: '@FCBarcelona',
      instagram: '@fcbarcelona'
    },
    createdAt: '2024-01-01',
    isVerified: true
  },
  {
    id: '2',
    name: 'Los Angeles Lakers',
    sport: 'basketball',
    country: 'États-Unis',
    league: 'NBA',
    logo: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    description: 'Équipe de basketball professionnel basée à Los Angeles.',
    contact: {
      email: 'scouts@lakers.com',
      phone: '+1 310 426 6000',
      address: 'Crypto.com Arena, Los Angeles, CA'
    },
    referent: {
      name: 'Rob Pelinka',
      role: 'General Manager',
      email: 'r.pelinka@lakers.com'
    },
    founded: 1947,
    website: 'https://www.nba.com/lakers',
    createdAt: '2024-01-15',
    isVerified: true
  }
];

export const mockJobPostings: JobPosting[] = [
  {
    id: '1',
    clubId: '1',
    title: 'Milieu offensif - Recrutement prioritaire',
    type: 'recruitment',
    position: 'Milieu offensif',
    sport: 'football',
    description: 'Nous recherchons un milieu offensif créatif avec une excellente vision de jeu.',
    requirements: {
      ageMin: 20,
      ageMax: 28,
      level: 'Professionnel',
      nationality: ['France', 'Espagne', 'Brésil'],
      minStats: { goals: 10, assists: 8 },
      experience: '3+ années en division professionnelle'
    },
    contract: {
      duration: '3 ans',
      salary: 'À négocier',
      benefits: ['Logement', 'Véhicule de fonction', 'Assurance santé']
    },
    availabilityDate: '2024-07-01',
    expiryDate: '2024-03-31',
    status: 'active',
    views: 245,
    applications: 12,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    clubId: '2',
    title: 'Point Guard - Essai professionnel',
    type: 'trial',
    position: 'Meneur',
    sport: 'basketball',
    description: 'Opportunité d\'essai pour un meneur expérimenté avec leadership.',
    requirements: {
      ageMin: 22,
      ageMax: 30,
      level: 'Professionnel',
      minStats: { points: 15, assists: 7 },
      experience: 'Expérience internationale souhaitée'
    },
    contract: {
      duration: 'Essai 2 semaines',
      salary: 'Selon performance'
    },
    availabilityDate: '2024-02-15',
    expiryDate: '2024-02-28',
    status: 'active',
    views: 189,
    applications: 8,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  }
];

export const mockMatchResults: MatchResult[] = [
  {
    id: '1',
    jobPostingId: '1',
    athleteId: '1',
    score: 92,
    reasons: [
      'Poste correspondant parfaitement',
      'Statistiques supérieures aux exigences',
      'Âge dans la tranche demandée',
      'Nationalité française recherchée'
    ],
    status: 'contacted',
    createdAt: '2024-01-21'
  },
  {
    id: '2',
    jobPostingId: '2',
    athleteId: '1',
    score: 78,
    reasons: [
      'Expérience professionnelle confirmée',
      'Leadership démontré',
      'Statistiques correctes'
    ],
    status: 'pending',
    createdAt: '2024-01-26'
  }
];

export const mockAdminStats: AdminStats = {
  totalUsers: 1247,
  totalClubs: 89,
  totalJobPostings: 156,
  totalMatches: 2341,
  activeUsers: 892,
  newRegistrations: 23,
  successfulMatches: 187,
  platformActivity: 94
};