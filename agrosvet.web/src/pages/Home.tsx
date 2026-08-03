import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Category, Product } from '../types';

interface HomeProps {
  categories: Category[];
  products: Product[];
  onAddToCart: (id: number) => void;
}

const categoryImages = [
  'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=85',
];

export const Home = ({ categories, products, onAddToCart }: HomeProps) => {
  const visibleCategories = categories.filter(category => category.parentId == null).slice(0, 4);
  const [featuredProducts] = useState(() => [...products].sort(() => Math.random() - 0.5).slice(0, 4));

  return (
    <>
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden bg-[#f5f5ef]">
        <div className="container mx-auto grid min-h-[570px] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex items-center px-4 pb-14 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:py-24 lg:pr-14">
            <div className="max-w-xl">
              <h1 className="text-4xl font-normal leading-[1.08] tracking-tight text-agro-950 sm:text-5xl lg:text-6xl">
                Pouzdana rešenja za svaku sezonu.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
                Kvalitetno seme, prihrana, zaštita i oprema za zdrav usev i sigurniji prinos.
              </p>
              <Link
                to="/proizvodi"
                className="mt-7 inline-flex items-center gap-3 rounded-[3px] bg-agro-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-agro-800"
              >
                Pogledajte ponudu
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1500&q=90"
              alt="Poljoprivredna proizvodnja na obrađenom polju"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-y-0 left-0 hidden w-20 bg-gradient-to-r from-[#f5f5ef] to-transparent lg:block" />
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <p className="text-xs uppercase tracking-[0.16em] text-agro-700">Naša ponuda</p>
          <h2 className="mt-3 text-3xl font-normal tracking-tight text-agro-950 sm:text-4xl">Otkrijte Agrosvet proizvode</h2>
        </div>

        {visibleCategories.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleCategories.map((category, index) => (
              <Link
                key={category.id}
                to={`/proizvodi?category=${category.id}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-md bg-agro-100"
              >
                <img
                  src={categoryImages[index % categoryImages.length]}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-agro-950/75 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
                  <h3 className="text-xl font-normal">{category.name}</h3>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/35 transition-colors group-hover:bg-white group-hover:text-agro-950">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="border-y border-agro-950/10 py-8 text-sm text-slate-500">Kategorije će uskoro biti dostupne.</p>
        )}
      </section>

      {featuredProducts.length > 0 && (
        <section className="border-t border-agro-950/10 py-14 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-agro-700">Iz ponude</p>
              <h2 className="mt-3 text-3xl font-normal tracking-tight text-agro-950 sm:text-4xl">Izdvojeni proizvodi</h2>
            </div>
            <Link to="/proizvodi" className="hidden items-center gap-2 text-xs uppercase tracking-[0.12em] text-agro-900 hover:opacity-60 sm:flex">
              Svi proizvodi <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categories.find(category => category.id === product.categoryId)?.name}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
};
