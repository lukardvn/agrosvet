import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, Check, ImageOff, LoaderCircle, Upload } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import { Category } from '../types';
import { orderCategories } from './categoryTree';
import { useSnackbar } from '../components/SnackbarProvider';

interface ProductFormState {
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  categoryId: string;
  status: 'active' | 'inactive';
}

const emptyForm: ProductFormState = { name: '', description: '', imageUrl: '', price: '', categoryId: '', status: 'active' };

export const ProductFormPage = () => {
  const { productId } = useParams();
  const isEditing = productId !== undefined;
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const [form, setForm] = useState(emptyForm);
  const [initialForm, setInitialForm] = useState<ProductFormState | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormState, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState('');
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const parsedId = Number(productId);
    const productRequest = isEditing && Number.isInteger(parsedId)
      ? adminApi.getProduct(parsedId)
      : Promise.resolve(null);

    Promise.all([adminApi.getCategories(), productRequest])
      .then(([categoryData, product]) => {
        setCategories(categoryData);
        if (isEditing && !product) {
          setPageError('Proizvod nije pronađen.');
          return;
        }
        if (product) {
          const productForm = {
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            price: product.price.toString(),
            categoryId: product.categoryId.toString(),
            status: product.status,
          };
          setForm(productForm);
          setInitialForm(productForm);
          setImagePreview(product.imageUrl);
        } else if (!isEditing) {
          setInitialForm(emptyForm);
        }
      })
      .catch(() => setPageError('Podaci za proizvod ne mogu da se učitaju.'))
      .finally(() => setLoading(false));
  }, [isEditing, productId]);

  const updateField = (field: keyof ProductFormState, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;
    setImageFile(file);
    setErrors(current => ({ ...current, imageUrl: undefined }));
    setImageFailed(false);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof ProductFormState, string>> = {};
    const price = Number(form.price.replace(',', '.'));
    if (!form.name.trim()) nextErrors.name = 'Unesite naziv proizvoda.';
    if (!Number.isFinite(price) || price <= 0) nextErrors.price = 'Cena mora biti veća od nule.';
    if (!form.categoryId || !categories.some(category => category.id === Number(form.categoryId))) {
      nextErrors.categoryId = 'Izaberite kategoriju.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setPageError('');
    const input = {
      name: form.name.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      imageFile: imageFile ?? undefined,
      price: Number(form.price.replace(',', '.')),
      categoryId: Number(form.categoryId),
      status: form.status,
    };

    try {
      if (isEditing) await adminApi.updateProduct(Number(productId), input);
      else await adminApi.createProduct(input);
      snackbar.success(isEditing ? 'Izmene proizvoda su sačuvane.' : 'Novi proizvod je dodat u ponudu.');
      navigate('/admin/products');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Proizvod nije sačuvan.';
      setPageError(message);
      snackbar.error(message, { title: 'Proizvod nije sačuvan' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-24 text-center text-sm font-bold text-slate-400">Učitavanje proizvoda...</div>;

  if (pageError && isEditing && !form.name) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-10 text-center">
        <p className="font-bold text-red-700">{pageError}</p>
        <Link to="/admin/products" className="mt-5 inline-flex font-black text-agro-700 hover:underline">Nazad na proizvode</Link>
      </div>
    );
  }

  const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-agro-400 focus:bg-white focus:ring-4 focus:ring-agro-100';
  const hasChanges = initialForm !== null && (JSON.stringify(form) !== JSON.stringify(initialForm) || imageFile !== null);

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/admin/products" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-agro-700">
        <ArrowLeft size={17} /> Nazad na proizvode
      </Link>

      <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <label className="block text-sm font-black text-slate-700">
            Naziv proizvoda
            <input value={form.name} onChange={event => updateField('name', event.target.value)} className={inputClass} autoFocus />
            {errors.name && <span className="mt-1.5 block text-xs font-bold text-red-600">{errors.name}</span>}
          </label>

          <label className="block text-sm font-black text-slate-700">
            Opis
            <textarea value={form.description} onChange={event => updateField('description', event.target.value)} rows={6} className={`${inputClass} resize-y`} />
            {errors.description && <span className="mt-1.5 block text-xs font-bold text-red-600">{errors.description}</span>}
          </label>

          <div className="grid gap-5 sm:grid-cols-3">
            <label className="block text-sm font-black text-slate-700">
              Cena (RSD)
              <input value={form.price} onChange={event => updateField('price', event.target.value)} inputMode="decimal" placeholder="0,00" className={inputClass} />
              {errors.price && <span className="mt-1.5 block text-xs font-bold text-red-600">{errors.price}</span>}
            </label>
            <label className="block text-sm font-black text-slate-700">
              Kategorija
              <select value={form.categoryId} onChange={event => updateField('categoryId', event.target.value)} className={inputClass}>
                <option value="">Izaberite kategoriju</option>
                {orderCategories(categories).map(({ category, depth }) => (
                  <option key={category.id} value={category.id}>{`${'- '.repeat(depth)}${category.name}`}</option>
                ))}
              </select>
              {errors.categoryId && <span className="mt-1.5 block text-xs font-bold text-red-600">{errors.categoryId}</span>}
            </label>
            <label className="block text-sm font-black text-slate-700">
              Status
              <button
                type="button"
                role="switch"
                aria-checked={form.status === 'active'}
                onClick={() => updateField('status', form.status === 'active' ? 'inactive' : 'active')}
                className="mt-2 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-slate-300"
              >
                <span className={`text-sm font-bold ${form.status === 'active' ? 'text-agro-700' : 'text-slate-500'}`}>
                  {form.status === 'active' ? 'Aktivan' : 'Neaktivan'}
                </span>
                <span className={`relative block h-6 w-11 shrink-0 rounded-full transition-colors ${form.status === 'active' ? 'bg-agro-600' : 'bg-slate-300'}`}>
                  <span className={`absolute left-1 top-1 block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${form.status === 'active' ? 'translate-x-5' : 'translate-x-0'}`} />
                </span>
              </button>
            </label>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">Pregled slike</p>
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-300">
              {imagePreview && !imageFailed
                ? <img src={imagePreview} alt="Pregled proizvoda" onError={() => setImageFailed(true)} className="h-full w-full object-cover" />
                : <ImageOff size={38} strokeWidth={1.5} />}
            </div>
            {imageFailed && <p className="mt-2 text-xs font-bold text-red-600">Slika sa ove adrese nije dostupna.</p>}
            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-agro-300 hover:bg-agro-50 hover:text-agro-700">
              <Upload size={17} />
              {imagePreview ? 'Zameni fotografiju' : 'Dodaj fotografiju'}
              <input type="file" accept="image/*" onChange={event => handleImageChange(event.target.files?.[0])} className="sr-only" />
            </label>
            {imageFile && <p className="mt-2 truncate text-xs text-slate-400">{imageFile.name}</p>}
          </div>

          {pageError && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{pageError}</p>}
          <button disabled={saving || !hasChanges} className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 enabled:bg-agro-600 enabled:text-white enabled:shadow-lg enabled:shadow-agro-900/15 enabled:hover:bg-agro-700">
            {saving ? <LoaderCircle className="animate-spin" size={18} /> : <Check size={18} />}
            {saving ? 'Čuvanje...' : hasChanges ? 'Sačuvaj izmene' : 'Nema izmena'}
          </button>
          <Link to="/admin/products" className="block w-full rounded-xl px-5 py-3 text-center text-sm font-black text-slate-500 transition hover:bg-slate-200/60">Otkaži</Link>
        </aside>
      </form>
    </div>
  );
};
