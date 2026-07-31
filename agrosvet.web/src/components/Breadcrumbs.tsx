import { Link, useLocation } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const location = useLocation();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: new URL(item.to ?? `${location.pathname}${location.search}`, window.location.origin).toString(),
    })),
  };

  return (
    <>
      <nav aria-label="Putanja stranice">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          {items.map((item, index) => {
            const isCurrent = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden="true">/</span>}
                {item.to && !isCurrent ? (
                  <Link to={item.to} className="transition-colors hover:text-agro-800 hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={isCurrent ? 'page' : undefined} className={isCurrent ? 'text-slate-600' : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script type="application/ld+json">{JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>
    </>
  );
};
