import React, { useState } from 'react';
import { ShoppingCart, Sprout, Search, Bell, User, Facebook, Instagram, MapPin, ArrowUpDown, ChevronDown } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ProductCard } from './components/ProductCard';
import { Sidebar } from './components/Sidebar';
import { useAgroApi } from './hooks/useAgroApi';
import { AboutUs } from './pages/AboutUs';
import { Delivery } from './pages/Delivery';
import { Contact } from './pages/Contact';

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'default';

const MainShop: React.FC<{ 
  products: any[], 
  categories: any[], 
  cart: any, 
  addToCart: (id: number) => void, 
  removeFromCart: (id: number) => void 
}> = ({ products, categories, cart, addToCart, removeFromCart }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortOption, setSortOption] = useState<SortOption>('default');

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

  return (
    <>
      <div className="flex-1 max-w-xl mx-12 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-agro-600 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Pretraži ponudu semena, đubriva, alata..."
            className="w-full bg-gray-50 border border-gray-100/50 py-3 pl-12 pr-6 rounded-2xl focus:outline-none focus:ring-4 focus:ring-agro-500/10 focus:bg-white focus:border-agro-200 transition-all text-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-3 text-gray-400 hover:text-agro-600 hover:bg-agro-50 rounded-xl transition-all"><Bell size={20} /></button>
        <button className="p-3 text-gray-400 hover:text-agro-600 hover:bg-agro-50 rounded-xl transition-all"><User size={20} /></button>
        <div className="h-8 w-[1px] bg-gray-100 mx-2" />
        <div className="flex items-center gap-3 bg-earth-950 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-earth-900/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
          <ShoppingCart size={20} className="text-earth-400" />
          <span className="font-black text-sm tracking-tight">{cart?.totalPrice.toLocaleString('sr-RS')} <small className="font-normal opacity-60">RSD</small></span>
          {cart && cart.items.length > 0 && (
            <div className="bg-agro-500 text-white text-[10px] w-5 h-5 rounded-lg flex items-center justify-center font-black border-2 border-earth-950 -ml-1">
              {cart.items.length}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 flex gap-12 flex-1 items-start">
        <Sidebar 
          categories={categories}
          activeCategoryId={activeCategoryId}
          onCategorySelect={setActiveCategoryId}
          cart={cart}
          onRemoveFromCart={removeFromCart}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />

        <div className="flex-1">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-xs font-black text-agro-600 uppercase tracking-[0.2em] mb-2 opacity-80">Online Prodavnica</div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                {activeCategoryId 
                  ? categories.find(c => c.id === activeCategoryId)?.name 
                  : searchQuery 
                    ? `Rezultati za "${searchQuery}"` 
                    : 'Aktuelna Ponuda'}
              </h2>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative inline-block">
                <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  <ArrowUpDown size={12} />
                  <span>Sortiraj po</span>
                </div>
                <div className="relative">
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="appearance-none bg-white border border-gray-100 pl-4 pr-10 py-2.5 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-agro-500/10 focus:border-agro-200 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="default">Preporučeno</option>
                    <option value="price-asc">Ceni: Niža ka višoj</option>
                    <option value="price-desc">Ceni: Viša ka nižoj</option>
                    <option value="name-asc">Nazivu: A - Z</option>
                    <option value="name-desc">Nazivu: Z - A</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="text-sm font-bold text-gray-400 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm self-end mb-[1px]">
                Prikazano <span className="text-gray-900">{filteredProducts.length}</span> proizvoda
              </div>
            </div>
          </header>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  categoryName={categories.find(c => c.id === product.categoryId)?.name}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center shadow-soft border border-dashed border-gray-200">
               <Search size={64} className="mx-auto text-gray-200 mb-6" strokeWidth={1} />
               <h3 className="text-xl font-bold text-gray-800 mb-2">Nema rezultata</h3>
               <p className="text-gray-500 max-w-sm mx-auto">Nismo pronašli nijedan proizvod koji odgovara vašoj pretrazi ili opsegu cene. Pokušajte sa drugim ključnim rečima.</p>
               <button 
                onClick={() => {setSearchQuery(''); setActiveCategoryId(null); setPriceRange([0, 10000]); setSortOption('default');}}
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

const App: React.FC = () => {
  const { products, categories, cart, loading, addToCart, removeFromCart } = useAgroApi();

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-agro-50 text-agro-600 gap-4">
      <Sprout size={64} className="animate-pulse duration-700" strokeWidth={1} />
      <div className="text-sm font-black uppercase tracking-[0.3em] opacity-60">Agrosvet učitava...</div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-agro-100 selection:text-agro-900">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="bg-agro-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                <Sprout size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tighter">Agrosvet</h1>
                <div className="text-[9px] font-bold text-agro-600 uppercase tracking-widest -mt-1 opacity-80">Poljoprivredna Apoteka</div>
              </div>
            </Link>

            <Routes>
              <Route path="/" element={<div className="contents" />} />
            </Routes>
          </div>
        </nav>

        <main className="flex-1 py-12">
          <div className="container mx-auto px-6">
            <Routes>
              <Route path="/" element={
                <MainShop 
                  products={products} 
                  categories={categories} 
                  cart={cart} 
                  addToCart={addToCart} 
                  removeFromCart={removeFromCart} 
                />
              } />
              <Route path="/o-nama" element={<AboutUs />} />
              <Route path="/dostava" element={<Delivery />} />
              <Route path="/kontakt" element={<Contact />} />
            </Routes>
          </div>
        </main>

        <footer className="bg-white border-t border-gray-100 py-12 mt-12">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="bg-agro-600 p-1.5 rounded-lg"><Sprout size={20} className="text-white" /></div>
                <span className="font-black text-xl tracking-tighter text-gray-900 font-bold">Agrosvet</span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                Vaš pouzdan partner u poljoprivredi. Nudimo najkvalitetnija semena, đubriva i zaštitna sredstva za vaše gazdinstvo. 
              </p>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-6 font-bold">Korisni Linkovi</h4>
              <ul className="space-y-3 text-sm font-medium text-gray-500">
                <li><Link to="/o-nama" className="hover:text-agro-600 transition-colors">O Nama</Link></li>
                <li><Link to="/dostava" className="hover:text-agro-600 transition-colors">Dostava</Link></li>
                <li><Link to="/kontakt" className="hover:text-agro-600 transition-colors">Kontakt</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-6 font-bold">Pratite Nas</h4>
              <div className="flex gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-all shadow-sm">
                  <Facebook size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-xl hover:bg-pink-50 hover:text-pink-600 flex items-center justify-center transition-all shadow-sm">
                  <Instagram size={20} />
                </a>
                <a href="https://maps.app.goo.gl/mTvci45HF6YFZW1UA" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-xl hover:bg-agro-50 hover:text-agro-600 flex items-center justify-center transition-all shadow-sm">
                  <MapPin size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-50 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            © 2024 Agrosvet Poljoprivredna Apoteka. Sva prava zadržana.
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
