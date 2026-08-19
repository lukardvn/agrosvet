import { useEffect, useState } from 'react';
import { ImageOff, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { productDetailPreview } from '../mocks/productDetailPreview';
import { Category, Product } from '../types';
import { NotFound } from './NotFound';

interface ProductDetailProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (id: number, quantity: number) => void;
}

export const ProductDetail = ({ products, categories, onAddToCart }: ProductDetailProps) => {
  const { productId } = useParams();
  const parsedProductId = Number(productId);
  const backendProduct = products.find(product => product.id === parsedProductId);
  const product = backendProduct
    ?? (products.length === 0 && parsedProductId === productDetailPreview.id ? productDetailPreview : null);
  const [imageFailed, setImageFailed] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;
    const previousTitle = document.title;
    document.title = `${product.name} | Agrosvet`;
    return () => { document.title = previousTitle; };
  }, [product]);

  useEffect(() => setQuantity(1), [parsedProductId]);

  if (!product) return <NotFound />;

  const categoryName = categories.find(category => category.id === product.categoryId)?.name
    ?? (product === productDetailPreview ? 'Mineralna đubriva' : 'Proizvod');

  return (
    <section className="pb-10 pt-2 sm:pb-16">
      <Breadcrumbs items={[
        { label: 'Početna', to: '/' },
        { label: 'Proizvodi', to: '/proizvodi' },
        { label: product.name },
      ]} />

      <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:gap-14">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-md bg-[#f3f3ef] text-agro-300">
          <ImageOff size={72} strokeWidth={1} />
          {product.imageUrl && !imageFailed && (
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={() => setImageFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col lg:py-5">
          <p className="text-xs uppercase tracking-[0.16em] text-agro-700">{categoryName}</p>
          <h1 className="mt-3 text-3xl font-normal leading-tight tracking-tight text-agro-950 sm:text-4xl lg:text-5xl">
            {product.name}
          </h1>
          <p className="mt-5 border-b border-agro-950/10 pb-6 text-2xl font-medium text-agro-950">
            {product.price.toLocaleString('sr-RS')} RSD
          </p>

          {product.description && (
            <p className="mt-6 text-sm leading-7 text-slate-600">{product.description}</p>
          )}

          <div className="mt-8 flex gap-3">
            <div className="flex shrink-0 items-center rounded-[3px] border border-agro-950/15 bg-white">
              <button
                type="button"
                onClick={() => setQuantity(current => Math.max(1, current - 1))}
                disabled={quantity === 1}
                aria-label="Smanji količinu"
                className="flex h-full w-11 items-center justify-center text-agro-950 transition-colors hover:bg-agro-50 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                <Minus size={15} />
              </button>
              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={quantity}
                onChange={event => {
                  const nextQuantity = event.target.valueAsNumber;
                  if (Number.isInteger(nextQuantity) && nextQuantity >= 1) setQuantity(nextQuantity);
                }}
                aria-label="Količina"
                className="quantity-input h-full w-12 border-x border-agro-950/10 bg-transparent text-center text-sm text-agro-950 outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity(current => current + 1)}
                aria-label="Povećaj količinu"
                className="flex h-full w-11 items-center justify-center text-agro-950 transition-colors hover:bg-agro-50"
              >
                <Plus size={15} />
              </button>
            </div>
            <button
              onClick={() => onAddToCart(product.id, quantity)}
              className="flex min-h-12 flex-1 items-center justify-center gap-3 rounded-[3px] bg-agro-900 px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-agro-800 active:bg-agro-950"
            >
              <ShoppingBag size={17} />
              Dodaj u korpu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
