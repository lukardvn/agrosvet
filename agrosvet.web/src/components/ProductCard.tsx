import React from 'react';
import { ImageOff, ShoppingBag, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
  onAddToCart: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, categoryName, onAddToCart }) => (
  <div className="surface-card group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-hover">
    <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-agro-50 to-agro-100 text-agro-300 sm:h-44">
      <ImageOff className="absolute" size={52} strokeWidth={1} />
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          onError={event => { event.currentTarget.style.display = 'none'; }}
          className="relative h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      )}
      <div className="absolute right-3 top-3 rounded-full border border-agro-100 bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-agro-700 shadow-sm backdrop-blur-sm">
        {categoryName || 'Proizvod'}
      </div>
    </div>
    <div className="p-4">
      <h3 className="mb-3 line-clamp-2 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-agro-700">{product.name}</h3>

      <div className="flex items-center justify-between border-t border-gray-50 pt-3">
        <div>
          <span className="text-[10px] block font-bold text-gray-400 uppercase tracking-tighter">Cena</span>
          <span className="text-lg font-black text-earth-900">{product.price.toLocaleString('sr-RS')} <small className="text-xs font-normal">RSD</small></span>
        </div>
        <button 
          onClick={() => onAddToCart(product.id)}
          className="group/btn flex items-center justify-center rounded-lg bg-agro-600 p-2.5 font-bold text-white shadow-md shadow-agro-600/20 transition-all hover:bg-agro-700 active:scale-90"
          title="Dodaj u korpu"
        >
          <ShoppingBag size={18} className="transition-transform group-hover/btn:scale-110" />
          <Plus size={12} className="absolute ml-5 mb-4" strokeWidth={4} />
        </button>
      </div>
    </div>
  </div>
);
