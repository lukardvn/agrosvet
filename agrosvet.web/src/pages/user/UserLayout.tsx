import { NavLink, Outlet } from 'react-router-dom';
import { Breadcrumbs } from '../../components/Breadcrumbs';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 px-1 pb-3 text-sm transition-colors ${isActive ? 'border-agro-900 text-agro-950' : 'border-transparent text-slate-400 hover:text-agro-800'}`;

export const UserLayout = () => (
  <section className="mx-auto max-w-5xl pb-12 pt-2">
    <Breadcrumbs items={[{ label: 'Početna', to: '/' }, { label: 'Korisnički prostor' }]} />
    <h1 className="mt-5 text-3xl font-normal tracking-tight text-agro-950 sm:text-4xl">Korisnički prostor</h1>
    <p className="mt-2 text-sm text-slate-500">Podaci se trenutno čuvaju samo na ovom uređaju.</p>

    <nav className="mt-8 flex gap-6 border-b border-agro-950/10" aria-label="Korisničke stranice">
      <NavLink to="/user" end className={navClass}>Moji podaci</NavLink>
      <NavLink to="/user/cart" className={navClass}>Korpa</NavLink>
      <NavLink to="/user/orders" className={navClass}>Porudžbine</NavLink>
    </nav>

    <div className="pt-8"><Outlet /></div>
  </section>
);
