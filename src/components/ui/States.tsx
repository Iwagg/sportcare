import { ReactNode } from 'react';

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center py-12">
      <div className={`${sizes[size]} border-2 border-blue-500 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
}

export function EmptyState({ icon: Icon, message, darkMode }: { icon: React.ComponentType<{ className?: string }>; message: string; darkMode: boolean }) {
  return (
    <div className="text-center py-12">
      <Icon className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
      <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{message}</p>
    </div>
  );
}

export function ErrorState({ message, darkMode }: { message: string; darkMode: boolean }) {
  return (
    <div className={`text-center py-12 px-4 rounded-lg border ${darkMode ? 'bg-red-950/30 border-red-800/50' : 'bg-red-50 border-red-200'}`}>
      <p className={`text-lg ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{message}</p>
    </div>
  );
}
