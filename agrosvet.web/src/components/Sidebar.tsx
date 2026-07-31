import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  className?: string;
  categories: Category[];
  activeCategoryId: number | null;
  onCategorySelect: (id: number | null) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  className = '',
  categories, 
  activeCategoryId, 
  onCategorySelect, 
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
    <aside className={`flex w-full flex-col lg:w-60 lg:shrink-0 ${className}`}>
      {/* Categories Section */}
      <div className="border-y border-agro-950/15 py-3">
        <div className="mb-2.5 flex items-center text-xs font-medium uppercase tracking-[0.12em] text-agro-950">
          <span>Kategorije</span>
        </div>
        <ul className="space-y-0.5">
          <li>
            <button 
              onClick={() => onCategorySelect(null)}
              className={`group flex w-full items-center gap-2.5 py-1 text-left text-sm transition-colors ${!activeCategoryId ? 'text-agro-950' : 'text-slate-500 hover:text-agro-950'}`}
            >
              <span className={`flex h-4 w-4 items-center justify-center border ${!activeCategoryId ? 'border-agro-900 bg-agro-900' : 'border-slate-300'}`}>
                {!activeCategoryId && <span className="h-1.5 w-1.5 bg-white" />}
              </span>
              <span>Sve ponude</span>
            </button>
          </li>
          {categories.map(category => (
            <li key={category.id}>
              <button 
                onClick={() => onCategorySelect(category.id)}
                className={`group flex w-full items-center gap-2.5 py-1 text-left text-sm transition-colors ${activeCategoryId === category.id ? 'text-agro-950' : 'text-slate-500 hover:text-agro-950'}`}
              >
                <span className={`flex h-4 w-4 items-center justify-center border ${activeCategoryId === category.id ? 'border-agro-900 bg-agro-900' : 'border-slate-300'}`}>
                  {activeCategoryId === category.id && <span className="h-1.5 w-1.5 bg-white" />}
                </span>
                <span>{category.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter Section */}
      <div className="border-b border-agro-950/15 py-3">
        <div className="mb-3 flex items-center text-xs font-medium uppercase tracking-[0.12em] text-agro-950">
          <span>Opseg Cene (RSD)</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Od</label>
              <input 
                type="text" 
                inputMode="numeric"
                value={minPrice} 
                onChange={(e) => handleMinChange(e.target.value)}
                className="w-full rounded-[3px] border border-slate-300 bg-white px-3 py-2 text-xs focus:border-agro-700 focus:outline-none"
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
                className="w-full rounded-[3px] border border-slate-300 bg-white px-3 py-2 text-xs focus:border-agro-700 focus:outline-none"
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

    </aside>
  );
};
