import React from 'react';
import { EnvironmentType, ENVIRONMENTS } from '../types';
import { MapPin } from 'lucide-react';

interface Props {
  selected: EnvironmentType;
  customValue: string;
  onSelect: (type: EnvironmentType) => void;
  onCustomChange: (val: string) => void;
}

export const StepEnvironment: React.FC<Props> = ({ selected, customValue, onSelect, onCustomChange }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Langkah 4: Pilih Lokasi</h2>
        <p className="text-zinc-400">Dimana foto ini diambil? Pilih preset atau buat lokasi sendiri.</p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ENVIRONMENTS.map((env) => (
          <button
            key={env.type}
            onClick={() => onSelect(env.type)}
            className={`relative p-6 rounded-xl border-2 text-left transition-all group overflow-hidden ${
              selected === env.type
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
            }`}
          >
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-bold text-lg ${selected === env.type ? 'text-indigo-400' : 'text-zinc-200'}`}>
                    {env.label}
                    </h3>
                    {selected === env.type && <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>}
                </div>
                <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                {env.description}
                </p>
            </div>
          </button>
        ))}

        {/* Custom Card */}
        <div
          className={`col-span-1 md:col-span-2 lg:col-span-3 p-6 rounded-xl border-2 transition-all ${
            selected === 'Custom'
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-zinc-800 bg-zinc-900'
          }`}
        >
            <div className="flex items-center space-x-3 mb-4 cursor-pointer" onClick={() => onSelect('Custom')}>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected === 'Custom' ? 'border-indigo-500' : 'border-zinc-600'}`}>
                    {selected === 'Custom' && <div className="w-3 h-3 bg-indigo-500 rounded-full" />}
                </div>
                <h3 className={`font-bold text-lg ${selected === 'Custom' ? 'text-indigo-400' : 'text-zinc-200'}`}>
                    Custom Environment
                </h3>
            </div>
            
            {selected === 'Custom' && (
                <div className="mt-2 animate-fade-in">
                    <label className="block text-sm text-zinc-400 mb-2">Deskripsikan lokasi secara detail:</label>
                    <input
                        type="text"
                        value={customValue}
                        onChange={(e) => onCustomChange(e.target.value)}
                        placeholder="Contoh: Di dalam pesawat jet pribadi mewah dengan kursi kulit..."
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
