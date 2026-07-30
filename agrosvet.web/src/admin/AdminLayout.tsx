import { Boxes, ChevronLeft, LayoutDashboard, Sprout, Tags } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
    isActive
      ? 'bg-agro-600 text-white shadow-lg shadow-agro-900/15'
      : 'text-slate-600 hover:bg-agro-50 hover:text-agro-800'
  }`;

export const AdminLayout = () => (
  <div className="admin-shell min-h-screen bg-[#f6f7f3] text-slate-900">
    <div className="mx-auto flex min-h-screen max-w-[1600px]">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-5 py-7 lg:flex lg:flex-col">
        <Link to="/" className="mb-10 flex items-center gap-3 px-2">
          <span className="rounded-xl bg-agro-600 p-2 text-white">
            <Sprout size={24} />
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight">Agrosvet</span>
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-agro-700">Administracija</span>
          </span>
        </Link>

        <nav className="space-y-2" aria-label="Administracija">
          <NavLink to="/admin/products" className={navItemClass}>
            <Boxes size={19} />
            Proizvodi
          </NavLink>
          <NavLink to="/admin/categories" className={navItemClass}>
            <Tags size={19} />
            Kategorije
          </NavLink>
        </nav>

        <div className="mt-auto border-t border-slate-100 pt-5">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-500 transition-colors hover:text-agro-700">
            <ChevronLeft size={17} />
            Nazad u prodavnicu
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-lg sm:px-6 lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 font-black">
              <span className="rounded-lg bg-agro-600 p-1.5 text-white"><Sprout size={19} /></span>
              Admin
            </Link>
            <Link to="/" aria-label="Nazad u prodavnicu" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <LayoutDashboard size={19} />
            </Link>
          </div>
          <nav className="mt-3 grid grid-cols-2 gap-2" aria-label="Administracija">
            <NavLink to="/admin/products" className={navItemClass}><Boxes size={17} /> Proizvodi</NavLink>
            <NavLink to="/admin/categories" className={navItemClass}><Tags size={17} /> Kategorije</NavLink>
          </nav>
        </header>

        <main className="px-4 py-7 sm:px-7 sm:py-10 xl:px-12">
          <Outlet />
        </main>
      </div>
    </div>
  </div>
);
