import { useState, useEffect } from 'react';
import { Building2, Save, Edit3, Globe, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Club } from '../../types';
import { Spinner } from '../ui/States';

interface ClubProfileProps {
  darkMode: boolean;
}

export default function ClubProfile({ darkMode }: ClubProfileProps) {
  const { user } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Club>>({});

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('clubs').select('*').eq('user_id', user!.id).maybeSingle();
    setClub(data as Club | null);
    setForm(data || {});
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    if (club) {
      await supabase.from('clubs').update({
        name: form.name, sport: form.sport, country: form.country, league: form.league,
        description: form.description, contact_email: form.contact_email, contact_phone: form.contact_phone,
        address: form.address, referent_name: form.referent_name, referent_role: form.referent_role,
        referent_email: form.referent_email, founded: form.founded, website: form.website,
      }).eq('id', club.id);
    } else {
      await supabase.from('clubs').insert({
        user_id: user!.id, name: form.name || 'Mon Club', sport: form.sport || 'football',
        country: form.country || '', league: form.league || '', description: form.description || '',
        contact_email: form.contact_email || '', contact_phone: form.contact_phone || '',
        address: form.address || '', referent_name: form.referent_name || '', referent_role: form.referent_role || '',
        referent_email: form.referent_email || '', founded: form.founded || new Date().getFullYear(),
        website: form.website || '',
      });
    }
    await loadData();
    setEditing(false);
    setSaving(false);
  };

  if (loading) return <Spinner />;

  const inputCls = `w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profil Club</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Informations et présentation de votre club</p>
        </div>
        <button onClick={() => editing ? handleSave() : setEditing(true)} disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50">
          {editing ? <><Save className="w-4 h-4" /> {saving ? 'Sauvegarde...' : 'Enregistrer'}</> : <><Edit3 className="w-4 h-4" /> Modifier</>}
        </button>
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <Building2 className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            {editing ? (
              <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nom du club" className={`text-2xl font-bold ${inputCls}`} />
            ) : (
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{club?.name || 'Non configuré'}</h2>
            )}
            <div className="flex flex-wrap gap-4 text-sm mt-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-green-500" />
                {editing ? <input type="number" value={form.founded || ''} onChange={e => setForm({ ...form, founded: +e.target.value })} placeholder="Fondé en" className={`w-24 ${inputCls}`} /> : <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Fondé en {club?.founded || 'N/A'}</span>}
              </div>
              {club?.website && <div className="flex items-center gap-1"><Globe className="w-4 h-4 text-green-500" /><a href={club.website} target="_blank" rel="noreferrer" className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{club.website}</a></div>}
              {club?.is_verified && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Vérifié</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Informations générales</h2>
          <div className="space-y-3">
            <Field label="Sport" value={club?.sport} editing={editing} formValue={form.sport || ''} onChange={v => setForm({ ...form, sport: v as 'football' | 'basketball' })} darkMode={darkMode} type="select" options={[{ value: 'football', label: 'Football' }, { value: 'basketball', label: 'Basketball' }]} />
            <Field label="Pays" value={club?.country} editing={editing} formValue={form.country || ''} onChange={v => setForm({ ...form, country: v })} darkMode={darkMode} />
            <Field label="Ligue" value={club?.league} editing={editing} formValue={form.league || ''} onChange={v => setForm({ ...form, league: v })} darkMode={darkMode} />
            <Field label="Site web" value={club?.website} editing={editing} formValue={form.website || ''} onChange={v => setForm({ ...form, website: v })} darkMode={darkMode} />
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contact</h2>
          <div className="space-y-3">
            <Field label="Email" value={club?.contact_email} editing={editing} formValue={form.contact_email || ''} onChange={v => setForm({ ...form, contact_email: v })} darkMode={darkMode} icon={Mail} />
            <Field label="Téléphone" value={club?.contact_phone} editing={editing} formValue={form.contact_phone || ''} onChange={v => setForm({ ...form, contact_phone: v })} darkMode={darkMode} icon={Phone} />
            <Field label="Adresse" value={club?.address} editing={editing} formValue={form.address || ''} onChange={v => setForm({ ...form, address: v })} darkMode={darkMode} icon={MapPin} />
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Référent</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Nom" value={club?.referent_name} editing={editing} formValue={form.referent_name || ''} onChange={v => setForm({ ...form, referent_name: v })} darkMode={darkMode} />
          <Field label="Rôle" value={club?.referent_role} editing={editing} formValue={form.referent_role || ''} onChange={v => setForm({ ...form, referent_role: v })} darkMode={darkMode} />
          <Field label="Email" value={club?.referent_email} editing={editing} formValue={form.referent_email || ''} onChange={v => setForm({ ...form, referent_email: v })} darkMode={darkMode} icon={Mail} />
        </div>
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Description</h2>
        {editing ? (
          <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className={inputCls} placeholder="Présentation du club..." />
        ) : (
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{club?.description || 'Aucune description'}</p>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, editing, formValue, onChange, darkMode, icon: Icon, type = 'text', options }: {
  label: string; value?: string; editing: boolean; formValue: string; onChange: (v: string) => void; darkMode: boolean;
  icon?: React.ComponentType<{ className?: string }>; type?: 'text' | 'select'; options?: { value: string; label: string }[];
}) {
  const inputCls = `w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500`;
  return (
    <div>
      <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
      <div className="mt-1">
        {editing ? (
          type === 'select' ? (
            <select value={formValue} onChange={e => onChange(e.target.value)} className={inputCls}>
              {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : (
            <div className="relative">
              {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
              <input value={formValue} onChange={e => onChange(e.target.value)} className={Icon ? `${inputCls} pl-9` : inputCls} />
            </div>
          )
        ) : (
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-gray-400" />}
            <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{value || 'Non défini'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
