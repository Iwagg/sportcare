import { Trophy, Building2, Shield, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [clubName, setClubName] = useState('');
  const [role, setRole] = useState<UserRole>('athlete');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      if (role === 'athlete' && (!firstName || !lastName)) {
        setError('Veuillez saisir votre prénom et nom');
        setLoading(false);
        return;
      }
      if (role === 'club' && !clubName) {
        setError('Veuillez saisir le nom du club');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, role, firstName, lastName, clubName);
      if (error) {
        setError(error);
        setLoading(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">SportCare Pro</h1>
          <p className="text-slate-400 mt-2">Plateforme de gestion de carrière sportive</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          <div className="flex gap-2 mb-6 p-1 bg-slate-800/50 rounded-lg">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                mode === 'signin' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                mode === 'signup' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Inscription
            </button>
          </div>

          {mode === 'signup' && (
            <div className="grid grid-cols-3 gap-2 mb-6">
              <RoleButton active={role === 'athlete'} onClick={() => setRole('athlete')} icon={Trophy} label="Athlète" color="blue" />
              <RoleButton active={role === 'club'} onClick={() => setRole('club')} icon={Building2} label="Club" color="green" />
              <RoleButton active={role === 'admin'} onClick={() => setRole('admin')} icon={Shield} label="Admin" color="red" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && role === 'athlete' && (
              <div className="grid grid-cols-2 gap-3">
                <InputField icon={UserIcon} placeholder="Prénom" value={firstName} onChange={setFirstName} />
                <InputField icon={UserIcon} placeholder="Nom" value={lastName} onChange={setLastName} />
              </div>
            )}
            {mode === 'signup' && role === 'club' && (
              <InputField icon={Building2} placeholder="Nom du club" value={clubName} onChange={setClubName} />
            )}
            <InputField icon={Mail} placeholder="Email" value={email} onChange={setEmail} type="email" />
            <div className="relative">
              <InputField icon={Lock} placeholder="Mot de passe" value={password} onChange={setPassword} type={showPassword ? 'text' : 'password'} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors shadow-lg"
            >
              {loading ? 'Chargement...' : mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          En continuant, vous acceptez les conditions d'utilisation de SportCare Pro.
        </p>
      </div>
    </div>
  );
}

function RoleButton({ active, onClick, icon: Icon, label, color }: { active: boolean; onClick: () => void; icon: React.ComponentType<{ className?: string }>; label: string; color: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border transition-all ${
        active
          ? color === 'blue' ? 'border-blue-500 bg-blue-500/10 text-blue-400'
          : color === 'green' ? 'border-green-500 bg-green-500/10 text-green-400'
          : 'border-red-500 bg-red-500/10 text-red-400'
          : 'border-slate-700 text-slate-400 hover:border-slate-500'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function InputField({ icon: Icon, placeholder, value, onChange, type = 'text' }: { icon: React.ComponentType<{ className?: string }>; placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    </div>
  );
}
