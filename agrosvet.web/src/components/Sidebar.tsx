import React, { useState, useEffect } from 'react';
import { Filter, Trash2, ShoppingBasket, ShoppingCart, Tag, Coins, ChevronRight } from 'lucide-react';
import { Category, Cart } from '../types';

interface SidebarProps {
  categories: Category[];
  activeCategoryId: number | null;
  onCategorySelect: (id: number | null) => void;
  cart: Cart | null;
  onRemoveFromCart: (id: number) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  categories, 
  activeCategoryId, 
  onCategorySelect, 
  cart, 
  onRemoveFromCart,
  priceRange,
  onPriceRangeChange
}) => {
  // Local state to handle input values as strings to allow empty fields and avoid leading zero issues
  const [minPrice, setMinPrice] = useState(priceRange[0].toString());
  const [maxPrice, setMaxPrice] = useState(priceRange[1].toString());

  // Update local state when parent state changes (e.g., reset filters)
  useEffect(() => {
    setMinPrice(priceRange[0].toString());
    setMaxPrice(priceRange[1].toString());
  }, [priceRange]);

  const handleMinChange = (value: string) => {
    // Only allow digits
    const cleanValue = value.replace(/\D/g, '');
    setMinPrice(cleanValue);
    const numericValue = cleanValue === '' ? 0 : parseInt(cleanValue);
    onPriceRangeChange([numericValue, priceRange[1]]);
  };

  const handleMaxChange = (value: string) => {
    // Only allow digits
    const cleanValue = value.replace(/\D/g, '');
    setMaxPrice(cleanValue);
    const numericValue = cleanValue === '' ? 0 : parseInt(cleanValue);
    onPriceRangeChange([priceRange[0], numericValue]);
  };

  return (
    <aside className="w-80 flex flex-col gap-8">
      {/* Categories Section */}
      <div className="bg-white p-7 rounded-3xl shadow-soft border border-gray-100/50 backdrop-blur-xl transition-all hover:shadow-hover">
        <div className="flex items-center gap-2.5 mb-6 text-earth-900 font-black text-xs uppercase tracking-[0.2em] opacity-80">
          <Tag size={18} className="text-agro-600" />
          <span>Kategorije</span>
        </div>
        <ul className="space-y-1.5">
          <li>
            <button 
              onClick={() => onCategorySelect(null)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between group ${!activeCategoryId ? 'bg-agro-600 text-white shadow-lg shadow-agro-600/30' : 'hover:bg-agro-50 text-gray-600'}`}
            >
              <span className="font-bold text-sm tracking-wide">Sve Ponude</span>
              <Filter size={14} className={`${!activeCategoryId ? 'opacity-100 scale-125' : 'opacity-0 group-hover:opacity-40'} transition-all`} />
            </button>
          </li>
          {categories.map(category => (
            <li key={category.id}>
              <button 
                onClick={() => onCategorySelect(category.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between group ${activeCategoryId === category.id ? 'bg-agro-600 text-white shadow-lg shadow-agro-600/30 font-bold' : 'hover:bg-agro-50 text-gray-600'}`}
              >
                <span className="text-sm tracking-wide">{category.name}</span>
                <div className={`w-1.5 h-1.5 rounded-full bg-white ${activeCategoryId === category.id ? 'opacity-100 scale-125' : 'opacity-0'} transition-all`} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter Section */}
      <div className="bg-white p-7 rounded-3xl shadow-soft border border-gray-100/50 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 mb-6 text-earth-900 font-black text-xs uppercase tracking-[0.2em] opacity-80">
          <Coins size={18} className="text-earth-600" />
          <span>Opseg Cene (RSD)</span>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Od</label>
              <input 
                type="text" 
                inputMode="numeric"
                value={minPrice} 
                onChange={(e) => handleMinChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-agro-500/10 focus:border-agro-200 transition-all"
              />
            </div>
            <div className="mt-4 text-gray-300"><ChevronRight size={14} /></div>
            <div className="flex-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Do</label>
              <input 
                type="text" 
                inputMode="numeric"
                value={maxPrice} 
                onChange={(e) => handleMaxChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-agro-500/10 focus:border-agro-200 transition-all"
              />
            </div>
          </div>
          <input 
            type="range" 
            min="0" 
            max="10000" 
            step="100"
            value={priceRange[1]}
            onChange={(e) => handleMaxChange(e.target.value)}
            className="w-full accent-agro-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
            <span>0 RSD</span>
            <span>10,000+ RSD</span>
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="bg-white p-7 rounded-3xl shadow-soft border border-gray-100/50 relative overflow-hidden transition-all hover:shadow-hover">
        <div className="flex items-center gap-2.5 mb-6 text-earth-900 font-black text-xs uppercase tracking-[0.2em] opacity-80">
          <ShoppingCart size={18} className="text-earth-600" />
          <span>Vaša Korpa</span>
        </div>
        
        {(!cart || cart.items.length === 0) ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-center opacity-40">
            <ShoppingBasket size={48} strokeWidth={1} />
            <p className="text-sm font-medium italic">Vaša korpa je trenutno prazna</p>
          </div>
        ) : (
          <>
            <ul className="space-y-5 mb-8">
              {cart.items.map(item => (
                <li key={item.productId} className="flex justify-between items-start gap-4 text-sm group/item">
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 leading-tight mb-0.5 group-hover/item:text-agro-600 transition-colors">{item.productName}</div>
                    <div className="text-earth-600 font-medium tracking-tight bg-earth-50 px-2 py-0.5 rounded-full inline-block mt-1">
                      {item.quantity} × {item.price.toLocaleString('sr-RS')} <small>RSD</small>
                    </div>
                  </div>
                  <button onClick={() => onRemoveFromCart(item.productId)} className="text-gray-300 hover:text-red-500 hover:scale-125 transition-all mt-1">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="bg-gradient-to-br from-agro-600 to-agro-800 p-6 rounded-2xl text-white shadow-xl shadow-agro-600/20">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Ukupno za uplatu</span>
              </div>
              <div className="text-2xl font-black flex items-baseline gap-1">
                {cart.totalPrice.toLocaleString('sr-RS')}
                <span className="text-xs font-normal opacity-80">RSD</span>
              </div>
              <button className="w-full mt-4 py-3 bg-white text-agro-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-agro-50 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md">
                Kupi Odmah
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
