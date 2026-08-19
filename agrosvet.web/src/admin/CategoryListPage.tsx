import { useEffect, useState } from 'react';
import { ArrowRight, FolderTree, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import { ApiError } from '../services/apiClient';
import { Category } from '../types';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useSnackbar } from '../components/SnackbarProvider';
import { orderCategories } from './categoryTree';

export const CategoryListPage = () => {
  const snackbar = useSnackbar();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    adminApi.getCategories()
      .then(setCategories)
      .catch(() => setError('Kategorije trenutno ne mogu da se učitaju.'))
      .finally(() => setLoading(false));
  }, []);

  const deleteCategory = async (category: Category) => {
    setDeletingId(category.id);
    try {
      await adminApi.deleteCategory(category.id);
      setCategories(current => current.filter(item => item.id !== category.id));
      snackbar.success('Kategorija je obrisana.');
    } catch (requestError) {
      const message = requestError instanceof ApiError
        ? requestError.message
        : 'Kategorija trenutno ne može da se obriše.';
      snackbar.error(message, { title: 'Kategorija nije obrisana' });
    } finally {
      setDeletingId(null);
      setCategoryToDelete(null);
    }
  };

  const categoryNames = new Map(categories.map(category => [category.id, category.name]));

  return (
    <div className="mx-auto max-w-7xl">
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
              return (
                <div key={category.id} className="group flex items-center transition-colors hover:bg-agro-50/50">
                  <Link to={`/admin/categories/${category.id}/edit`} className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 sm:px-5">
                    <div className="flex min-w-0 flex-1 items-center" style={{ paddingLeft: `${Math.min(depth, 5) * 24}px` }}>
                      {depth > 0 && <span className="mr-3 h-px w-4 shrink-0 bg-slate-300" />}
                      <span className={`relative mr-3 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg ${depth === 0 ? 'bg-agro-100 text-agro-700' : 'bg-slate-100 text-slate-500'}`}>
                        <FolderTree size={17} />
                        {category.imageUrl && (
                          <img
                            src={category.imageUrl}
                            alt=""
                            onError={event => { event.currentTarget.style.display = 'none'; }}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-black text-slate-900">{category.name}</p>
                        <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
                          {category.parentId === null ? 'Glavna kategorija' : `Roditelj: ${categoryNames.get(category.parentId) ?? 'Nepoznata kategorija'}`}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="shrink-0 text-slate-300 transition group-hover:text-agro-700" size={18} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(category)}
                    disabled={deletingId !== null}
                    aria-label={`Obriši kategoriju ${category.name}`}
                    title="Obriši kategoriju"
                    className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 sm:mr-4"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <ConfirmDialog
        open={categoryToDelete !== null}
        title="Obriši kategoriju?"
        description={<>Kategorija <strong className="font-black text-slate-700">{categoryToDelete?.name}</strong> biće trajno obrisana. Ovu radnju nije moguće poništiti.</>}
        confirmLabel="Obriši kategoriju"
        variant="danger"
        loading={deletingId !== null}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={() => categoryToDelete && deleteCategory(categoryToDelete)}
      />
    </div>
  );
};
