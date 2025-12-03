import React from 'react';
import { Loader2, Download, RefreshCw } from 'lucide-react';
import { EnvironmentType } from '../types';

interface Props {
  isGenerating: boolean;
  progress: number;
  results: string[];
  productCount: number;
  environment: EnvironmentType;
  customEnv: string;
  onReset: () => void;
}

export const StepGenerate: React.FC<Props> = ({ isGenerating, progress, results, productCount, environment, customEnv, onReset }) => {
  const envLabel = environment === 'Custom' ? customEnv : environment;

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in text-center space-y-6">
        <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative z-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Sedang Mengkloning...</h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            Memproses {productCount} variasi gambar di {envLabel}. <br/>Ini mungkin memakan waktu 1-2 menit.
          </p>
        </div>
        
        <div className="w-full max-w-md bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-zinc-500 font-mono text-sm">{Math.round(progress)}% Selesai</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-white">Hasil Kloning ({results.length})</h2>
           <p className="text-zinc-400 text-sm">Lokasi: {envLabel}</p>
        </div>
        <button 
            onClick={onReset}
            className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition-colors text-sm"
        >
            <RefreshCw className="w-4 h-4" />
            <span>Mulai Ulang</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((imgSrc, idx) => (
          <div key={idx} className="group relative aspect-[9/16] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
            <img src={imgSrc} alt={`Result ${idx + 1}`} className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
               <a 
                 href={imgSrc} 
                 download={`clone-result-${idx+1}.png`}
                 className="flex items-center justify-center space-x-2 bg-white text-black py-3 rounded-lg font-semibold hover:bg-zinc-200 transition-colors w-full"
               >
                 <Download className="w-4 h-4" />
                 <span>Download High Res</span>
               </a>
            </div>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white/80">
                VARIAN {idx + 1}
            </div>
          </div>
        ))}
      </div>
      
      {results.length === 0 && !isGenerating && (
          <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
              <p className="text-zinc-500">Belum ada hasil yang digenerate.</p>
          </div>
      )}
    </div>
  );
};
