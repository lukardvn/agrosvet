import React from 'react';
import { Sprout, ShoppingBag, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
  onAddToCart: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, categoryName, onAddToCart }) => (
  <div className="bg-white rounded-2xl shadow-soft border border-gray-100/50 overflow-hidden hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group">
    <div className="h-56 bg-gradient-to-br from-agro-50 to-agro-100 flex items-center justify-center text-agro-300 relative overflow-hidden">
      <Sprout size={100} strokeWidth={0.5} className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ease-out" />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-agro-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm border border-agro-100">
        {categoryName || 'Proizvod'}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-lg font-bold mb-1.5 text-gray-900 group-hover:text-agro-700 transition-colors">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2 min-h-[40px]">{product.description}</p>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <div>
          <span className="text-[10px] block font-bold text-gray-400 uppercase tracking-tighter">Cena</span>
          <span className="text-xl font-black text-earth-900">{product.price.toLocaleString('sr-RS')} <small className="text-xs font-normal">RSD</small></span>
        </div>
        <button 
          onClick={() => onAddToCart(product.id)}
          className="bg-agro-600 text-white p-3 rounded-xl font-bold hover:bg-agro-700 transition-all shadow-md shadow-agro-600/20 active:scale-90 flex items-center justify-center group/btn"
          title="Dodaj u korpu"
        >
          <ShoppingBag size={20} className="group-hover/btn:scale-110 transition-transform" />
          <Plus size={12} className="absolute ml-5 mb-4" strokeWidth={4} />
        </button>
      </div>
    </div>
  </div>
);
