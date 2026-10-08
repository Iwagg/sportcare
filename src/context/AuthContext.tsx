import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, role: UserRole, firstName: string, lastName: string, clubName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error);
    }
    setProfile(data as Profile | null);
    setLoading(false);
  };

  const signUp = async (
    email: string,
    password: string,
    role: UserRole,
    firstName: string,
    lastName: string,
    clubName: string
  ): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          first_name: firstName,
          last_name: lastName,
          club_name: clubName,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      if (role === 'athlete') {
        await supabase.from('athlete_profiles').insert({
          user_id: data.user.id,
          age: 0,
          height: 0,
          weight: 0,
          position: '',
          nationality: '',
          sport: 'football',
          club: '',
        });
        await seedDefaultData(data.user.id);
      } else if (role === 'club') {
        await supabase.from('clubs').insert({
          user_id: data.user.id,
          name: clubName,
          sport: 'football',
          country: '',
          league: '',
          description: '',
          contact_email: email,
          contact_phone: '',
          address: '',
          referent_name: '',
          referent_role: '',
          referent_email: '',
          founded: new Date().getFullYear(),
          website: '',
        });
      }
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    setSession(null);
  };

  const seedDefaultData = async (userId: string) => {
    const axes = [
      { name: 'Technique', current_level: 6.0, target_level: 9.0, color: '#2563EB', improvements: ['Précision des passes', 'Contrôle orienté', 'Frappes à distance'] },
      { name: 'Physique', current_level: 6.0, target_level: 8.5, color: '#059669', improvements: ['Endurance', 'Vitesse de sprint', 'Force explosive'] },
      { name: 'Tactique', current_level: 6.0, target_level: 9.0, color: '#EA580C', improvements: ['Positionnement défensif', 'Lectures de jeu', 'Communication'] },
      { name: 'Mental', current_level: 6.0, target_level: 8.5, color: '#0891B2', improvements: ['Gestion du stress', 'Concentration', 'Leadership'] },
    ];
    for (const axis of axes) {
      await supabase.from('progress_axes').insert({ user_id: userId, ...axis });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
