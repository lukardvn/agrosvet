import { useEffect } from 'react';
import { ArrowLeft, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  useEffect(() => {
    const previousTitle = document.title;
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'noindex, follow';
    document.head.appendChild(robotsMeta);
    document.title = 'Stranica nije pronađena | Agrosvet';

    return () => {
      document.title = previousTitle;
      robotsMeta.remove();
    };
  }, []);

  return (
    <section className="flex min-h-[60vh] items-center justify-center py-16 text-center">
      <div className="max-w-xl">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-agro-100 text-agro-800">
          <Sprout size={27} />
        </div>
        <p className="text-sm uppercase tracking-[0.2em] text-agro-700">Greška 404</p>
        <h1 className="mt-4 text-4xl font-normal tracking-tight text-agro-950 sm:text-5xl">Ova stranica nije pronađena.</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-slate-500">
          Adresa je možda promenjena ili stranica više nije dostupna. Vratite se na početnu stranicu ili pogledajte našu ponudu.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-agro-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-agro-800">
            <ArrowLeft size={15} /> Početna stranica
          </Link>
          <Link to="/proizvodi" className="inline-flex items-center justify-center rounded-[3px] border border-agro-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-agro-900 transition-colors hover:bg-agro-50">
            Pogledajte ponudu
          </Link>
        </div>
      </div>
    </section>
  );
};
