import { ImageOff, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Cart, Product } from '../types';

interface CartMenuProps {
  cart: Cart | null;
  products: Product[];
  dark?: boolean;
}

export const CartMenu = ({ cart, products, dark = false }: CartMenuProps) => {
  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return (
    <div className="group relative">
      <Link
        to="/user/cart"
        aria-label="Korpa"
        className={`flex items-center gap-2 rounded-md border px-3 py-2.5 transition-colors sm:gap-3 sm:px-5 ${dark ? 'border-agro-950/20 bg-white/15 text-agro-950 hover:bg-white/30' : 'border-white/20 bg-white/5 text-white hover:bg-white/10'}`}
      >
        <ShoppingCart size={20} className={dark ? 'text-agro-950/75' : 'text-agro-200'} />
        <span className="hidden text-sm sm:inline">{cart?.totalPrice.toLocaleString('sr-RS') ?? 0} <small className="opacity-60">RSD</small></span>
        {itemCount > 0 && (
          <span className={`-ml-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] ${dark ? 'bg-agro-950 text-white' : 'bg-white text-agro-950'}`}>{itemCount}</span>
        )}
      </Link>

      <div className="invisible absolute right-0 top-full z-50 w-80 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="rounded-md border border-agro-950/10 bg-white p-4 text-agro-950 shadow-xl shadow-agro-950/15">
          <div className="mb-3 flex items-center justify-between border-b border-agro-950/10 pb-3">
            <span className="text-sm font-medium">Korpa</span>
            <span className="text-xs text-slate-400">{itemCount} artikala</span>
          </div>

          {!cart || cart.items.length === 0 ? (
            <div className="py-6 text-center">
              <ShoppingCart className="mx-auto text-slate-300" size={28} strokeWidth={1.4} />
              <p className="mt-3 text-sm text-slate-500">Korpa je prazna.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.items.slice(0, 3).map(item => {
                const product = products.find(candidate => candidate.id === item.productId);
                return (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-[#f3f3ef] text-slate-300">
                      <ImageOff size={18} />
                      {product?.imageUrl && <img src={product.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-agro-950">{item.productName}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{item.quantity} × {item.price.toLocaleString('sr-RS')} RSD</p>
                    </div>
                  </div>
                );
              })}
              {cart.items.length > 3 && <p className="text-xs text-slate-400">Još {cart.items.length - 3} proizvoda</p>}
            </div>
          )}

          <div className="mt-4 border-t border-agro-950/10 pt-4">
            <div className="mb-4 flex justify-between text-sm">
              <span className="text-slate-500">Ukupno</span>
              <span className="font-medium">{cart?.totalPrice.toLocaleString('sr-RS') ?? 0} RSD</span>
            </div>
            <Link to="/user/cart" className="block rounded-[3px] bg-agro-900 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-agro-800">
              Pogledajte korpu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
