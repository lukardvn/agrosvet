import { useEffect, useState } from 'react';
import { Boxes, ImageOff, Plus, Search, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useSnackbar } from '../components/SnackbarProvider';
import { adminApi } from '../services/adminApi';
import { Category, Product } from '../types';

export const ProductListPage = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    Promise.all([adminApi.getProducts(), adminApi.getCategories()])
      .then(([productData, categoryData]) => {
        setProducts(productData);
        setCategories(categoryData);
      })
      .catch(() => setError('Proizvodi trenutno ne mogu da se učitaju.'))
      .finally(() => setLoading(false));
  }, []);

  const deleteProduct = async (product: Product) => {
    setDeletingId(product.id);
    try {
      await adminApi.deleteProduct(product.id);
      setProducts(current => current.filter(item => item.id !== product.id));
      snackbar.success('Proizvod je obrisan.');
    } catch (requestError) {
      const message = requestError instanceof Error
        ? requestError.message
        : 'Proizvod trenutno ne može da se obriše.';
      snackbar.error(message, { title: 'Proizvod nije obrisan' });
    } finally {
      setDeletingId(null);
      setProductToDelete(null);
    }
  };

  const categoryNames = new Map(categories.map(category => [category.id, category.name]));
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('sr');
  const filteredProducts = products.filter(product => {
    const searchableText = `${product.name} ${product.description} ${categoryNames.get(product.categoryId) ?? ''}`
      .toLocaleLowerCase('sr');
    return searchableText.includes(normalizedQuery);
  });

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Proizvodi</h1>
        </div>
        <Link to="/admin/products/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-agro-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-agro-900/15 transition hover:bg-agro-700 active:scale-[0.98]">
          <Plus size={18} /> Novi proizvod
        </Link>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder="Pretraži naziv, opis ili kategoriju"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-agro-400 focus:bg-white focus:ring-4 focus:ring-agro-100"
            />
          </div>
          <p className="shrink-0 text-xs font-bold uppercase tracking-wider text-slate-400">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'proizvod' : 'proizvoda'}
          </p>
        </div>

        {loading ? (
          <div className="p-14 text-center text-sm font-bold text-slate-400">Učitavanje proizvoda...</div>
        ) : error ? (
          <div className="p-14 text-center text-sm font-bold text-red-600">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-400"><Boxes size={30} /></span>
            <h2 className="font-black text-slate-800">Nema pronađenih proizvoda</h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">Promenite unos pretrage ili dodajte prvi proizvod u katalog.</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Proizvod</th>
                    <th className="px-5 py-3">Kategorija</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Cena</th>
                      <th className="w-16 px-5 py-3"><span className="sr-only">Akcije</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(product => (
                    <tr
                      key={product.id}
                      tabIndex={0}
                      role="link"
                      onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                      onKeyDown={event => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          navigate(`/admin/products/${product.id}/edit`);
                        }
                      }}
                      className="group cursor-pointer transition-colors hover:bg-agro-50/40 focus:bg-agro-50/60 focus:outline-none"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            {product.imageUrl ? <img src={product.imageUrl} alt="" className="h-full w-full object-cover" /> : <ImageOff className="m-4 text-slate-300" />}
                          </div>
                          <p className="min-w-0 truncate font-black text-slate-900">{product.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm font-bold text-slate-600">{categoryNames.get(product.categoryId) ?? 'Bez kategorije'}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${product.status === 'active' ? 'bg-agro-100 text-agro-800' : 'bg-slate-100 text-slate-500'}`}>
                          {product.status === 'active' ? 'Aktivan' : 'Neaktivan'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-right font-black text-slate-900">{product.price.toLocaleString('sr-RS')} <span className="text-xs font-bold text-slate-400">RSD</span></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={event => { event.stopPropagation(); setProductToDelete(product); }}
                            onKeyDown={event => event.stopPropagation()}
                            disabled={deletingId !== null}
                            aria-label={`Obriši proizvod ${product.name}`}
                            title="Obriši proizvod"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 md:hidden">
              {filteredProducts.map(product => (
                <div key={product.id} className="flex items-center transition-colors hover:bg-agro-50">
                  <Link to={`/admin/products/${product.id}/edit`} className="flex min-w-0 flex-1 gap-3 p-4 pr-2">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {product.imageUrl ? <img src={product.imageUrl} alt="" className="h-full w-full object-cover" /> : <ImageOff className="m-5 text-slate-300" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-slate-900">{product.name}</p>
                      <p className="mt-1 text-xs font-bold text-agro-700">{categoryNames.get(product.categoryId) ?? 'Bez kategorije'}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <p className="font-black">{product.price.toLocaleString('sr-RS')} <span className="text-xs text-slate-400">RSD</span></p>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${product.status === 'active' ? 'bg-agro-100 text-agro-800' : 'bg-slate-100 text-slate-500'}`}>
                          {product.status === 'active' ? 'Aktivan' : 'Neaktivan'}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setProductToDelete(product)}
                    disabled={deletingId !== null}
                    aria-label={`Obriši proizvod ${product.name}`}
                    title="Obriši proizvod"
                    className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
      <ConfirmDialog
        open={productToDelete !== null}
        title="Obriši proizvod?"
        description={<>Proizvod <strong className="font-black text-slate-700">{productToDelete?.name}</strong> biće trajno obrisan. Ovu radnju nije moguće poništiti.</>}
        confirmLabel="Obriši proizvod"
        variant="danger"
        loading={deletingId !== null}
        onCancel={() => setProductToDelete(null)}
        onConfirm={() => productToDelete && deleteProduct(productToDelete)}
      />
    </div>
  );
};
