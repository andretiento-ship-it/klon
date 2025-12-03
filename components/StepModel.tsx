import React from 'react';
import { User, Image as ImageIcon, Type } from 'lucide-react';

interface Props {
  mode: 'description' | 'image';
  description: string;
  preview: string | null;
  setMode: (mode: 'description' | 'image') => void;
  setDescription: (text: string) => void;
  onUpload: (file: File) => void;
}

export const StepModel: React.FC<Props> = ({ mode, description, preview, setMode, setDescription, onUpload }) => {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Langkah 2: Tentukan Model</h2>
        <p className="text-zinc-400">Siapa yang akan menjadi subjek foto? Berikan deskripsi atau upload foto wajah.</p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-zinc-900 p-1 rounded-lg inline-flex border border-zinc-800">
          <button
            onClick={() => setMode('image')}
            className={`flex items-center space-x-2 px-6 py-2 rounded-md transition-all ${mode === 'image' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Foto Model</span>
          </button>
          <button
            onClick={() => setMode('description')}
            className={`flex items-center space-x-2 px-6 py-2 rounded-md transition-all ${mode === 'description' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            <Type className="w-4 h-4" />
            <span>Deskripsi Teks</span>
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        {mode === 'description' ? (
          <div className="space-y-3">
             <label className="block text-sm font-medium text-zinc-300">Deskripsi Fisik Model</label>
             <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Wanita Asia usia 25 tahun, rambut hitam panjang lurus, kulit cerah, postur tinggi semampai, ekspresi elegan..."
              className="w-full h-40 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
             />
             <p className="text-xs text-zinc-500">*Semakin detail deskripsi, semakin konsisten hasil model.</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative w-64 h-64 rounded-full border-2 border-dashed border-zinc-700 bg-zinc-900 hover:border-indigo-500 transition-all overflow-hidden group cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
              />
              
              {preview ? (
                <img src={preview} alt="Model" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                  <User className="w-12 h-12 mb-2" />
                  <span className="text-sm">Upload Foto Wajah/Badan</span>
                </div>
              )}
               {preview && (
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                    <p className="text-white text-xs bg-black/50 px-3 py-1 rounded-full">Ganti</p>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
