import { KeyboardEvent, useEffect, useState } from 'react';
import { ImageOff, LoaderCircle, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Cart, Product } from '../../types';

interface UserCartPageProps {
  cart: Cart | null;
  products: Product[];
  onRemoveFromCart: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => Promise<void>;
}

interface QuantityControlProps {
  quantity: number;
  onChange: (quantity: number) => Promise<void>;
}

const QuantityControl = ({ quantity, onChange }: QuantityControlProps) => {
  const [value, setValue] = useState(quantity.toString());
  const [saving, setSaving] = useState(false);

  useEffect(() => setValue(quantity.toString()), [quantity]);

  const commit = async (nextQuantity: number) => {
    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
      setValue(quantity.toString());
      return;
    }
    if (nextQuantity === quantity) {
      setValue(quantity.toString());
      return;
    }

    setValue(nextQuantity.toString());
    setSaving(true);
    try {
      await onChange(nextQuantity);
    } catch {
      setValue(quantity.toString());
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') event.currentTarget.blur();
    if (event.key === 'Escape') {
      setValue(quantity.toString());
      event.currentTarget.blur();
    }
  };

  return (
    <div className="mt-3 flex w-fit items-center rounded-sm border border-agro-950/15 bg-white">
      <button
        type="button"
        onClick={() => commit(quantity - 1)}
        disabled={saving || quantity <= 1}
        aria-label="Smanji količinu"
        className="flex h-9 w-9 items-center justify-center text-agro-950 transition-colors hover:bg-agro-50 disabled:cursor-not-allowed disabled:text-slate-300"
      >
        <Minus size={14} />
      </button>
      <div className="relative h-9 w-12 border-x border-agro-950/10">
        <input
          type="number"
          min="1"
          inputMode="numeric"
          value={value}
          disabled={saving}
          onChange={event => setValue(event.target.value)}
          onBlur={() => commit(Number(value))}
          onKeyDown={handleKeyDown}
          aria-label="Količina"
          className="quantity-input h-full w-full bg-transparent px-1 text-center text-sm text-agro-950 outline-none disabled:text-transparent"
        />
        {saving && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LoaderCircle className="animate-spin text-agro-700" size={15} />
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => commit(quantity + 1)}
        disabled={saving}
        aria-label="Povećaj količinu"
        className="flex h-9 w-9 items-center justify-center text-agro-950 transition-colors hover:bg-agro-50 disabled:cursor-not-allowed disabled:text-slate-300"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export const UserCartPage = ({ cart, products, onRemoveFromCart, onUpdateQuantity }: UserCartPageProps) => {
  if (!cart || cart.items.length === 0) {
    return (
      <div className="border-y border-agro-950/10 py-14 text-center">
        <ShoppingBag className="mx-auto text-slate-300" size={38} strokeWidth={1.3} />
        <h2 className="mt-4 text-xl font-normal text-agro-950">Vaša korpa je prazna.</h2>
        <Link to="/proizvodi" className="mt-6 inline-block rounded-[3px] bg-agro-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-agro-800">Pogledajte ponudu</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="divide-y divide-agro-950/10 border-y border-agro-950/10">
        {cart.items.map(item => {
          const product = products.find(candidate => candidate.id === item.productId);
          return (
            <div key={item.productId} className="flex gap-4 py-5 sm:gap-5">
              <Link to={`/proizvodi/${item.productId}`} className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-[#f3f3ef] text-slate-300 sm:h-28 sm:w-28">
                <ImageOff size={27} />
                {product?.imageUrl && <img src={product.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />}
              </Link>
              <div className="min-w-0 flex-1 py-1">
                <Link to={`/proizvodi/${item.productId}`} className="text-sm font-medium text-agro-950 hover:opacity-60">{item.productName}</Link>
                <QuantityControl
                  quantity={item.quantity}
                  onChange={quantity => onUpdateQuantity(item.productId, quantity)}
                />
                <p className="mt-3 text-base text-agro-950">{(item.price * item.quantity).toLocaleString('sr-RS')} RSD</p>
              </div>
              <button onClick={() => onRemoveFromCart(item.productId)} aria-label={`Ukloni ${item.productName}`} className="self-start p-2 text-slate-300 transition-colors hover:text-red-600">
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>

      <aside className="h-fit rounded-sm bg-[#f3f3ef] p-5">
        <h2 className="text-base font-medium text-agro-950">Pregled korpe</h2>
        <div className="mt-5 flex justify-between border-t border-agro-950/10 pt-4 text-sm">
          <span className="text-slate-500">Ukupno</span>
          <span className="font-medium text-agro-950">{cart.totalPrice.toLocaleString('sr-RS')} RSD</span>
        </div>
        <Link to="/user" className="mt-6 block rounded-[3px] bg-agro-900 px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-agro-800">
          Podaci za kupovinu
        </Link>
      </aside>
    </div>
  );
};
