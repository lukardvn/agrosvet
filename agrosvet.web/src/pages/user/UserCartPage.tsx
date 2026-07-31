import { ImageOff, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Cart, Product } from '../../types';

interface UserCartPageProps {
  cart: Cart | null;
  products: Product[];
  onRemoveFromCart: (id: number) => void;
}

export const UserCartPage = ({ cart, products, onRemoveFromCart }: UserCartPageProps) => {
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
                <p className="mt-2 text-xs text-slate-500">Količina: {item.quantity}</p>
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
