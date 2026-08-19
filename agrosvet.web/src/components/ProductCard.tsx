import React, { useEffect, useState } from 'react';
import { ImageOff, LoaderCircle, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
  quantity: number;
  onAddToCart: (id: number) => Promise<boolean>;
  onUpdateQuantity: (id: number, quantity: number) => Promise<void>;
  onRemoveFromCart: (id: number) => Promise<boolean>;
  viewMode?: 'gallery' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categoryName,
  quantity,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  viewMode = 'gallery',
}) => {
  const [expanded, setExpanded] = useState(quantity > 0);
  const [draftQuantity, setDraftQuantity] = useState(Math.max(1, quantity).toString());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setExpanded(quantity > 0);
    if (quantity > 0) setDraftQuantity(quantity.toString());
  }, [quantity]);

  const addProduct = async () => {
    setExpanded(true);
    setSaving(true);
    const added = await onAddToCart(product.id);
    if (!added) setExpanded(false);
    setSaving(false);
  };

  const updateQuantity = async (nextQuantity: number) => {
    if (!Number.isInteger(nextQuantity) || nextQuantity < 1 || nextQuantity === quantity) {
      setDraftQuantity(Math.max(1, quantity).toString());
      return;
    }

    setDraftQuantity(nextQuantity.toString());
    setSaving(true);
    try {
      await onUpdateQuantity(product.id, nextQuantity);
    } catch {
      setDraftQuantity(Math.max(1, quantity).toString());
    } finally {
      setSaving(false);
    }
  };

  const decreaseQuantity = async () => {
    if (quantity > 1) {
      await updateQuantity(quantity - 1);
      return;
    }

    setExpanded(false);
    setSaving(true);
    const removed = await onRemoveFromCart(product.id);
    if (!removed) setExpanded(true);
    setSaving(false);
  };

  return (
  <article className={`group min-w-0 ${viewMode === 'list' ? 'grid grid-cols-[112px_minmax(0,1fr)] gap-4 border-b border-agro-950/10 pb-5 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-7' : 'flex flex-col'}`}>
    <Link to={`/proizvodi/${product.id}`} className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-md bg-[#f3f3ef] text-agro-300 ${viewMode === 'list' ? 'self-start' : ''}`}>
      <ImageOff className="absolute" size={58} strokeWidth={1} />
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          onError={event => { event.currentTarget.style.display = 'none'; }}
          className="relative h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
        />
      )}
    </Link>
    <div className={`flex min-w-0 flex-1 flex-col ${viewMode === 'list' ? 'py-1 sm:py-3' : 'pt-4'}`}>
      <p className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-agro-700">{categoryName || 'Proizvod'}</p>
      <h3 className={`line-clamp-2 text-sm font-medium leading-5 text-agro-950 ${viewMode === 'list' ? 'sm:text-base' : ''}`}>
        <Link to={`/proizvodi/${product.id}`} className="transition-opacity hover:opacity-60">{product.name}</Link>
      </h3>
      <p className="mb-4 text-right text-base font-medium text-agro-950">{product.price.toLocaleString('sr-RS')} RSD</p>
      <div className={`mt-auto ${viewMode === 'list' ? 'max-w-56' : ''}`}>
        <div className="relative h-11 overflow-hidden rounded-[3px]">
          <button
            type="button"
            onClick={addProduct}
            disabled={saving}
            className={`absolute inset-0 flex w-full items-center justify-center gap-2 bg-agro-900 px-4 text-xs font-medium uppercase tracking-[0.08em] text-white transition-all duration-300 ease-out hover:bg-agro-800 active:bg-agro-950 disabled:cursor-wait ${expanded ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
          >
            <ShoppingBag size={15} />
            Dodaj u korpu
          </button>

          <div className={`absolute inset-0 grid grid-cols-[44px_minmax(0,1fr)_44px] border border-agro-950/15 bg-white transition-all duration-300 ease-out ${expanded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={saving || quantity < 1}
              aria-label="Smanji količinu"
              className="flex items-center justify-center text-agro-950 transition-colors hover:bg-agro-50 disabled:cursor-wait disabled:text-slate-300"
            >
              <Minus size={15} />
            </button>
            <div className="relative border-x border-agro-950/10">
              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={draftQuantity}
                disabled={saving || quantity < 1}
                onChange={event => setDraftQuantity(event.target.value)}
                onBlur={() => updateQuantity(Number(draftQuantity))}
                onKeyDown={event => {
                  if (event.key === 'Enter') event.currentTarget.blur();
                  if (event.key === 'Escape') {
                    setDraftQuantity(Math.max(1, quantity).toString());
                    event.currentTarget.blur();
                  }
                }}
                aria-label="Količina"
                className="quantity-input h-full w-full bg-transparent text-center text-sm text-agro-950 outline-none disabled:text-transparent"
              />
              {saving && <LoaderCircle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-agro-700" size={15} />}
            </div>
            <button
              type="button"
              onClick={() => updateQuantity(quantity + 1)}
              disabled={saving || quantity < 1}
              aria-label="Povećaj količinu"
              className="flex items-center justify-center text-agro-950 transition-colors hover:bg-agro-50 disabled:cursor-wait disabled:text-slate-300"
            >
              <Plus size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </article>
  );
};
