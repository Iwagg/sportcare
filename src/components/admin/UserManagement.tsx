import { useState, useEffect } from 'react';
import { Search, User, Building2, Shield, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Profile } from '../../types';
import { Spinner, EmptyState } from '../ui/States';

interface UserManagementProps {
  darkMode: boolean;
}

export default function UserManagement({ darkMode }: UserManagementProps) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers((data as Profile[]) || []);
    setLoading(false);
  };

  const toggleRole = async (user: Profile) => {
    const roles: Profile['role'][] = ['athlete', 'club', 'admin'];
    const currentIdx = roles.indexOf(user.role);
    const newRole = roles[(currentIdx + 1) % roles.length];
    await supabase.from('profiles').update({ role: newRole }).eq('id', user.id);
    await loadData();
  };

  const deleteUser = async (user: Profile) => {
    if (!confirm(`Supprimer ${user.email} ? Cette action est irréversible.`)) return;
    await supabase.from('profiles').delete().eq('id', user.id);
    await loadData();
  };

  if (loading) return <Spinner />;

  const getRoleColor = (role: string) => ({ athlete: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', club: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }[role] || '');
  const getRoleIcon = (role: string) => role === 'athlete' ? User : role === 'club' ? Building2 : Shield;

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${u.first_name} ${u.last_name} ${u.club_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const inputCls = `px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-red-500`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Gestion des Utilisateurs</h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Administration des comptes utilisateurs</p>
      </div>

      <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Rechercher par nom ou email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`w-full pl-10 pr-4 py-2 ${inputCls}`} />
          </div>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className={inputCls}>
            <option value="all">Tous les rôles</option><option value="athlete">Athlètes</option><option value="club">Clubs</option><option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className={`rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Utilisateur</th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Rôle</th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Inscrit le</th>
                <th className={`px-4 py-3 text-right text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredUsers.length > 0 ? filteredUsers.map((u) => {
                const Icon = getRoleIcon(u.role);
                return (
                  <tr key={u.id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${u.role === 'admin' ? 'bg-red-500' : u.role === 'club' ? 'bg-green-500' : 'bg-blue-500'}`}>
                          {(u.role === 'club' ? u.club_name : u.first_name || 'U').charAt(0)}
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{u.role === 'club' ? u.club_name : `${u.first_name} ${u.last_name}`}</div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(u.role)}`}>
                        <Icon className="w-3 h-3" />{u.role}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleRole(u)} className={`px-2 py-1 text-xs rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Changer rôle</button>
                        <button onClick={() => deleteUser(u)} className="p-1.5 rounded-md hover:bg-red-100 text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={4}><EmptyState icon={Search} message="Aucun utilisateur trouvé" darkMode={darkMode} /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="flex items-center gap-3"><User className="w-8 h-8 text-blue-600" /><div><p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{users.filter(u => u.role === 'athlete').length}</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Athlètes</p></div></div></div>
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="flex items-center gap-3"><Building2 className="w-8 h-8 text-green-600" /><div><p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{users.filter(u => u.role === 'club').length}</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Clubs</p></div></div></div>
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="flex items-center gap-3"><Shield className="w-8 h-8 text-red-600" /><div><p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{users.filter(u => u.role === 'admin').length}</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Admins</p></div></div></div>
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="flex items-center gap-3"><CheckCircle className="w-8 h-8 text-cyan-600" /><div><p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{users.length}</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</p></div></div></div>
      </div>
    </div>
  );
}
