import { ClipboardList, ShoppingBag, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const menuItems = [
  { to: '/user', label: 'Moji podaci', icon: UserRound },
  { to: '/user/cart', label: 'Korpa', icon: ShoppingBag },
  { to: '/user/orders', label: 'Porudžbine', icon: ClipboardList },
];

export const UserMenu = () => (
  <div className="group relative">
    <Link
      to="/user"
      aria-label="Korisnički meni"
      className="block rounded-md p-2.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:p-3"
    >
      <UserRound size={20} />
    </Link>
    <div className="invisible absolute right-0 top-full z-50 w-56 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
      <div className="overflow-hidden rounded-md border border-agro-950/10 bg-white py-2 text-agro-950 shadow-xl shadow-agro-950/15">
        <p className="border-b border-agro-950/10 px-4 pb-3 pt-1 text-[10px] uppercase tracking-[0.14em] text-slate-400">Korisnički prostor</p>
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-agro-50">
              <Icon size={17} className="text-agro-700" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  </div>
);
