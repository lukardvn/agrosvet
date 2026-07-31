import { useEffect, useState } from 'react';
import { ImageOff, ShoppingBag } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { productDetailPreview } from '../mocks/productDetailPreview';
import { Category, Product } from '../types';
import { NotFound } from './NotFound';

interface ProductDetailProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (id: number) => void;
}

export const ProductDetail = ({ products, categories, onAddToCart }: ProductDetailProps) => {
  const { productId } = useParams();
  const parsedProductId = Number(productId);
  const backendProduct = products.find(product => product.id === parsedProductId);
  const product = backendProduct
    ?? (products.length === 0 && parsedProductId === productDetailPreview.id ? productDetailPreview : null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (!product) return;
    const previousTitle = document.title;
    document.title = `${product.name} | Agrosvet`;
    return () => { document.title = previousTitle; };
  }, [product]);

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

          <button
            onClick={() => onAddToCart(product.id)}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-[3px] bg-agro-900 px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-agro-800 active:bg-agro-950"
          >
            <ShoppingBag size={17} />
            Dodaj u korpu
          </button>
        </div>
      </div>
    </section>
  );
};
