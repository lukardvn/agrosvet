import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, Check, FolderTree, LoaderCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import { Category } from '../types';
import { getDescendantIds, orderCategories } from './categoryTree';

export const CategoryFormPage = () => {
  const { categoryId } = useParams();
  const isEditing = categoryId !== undefined;
  const parsedCategoryId = Number(categoryId);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<{ name?: string; parentId?: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    const categoryRequest = isEditing && Number.isInteger(parsedCategoryId)
      ? adminApi.getCategory(parsedCategoryId)
      : Promise.resolve(null);

    Promise.all([adminApi.getCategories(), categoryRequest])
      .then(([categoryData, category]) => {
        setCategories(categoryData);
        if (isEditing && !category) {
          setPageError('Kategorija nije pronađena.');
          return;
        }
        if (category) {
          setName(category.name);
          setParentId(category.parentId?.toString() ?? '');
        }
      })
      .catch(() => setPageError('Podaci za kategoriju ne mogu da se učitaju.'))
      .finally(() => setLoading(false));
  }, [isEditing, parsedCategoryId]);

  const blockedParentIds = isEditing
    ? new Set([parsedCategoryId, ...getDescendantIds(categories, parsedCategoryId)])
    : new Set<number>();
  const availableParents = orderCategories(categories).filter(({ category }) => !blockedParentIds.has(category.id));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: { name?: string; parentId?: string } = {};
    const selectedParentId = parentId ? Number(parentId) : null;

    if (!name.trim()) nextErrors.name = 'Unesite naziv kategorije.';
    if (selectedParentId !== null && !availableParents.some(({ category }) => category.id === selectedParentId)) {
      nextErrors.parentId = 'Izaberite dozvoljenu roditeljsku kategoriju.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    setPageError('');
    try {
      const input = { name: name.trim(), parentId: selectedParentId };
      if (isEditing) await adminApi.updateCategory(parsedCategoryId, input);
      else await adminApi.createCategory(input);
      navigate('/admin/categories');
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Kategorija nije sačuvana.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-24 text-center text-sm font-bold text-slate-400">Učitavanje kategorije...</div>;

  if (pageError && isEditing && !name) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-10 text-center">
        <p className="font-bold text-red-700">{pageError}</p>
        <Link to="/admin/categories" className="mt-5 inline-flex font-black text-agro-700 hover:underline">Nazad na kategorije</Link>
      </div>
    );
  }

  const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-agro-400 focus:bg-white focus:ring-4 focus:ring-agro-100';

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/categories" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-agro-700">
        <ArrowLeft size={17} /> Nazad na kategorije
      </Link>

      <form onSubmit={handleSubmit} noValidate className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-8">
          <div className="mb-7 flex items-start gap-4 rounded-xl bg-agro-50 p-4">
            <span className="rounded-lg bg-white p-2 text-agro-700 shadow-sm"><FolderTree size={21} /></span>
            <p className="text-sm leading-relaxed text-agro-900">Izbor roditeljske kategorije određuje gde će se ova kategorija prikazati u strukturi kataloga.</p>
          </div>

          <div className="space-y-6">
            <label className="block text-sm font-black text-slate-700">
              Naziv kategorije
              <input
                value={name}
                onChange={event => { setName(event.target.value); setErrors(current => ({ ...current, name: undefined })); }}
                className={inputClass}
                autoFocus
              />
              {errors.name && <span className="mt-1.5 block text-xs font-bold text-red-600">{errors.name}</span>}
            </label>

            <label className="block text-sm font-black text-slate-700">
              Roditeljska kategorija
              <select
                value={parentId}
                onChange={event => { setParentId(event.target.value); setErrors(current => ({ ...current, parentId: undefined })); }}
                className={inputClass}
              >
                <option value="">Bez roditeljske kategorije</option>
                {availableParents.map(({ category, depth }) => (
                  <option key={category.id} value={category.id}>{`${'- '.repeat(depth)}${category.name}`}</option>
                ))}
              </select>
              {errors.parentId && <span className="mt-1.5 block text-xs font-bold text-red-600">{errors.parentId}</span>}
              {isEditing && <span className="mt-2 block text-xs leading-relaxed text-slate-400">Trenutna kategorija i njene podkategorije nisu dostupne kao roditelji.</span>}
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
          <Link to="/admin/categories" className="rounded-xl px-5 py-3 text-center text-sm font-black text-slate-500 transition hover:bg-slate-200">Otkaži</Link>
          <button disabled={saving} className="flex items-center justify-center gap-2 rounded-xl bg-agro-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-agro-900/15 transition hover:bg-agro-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? <LoaderCircle className="animate-spin" size={18} /> : <Check size={18} />}
            {saving ? 'Čuvanje...' : 'Sačuvaj kategoriju'}
          </button>
        </div>
        {pageError && <p className="border-t border-red-100 bg-red-50 p-3 text-center text-sm font-bold text-red-700">{pageError}</p>}
      </form>
    </div>
  );
};
