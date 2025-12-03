import React from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface Props {
  preview: string | null;
  onUpload: (file: File) => void;
}

export const StepReference: React.FC<Props> = ({ preview, onUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Langkah 1: DNA Referensi</h2>
        <p className="text-zinc-400">Upload foto referensi yang gaya visualnya (lighting, angle, vibe) ingin Anda tiru.</p>
      </div>

      <div className="flex justify-center">
        <div className="relative group w-full max-w-md aspect-[3/4] rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-indigo-500 transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
          />
          
          {preview ? (
            <img 
              src={preview} 
              alt="Reference" 
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          ) : (
            <div className="flex flex-col items-center text-zinc-500 p-6 text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="font-medium text-zinc-300">Klik atau drop foto di sini</p>
              <p className="text-sm mt-2">Format: JPG, PNG</p>
            </div>
          )}
          
          {preview && (
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center">
                <p className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">Ganti Foto Referensi</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
