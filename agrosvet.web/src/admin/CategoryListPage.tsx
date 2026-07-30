import { useEffect, useState } from 'react';
import { ArrowRight, FolderTree, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import { Category } from '../types';
import { orderCategories } from './categoryTree';

export const CategoryListPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getCategories()
      .then(setCategories)
      .catch(() => setError('Kategorije trenutno ne mogu da se učitaju.'))
      .finally(() => setLoading(false));
  }, []);

  const categoryNames = new Map(categories.map(category => [category.id, category.name]));
  const childCounts = categories.reduce((counts, category) => {
    if (category.parentId !== null) counts.set(category.parentId, (counts.get(category.parentId) ?? 0) + 1);
    return counts;
  }, new Map<number, number>());

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Kategorije</h1>
        </div>
        <Link to="/admin/categories/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-agro-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-agro-900/15 transition hover:bg-agro-700 active:scale-[0.98]">
          <Plus size={18} /> Nova kategorija
        </Link>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <p className="text-sm font-black text-slate-700">Struktura kategorija</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{categories.length} ukupno</p>
        </div>

        {loading ? (
          <div className="p-14 text-center text-sm font-bold text-slate-400">Učitavanje kategorija...</div>
        ) : error ? (
          <div className="p-14 text-center text-sm font-bold text-red-600">{error}</div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-400"><FolderTree size={30} /></span>
            <h2 className="font-black text-slate-800">Još nema kategorija</h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">Napravite prvu kategoriju pre dodavanja proizvoda.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orderCategories(categories).map(({ category, depth }) => {
              const childCount = childCounts.get(category.id) ?? 0;
              return (
                <Link key={category.id} to={`/admin/categories/${category.id}/edit`} className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-agro-50/50 sm:px-5">
                  <div className="flex min-w-0 flex-1 items-center" style={{ paddingLeft: `${Math.min(depth, 5) * 24}px` }}>
                    {depth > 0 && <span className="mr-3 h-px w-4 shrink-0 bg-slate-300" />}
                    <span className={`mr-3 rounded-lg p-2 ${depth === 0 ? 'bg-agro-100 text-agro-700' : 'bg-slate-100 text-slate-500'}`}>
                      <FolderTree size={17} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-900">{category.name}</p>
                      <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
                        {category.parentId === null ? 'Glavna kategorija' : `Roditelj: ${categoryNames.get(category.parentId) ?? 'Nepoznata kategorija'}`}
                      </p>
                    </div>
                  </div>
                  {childCount > 0 && <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 sm:inline">{childCount} podkategorija</span>}
                  <ArrowRight className="shrink-0 text-slate-300 transition group-hover:text-agro-700" size={18} />
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
