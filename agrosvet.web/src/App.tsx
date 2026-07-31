import React, { useEffect, useState } from 'react';
import { Sprout, Search, Phone, MapPin, ChevronDown, Grid2X2, Rows3, SlidersHorizontal } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { ProductCard } from './components/ProductCard';
import { Breadcrumbs, BreadcrumbItem } from './components/Breadcrumbs';
import { UserMenu } from './components/UserMenu';
import { CartMenu } from './components/CartMenu';
import { Sidebar } from './components/Sidebar';
import { useAgroApi } from './hooks/useAgroApi';
import { AboutUs } from './pages/AboutUs';
import { Delivery } from './pages/Delivery';
import { Contact } from './pages/Contact';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { ProductDetail } from './pages/ProductDetail';
import { UserLayout } from './pages/user/UserLayout';
import { UserInfoPage } from './pages/user/UserInfoPage';
import { UserCartPage } from './pages/user/UserCartPage';
import { UserOrdersPage } from './pages/user/UserOrdersPage';
import { AdminLayout } from './admin/AdminLayout';
import { ProductListPage } from './admin/ProductListPage';
import { ProductFormPage } from './admin/ProductFormPage';
import { CategoryListPage } from './admin/CategoryListPage';
import { CategoryFormPage } from './admin/CategoryFormPage';

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'default';

const MainShop: React.FC<{ 
  products: any[], 
  categories: any[], 
  addToCart: (id: number) => void, 
  searchQuery: string,
  onSearchQueryChange: (query: string) => void
}> = ({ products, categories, addToCart, searchQuery, onSearchQueryChange }) => {
  const [searchParams] = useSearchParams();
  const requestedCategory = searchParams.get('category');
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');

  useEffect(() => {
    const categoryId = Number(requestedCategory);
    setActiveCategoryId(requestedCategory && Number.isInteger(categoryId) ? categoryId : null);
  }, [requestedCategory]);

  const filteredProducts = products
    .filter(p => !activeCategoryId || p.categoryId === activeCategoryId)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });

  const activeCategoryName = activeCategoryId
    ? categories.find(category => category.id === activeCategoryId)?.name
    : undefined;
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Početna', to: '/' },
    activeCategoryName || searchQuery
      ? { label: 'Proizvodi', to: '/proizvodi' }
      : { label: 'Proizvodi' },
  ];
  if (activeCategoryName) breadcrumbItems.push({ label: activeCategoryName });
  else if (searchQuery) breadcrumbItems.push({ label: 'Rezultati pretrage' });

  return (
    <>
      <div className="mb-6 pt-2 sm:mb-8">
        <Breadcrumbs items={breadcrumbItems} />
        <h2 className="mt-3 text-3xl font-normal tracking-tight text-agro-950 md:text-4xl">
          {activeCategoryId
            ? categories.find(c => c.id === activeCategoryId)?.name
            : searchQuery
              ? `Rezultati za "${searchQuery}"`
              : 'Aktuelna ponuda'}
        </h2>
      </div>

      <header className="mb-7 flex items-center justify-between gap-3 border-y border-agro-950/15 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFiltersVisible(visible => !visible)}
            className="hidden items-center gap-2 text-xs text-agro-950 transition-opacity hover:opacity-60 lg:flex"
            aria-expanded={filtersVisible}
          >
            <SlidersHorizontal size={15} />
            {filtersVisible ? 'Sakrij filtere' : 'Prikaži filtere'}
          </button>
          <button
            onClick={() => setFiltersOpen(open => !open)}
            className="flex items-center gap-2 text-xs text-agro-950 lg:hidden"
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal size={15} />
            Filteri
          </button>
          <span className="hidden h-4 w-px bg-agro-950/15 sm:block" />
          <p className="hidden text-xs text-slate-500 sm:block">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'proizvod' : 'proizvoda'}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-slate-500 sm:inline">Sortiraj po</span>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                aria-label="Sortiraj proizvode"
                className="h-8 appearance-none border-0 bg-transparent py-0 pl-1 pr-7 text-xs text-agro-950 outline-none"
              >
                <option value="default">Preporučeno</option>
                <option value="price-asc">Ceni: Niža ka višoj</option>
                <option value="price-desc">Ceni: Viša ka nižoj</option>
                <option value="name-asc">Nazivu: A - Z</option>
                <option value="name-desc">Nazivu: Z - A</option>
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <span className="hidden text-xs text-slate-500 md:inline">Prikaz</span>
            <button
              onClick={() => setViewMode('gallery')}
              className={`p-1.5 transition-opacity ${viewMode === 'gallery' ? 'text-agro-950' : 'text-slate-300 hover:text-slate-500'}`}
              aria-label="Prikaži kao galeriju"
              aria-pressed={viewMode === 'gallery'}
            >
              <Grid2X2 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-opacity ${viewMode === 'list' ? 'text-agro-950' : 'text-slate-300 hover:text-slate-500'}`}
              aria-label="Prikaži kao listu"
              aria-pressed={viewMode === 'list'}
            >
              <Rows3 size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-stretch gap-5 pb-5 md:pb-10 lg:flex-row lg:items-start lg:gap-8">
        {filtersVisible && (
          <Sidebar
            className="hidden lg:flex"
            categories={categories}
            activeCategoryId={activeCategoryId}
            onCategorySelect={setActiveCategoryId}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="mb-6 lg:hidden">
            {filtersOpen && (
              <div className="space-y-4">
                <Sidebar 
                  className="lg:hidden"
                  categories={categories}
                  activeCategoryId={activeCategoryId}
                  onCategorySelect={(id) => {
                    setActiveCategoryId(id);
                    setFiltersOpen(false);
                  }}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                />
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full rounded-2xl bg-agro-600 px-5 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-agro-600/20 transition-all active:scale-[0.98]"
                >
                  Prikaži proizvode
                </button>
              </div>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className={viewMode === 'gallery'
              ? `grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 ${filtersVisible ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'}`
              : 'space-y-5'}>
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  categoryName={categories.find(c => c.id === product.categoryId)?.name}
                  onAddToCart={addToCart}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 md:p-20 text-center shadow-soft border border-dashed border-gray-200">
               <Search size={64} className="mx-auto text-gray-200 mb-6" strokeWidth={1} />
               <h3 className="text-xl font-bold text-gray-800 mb-2">Nema rezultata</h3>
               <p className="text-gray-500 max-w-sm mx-auto">Nismo pronašli nijedan proizvod koji odgovara vašoj pretrazi ili opsegu cene. Pokušajte sa drugim ključnim rečima.</p>
               <button 
                 onClick={() => {onSearchQueryChange(''); setActiveCategoryId(null); setPriceRange([0, 10000]); setSortOption('default');}}
                className="mt-8 text-agro-600 font-bold hover:underline"
               >
                 Poništi sve filtere
               </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Storefront: React.FC = () => {
  const { products, categories, cart, loading, addToCart, removeFromCart } = useAgroApi();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (location.pathname !== '/proizvodi') setSearchQuery('');
  }, [location.pathname]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-agro-50 text-agro-600 gap-4">
      <Sprout size={64} className="animate-pulse duration-700" strokeWidth={1} />
      <div className="text-sm font-black uppercase tracking-[0.3em] opacity-60">Agrosvet učitava...</div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans selection:bg-agro-200 selection:text-agro-950">
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-agro-900 text-white">
          <div className="container relative mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:px-6 sm:py-4">
            <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3 group cursor-pointer">
              <div className="shrink-0 rounded-md border border-white/20 bg-white/10 p-2 transition-colors duration-300 group-hover:bg-white/15">
                <Sprout size={24} className="text-white sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-medium tracking-tight text-white sm:text-xl">Agrosvet</h1>
                <div className="-mt-1 hidden truncate text-[9px] uppercase tracking-widest text-agro-200 sm:block">Poljoprivredna Apoteka</div>
              </div>
            </Link>

            {location.pathname === '/proizvodi' && (
              <div className="group relative order-3 w-full sm:order-none sm:mx-4 sm:max-w-xl sm:flex-1 lg:absolute lg:left-1/2 lg:top-1/2 lg:mx-0 lg:w-[min(42vw,36rem)] lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-1/2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/55 transition-colors group-focus-within:text-white" size={17} />
                <input
                  type="search"
                  placeholder="Pretraži proizvode..."
                  className="w-full rounded-md border border-white/20 bg-white/10 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/45 hover:border-white/30 hover:bg-white/15 focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-white/10"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                />
              </div>
            )}

            <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-4">
              <UserMenu />
              <div className="mx-2 hidden h-8 w-px bg-white/15 sm:block" />
              <CartMenu cart={cart} products={products} />
            </div>
          </div>
        </nav>

        <main className="flex-1 py-4 md:py-5">
          <div className="container mx-auto px-4 sm:px-6">
            <Routes>
              <Route path="/" element={<Home categories={categories} products={products} onAddToCart={addToCart} />} />
              <Route path="/proizvodi" element={
                <MainShop 
                  products={products} 
                  categories={categories} 
                  addToCart={addToCart}
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                 />
              } />
              <Route path="/proizvodi/:productId" element={
                <ProductDetail products={products} categories={categories} onAddToCart={addToCart} />
              } />
              <Route path="/o-nama" element={<AboutUs />} />
              <Route path="/dostava" element={<Delivery />} />
              <Route path="/kontakt" element={<Contact />} />
              <Route path="/user" element={<UserLayout />}>
                <Route index element={<UserInfoPage />} />
                <Route path="cart" element={<UserCartPage cart={cart} products={products} onRemoveFromCart={removeFromCart} />} />
                <Route path="orders" element={<UserOrdersPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>

        <footer className={`${location.pathname === '/' ? '' : 'mt-12'} bg-agro-900 py-12 text-white`}>
          <div className="container mx-auto grid grid-cols-1 gap-12 px-6 text-left md:grid-cols-4">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="rounded-md border border-white/20 bg-white/10 p-1.5"><Sprout size={20} className="text-white" /></div>
                <span className="text-xl font-medium tracking-tight text-white">Agrosvet</span>
              </Link>
              <p className="max-w-sm text-sm leading-relaxed text-white/60">
                Vaš pouzdan partner u poljoprivredi. Nudimo najkvalitetnija semena, đubriva i zaštitna sredstva za vaše gazdinstvo. 
              </p>
            </div>
            <div>
              <h4 className="mb-6 text-xs font-medium uppercase tracking-widest text-white">Korisni linkovi</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link to="/o-nama" className="transition-colors hover:text-white">O nama</Link></li>
                <li><Link to="/dostava" className="transition-colors hover:text-white">Dostava</Link></li>
                <li><Link to="/kontakt" className="transition-colors hover:text-white">Kontakt</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-xs font-medium uppercase tracking-widest text-white">Kontakt</h4>
              <div className="space-y-3 text-sm text-white/70">
                <a href="tel:+381216465745" className="flex items-center gap-3 transition-colors hover:text-white">
                  <Phone size={17} />
                  021 646 5745
                </a>
                <a href="https://maps.app.goo.gl/x4M6M59VRSuLPY8KA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-white">
                  <MapPin size={17} />
                  Google mape
                </a>
              </div>
            </div>
          </div>
          <div className="container mx-auto mt-12 border-t border-white/10 px-6 pt-8 text-center text-[10px] uppercase tracking-widest text-white/40">
            © {new Date().getFullYear()} Agrosvet Poljoprivredna Apoteka. Sva prava zadržana.
          </div>
        </footer>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:productId/edit" element={<ProductFormPage />} />
        <Route path="categories" element={<CategoryListPage />} />
        <Route path="categories/new" element={<CategoryFormPage />} />
        <Route path="categories/:categoryId/edit" element={<CategoryFormPage />} />
      </Route>
      <Route path="*" element={<Storefront />} />
    </Routes>
  </Router>
);

export default App;
