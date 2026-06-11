import React, { useState, useEffect } from 'react';
import { Filter, Trash2, ShoppingBasket, ShoppingCart, Tag, Coins, ChevronRight } from 'lucide-react';
import { Category, Cart } from '../types';

interface SidebarProps {
  className?: string;
  showCart?: boolean;
  categories: Category[];
  activeCategoryId: number | null;
  onCategorySelect: (id: number | null) => void;
  cart: Cart | null;
  onRemoveFromCart: (id: number) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  className = '',
  showCart = true,
  categories, 
  activeCategoryId, 
  onCategorySelect, 
  cart, 
  onRemoveFromCart,
  priceRange,
  onPriceRangeChange
}) => {
  const minLimit = 0;
  const maxLimit = 10000;

  // Local state to handle input values as strings to allow empty fields and avoid leading zero issues
  const [minPrice, setMinPrice] = useState(priceRange[0].toString());
  const [maxPrice, setMaxPrice] = useState(priceRange[1].toString());
  const minPercent = ((priceRange[0] - minLimit) / (maxLimit - minLimit)) * 100;
  const maxPercent = ((priceRange[1] - minLimit) / (maxLimit - minLimit)) * 100;

  // Update local state when parent state changes (e.g., reset filters)
  useEffect(() => {
    setMinPrice(priceRange[0].toString());
    setMaxPrice(priceRange[1].toString());
  }, [priceRange]);

  const handleMinChange = (value: string) => {
    // Only allow digits
    const cleanValue = value.replace(/\D/g, '');
    setMinPrice(cleanValue);
    const numericValue = cleanValue === '' ? minLimit : parseInt(cleanValue);
    onPriceRangeChange([Math.min(Math.max(numericValue, minLimit), priceRange[1]), priceRange[1]]);
  };

  const handleMaxChange = (value: string) => {
    // Only allow digits
    const cleanValue = value.replace(/\D/g, '');
    setMaxPrice(cleanValue);
    const numericValue = cleanValue === '' ? priceRange[0] : parseInt(cleanValue);
    onPriceRangeChange([priceRange[0], Math.max(Math.min(numericValue, maxLimit), priceRange[0])]);
  };

  const handleMinSliderChange = (value: string) => {
    const numericValue = Math.min(parseInt(value), priceRange[1]);
    onPriceRangeChange([numericValue, priceRange[1]]);
  };

  const handleMaxSliderChange = (value: string) => {
    const numericValue = Math.max(parseInt(value), priceRange[0]);
    onPriceRangeChange([priceRange[0], numericValue]);
  };

  return (
    <aside className={`w-full lg:w-80 flex flex-col gap-6 lg:gap-8 lg:shrink-0 ${className}`}>
      {/* Categories Section */}
      <div className="surface-card p-5 sm:p-7 rounded-3xl backdrop-blur-xl transition-all hover:shadow-hover">
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
      <div className="surface-card p-5 sm:p-7 rounded-3xl backdrop-blur-xl">
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
          <div className="relative h-6">
            <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gray-100" />
            <div 
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-agro-600"
              style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
            />
            <input 
              type="range" 
              min={minLimit}
              max={maxLimit}
              step="100"
              value={priceRange[0]}
              onChange={(e) => handleMinSliderChange(e.target.value)}
              className="range-control pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 appearance-none bg-transparent accent-agro-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20 [&::-moz-range-thumb]:pointer-events-auto"
              aria-label="Minimalna cena"
            />
            <input 
              type="range" 
              min={minLimit}
              max={maxLimit}
              step="100"
              value={priceRange[1]}
              onChange={(e) => handleMaxSliderChange(e.target.value)}
              className="range-control pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 appearance-none bg-transparent accent-agro-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30 [&::-moz-range-thumb]:pointer-events-auto"
              aria-label="Maksimalna cena"
            />
          </div>
          <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
            <span>0 RSD</span>
            <span>10,000+ RSD</span>
          </div>
        </div>
      </div>

      {/* Cart Section */}
      {showCart && (
        <div className="surface-card p-5 sm:p-7 rounded-3xl relative overflow-hidden transition-all hover:shadow-hover">
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
      )}
    </aside>
  );
};
