import { ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserOrdersPage = () => (
  <div className="border-y border-agro-950/10 py-14 text-center">
    <ClipboardList className="mx-auto text-slate-300" size={38} strokeWidth={1.3} />
    <h2 className="mt-4 text-xl font-normal text-agro-950">Još nema porudžbina.</h2>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Kada uvedemo korisničke naloge, ovde ćete moći da pratite prethodne i aktivne porudžbine.</p>
    <Link to="/proizvodi" className="mt-6 inline-block text-xs uppercase tracking-[0.12em] text-agro-800 hover:underline">Pogledajte ponudu</Link>
  </div>
);
