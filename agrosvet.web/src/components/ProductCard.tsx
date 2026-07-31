import React from 'react';
import { ImageOff, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
  onAddToCart: (id: number) => void;
  viewMode?: 'gallery' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, categoryName, onAddToCart, viewMode = 'gallery' }) => (
  <article className={`group min-w-0 ${viewMode === 'list' ? 'grid grid-cols-[112px_minmax(0,1fr)] gap-4 border-b border-agro-950/10 pb-5 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-7' : 'flex flex-col'}`}>
    <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-md bg-[#f3f3ef] text-agro-300 ${viewMode === 'list' ? 'self-start' : ''}`}>
      <ImageOff className="absolute" size={58} strokeWidth={1} />
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          onError={event => { event.currentTarget.style.display = 'none'; }}
          className="relative h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
        />
      )}
    </div>
    <div className={`flex min-w-0 flex-1 flex-col ${viewMode === 'list' ? 'py-1 sm:py-3' : 'pt-4'}`}>
      <p className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-agro-700">{categoryName || 'Proizvod'}</p>
      <h3 className={`line-clamp-2 text-sm font-medium leading-5 text-agro-950 ${viewMode === 'list' ? 'sm:text-base' : ''}`}>{product.name}</h3>
      <p className="mb-4 text-right text-base font-medium text-agro-950">{product.price.toLocaleString('sr-RS')} RSD</p>
      <div className={`mt-auto ${viewMode === 'list' ? 'max-w-56' : ''}`}>
        <button
          onClick={() => onAddToCart(product.id)}
          className="flex w-full items-center justify-center gap-2 rounded-[3px] bg-agro-900 px-4 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-agro-800 active:bg-agro-950"
        >
          <ShoppingBag size={15} />
          Dodaj u korpu
        </button>
      </div>
    </div>
  </article>
);
