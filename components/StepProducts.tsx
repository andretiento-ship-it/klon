import React from 'react';
import { Plus, X, ShoppingBag } from 'lucide-react';
import { ProductImage } from '../types';

interface Props {
  products: ProductImage[];
  addProduct: (file: File) => void;
  removeProduct: (id: string) => void;
}

export const StepProducts: React.FC<Props> = ({ products, addProduct, removeProduct }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        if (products.length < 9) { // Simple client side check, parent should also validate
          addProduct(file);
        }
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Langkah 3: Produk (Max 9)</h2>
        <p className="text-zinc-400">Upload gambar pakaian atau produk. Setiap produk akan dibuatkan 1 foto kloningan.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <div key={product.id} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-zinc-700 group bg-zinc-900">
              <img src={product.previewUrl} alt="Product" className="w-full h-full object-cover" />
              <button
                onClick={() => removeProduct(product.id)}
                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                 <span className="text-xs text-white font-medium truncate block">{product.file.name}</span>
              </div>
            </div>
          ))}

          {products.length < 9 && (
            <div className="relative aspect-[3/4] rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-indigo-500 transition-all flex flex-col items-center justify-center cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
              />
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-2 group-hover:bg-zinc-700 transition-colors">
                <Plus className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300">Tambah Produk</span>
              <span className="text-xs text-zinc-600 mt-1">{products.length}/9 Uploaded</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
