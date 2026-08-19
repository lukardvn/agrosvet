import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, Check, FolderTree, ImageOff, LoaderCircle, Trash2, Upload } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import { Category } from '../types';
import { getDescendantIds, orderCategories } from './categoryTree';
import { useSnackbar } from '../components/SnackbarProvider';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const CategoryFormPage = () => {
  const { categoryId } = useParams();
  const isEditing = categoryId !== undefined;
  const parsedCategoryId = Number(categoryId);
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<{ name?: string; parentId?: string; image?: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
          setImagePreview(category.imageUrl);
        }
      })
      .catch(() => setPageError('Podaci za kategoriju ne mogu da se učitaju.'))
      .finally(() => setLoading(false));
  }, [isEditing, parsedCategoryId]);

  const blockedParentIds = isEditing
    ? new Set([parsedCategoryId, ...getDescendantIds(categories, parsedCategoryId)])
    : new Set<number>();
  const availableParents = orderCategories(categories).filter(({ category }) => !blockedParentIds.has(category.id));

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;
    setImageFile(file);
    setErrors(current => ({ ...current, image: undefined }));
    setImageFailed(false);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: { name?: string; parentId?: string; image?: string } = {};
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
      const input = { name: name.trim(), parentId: selectedParentId, imageFile: imageFile ?? undefined };
      if (isEditing) await adminApi.updateCategory(parsedCategoryId, input);
      else await adminApi.createCategory(input);
      snackbar.success(isEditing ? 'Izmene kategorije su sačuvane.' : 'Nova kategorija je dodata.');
      navigate('/admin/categories');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kategorija nije sačuvana.';
      setPageError(message);
      snackbar.error(message, { title: 'Kategorija nije sačuvana' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setPageError('');
    try {
      await adminApi.deleteCategory(parsedCategoryId);
      snackbar.success('Kategorija je obrisana.');
      navigate('/admin/categories');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kategorija trenutno ne može da se obriše.';
      setPageError(message);
      snackbar.error(message, { title: 'Kategorija nije obrisana' });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
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
    <div className="mx-auto max-w-5xl">
      <Link to="/admin/categories" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-agro-700">
        <ArrowLeft size={17} /> Nazad na kategorije
      </Link>

      <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5 sm:p-8">
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

        </div>

        <aside className="self-start space-y-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">Slika kategorije</p>
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-agro-100 text-agro-300">
              {imagePreview && !imageFailed
                ? <img src={imagePreview} alt="Pregled kategorije" onError={() => setImageFailed(true)} className="h-full w-full object-cover" />
                : <ImageOff size={42} strokeWidth={1.5} />}
            </div>
            {imageFailed && <p className="mt-2 text-xs font-bold text-red-600">Slika nije dostupna.</p>}
            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-agro-300 hover:bg-agro-50 hover:text-agro-700">
              <Upload size={17} />
              {imagePreview ? 'Zameni fotografiju' : 'Dodaj fotografiju'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={event => handleImageChange(event.target.files?.[0])}
                className="sr-only"
              />
            </label>
            {imageFile && <p className="mt-2 truncate text-xs text-slate-400">{imageFile.name}</p>}
            {errors.image && <p className="mt-2 text-xs font-bold text-red-600">{errors.image}</p>}
          </div>

          {pageError && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{pageError}</p>}
          <button disabled={saving || deleting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-agro-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-agro-900/15 transition hover:bg-agro-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? <LoaderCircle className="animate-spin" size={18} /> : <Check size={18} />}
            {saving ? 'Čuvanje...' : 'Sačuvaj kategoriju'}
          </button>
          <Link to="/admin/categories" className="block w-full rounded-xl px-5 py-3 text-center text-sm font-black text-slate-500 transition hover:bg-slate-200/60">Otkaži</Link>
          {isEditing && (
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={saving || deleting}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? <LoaderCircle className="animate-spin" size={18} /> : <Trash2 size={18} />}
              {deleting ? 'Brisanje...' : 'Obriši kategoriju'}
            </button>
          )}
        </aside>
      </form>
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Obriši kategoriju?"
        description={<>Kategorija <strong className="font-black text-slate-700">{name}</strong> biće trajno obrisana. Ovu radnju nije moguće poništiti.</>}
        confirmLabel="Obriši kategoriju"
        variant="danger"
        loading={deleting}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
