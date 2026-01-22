import React from 'react';
import { Link } from 'react-router-dom';

type RelatedItem = { title: string; href: string; description?: string; tag?: string };

interface RelatedNavProps {
  heading: string;
  items: RelatedItem[];
  ariaLabel?: string;
}

export const RelatedNav: React.FC<RelatedNavProps> = ({ heading, items, ariaLabel = 'Related links' }) => {
  if (!items.length) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="related-heading" className="text-xl font-semibold text-lexcora-blue">
          {heading}
        </h2>
        <nav aria-label={ariaLabel}>
          <span className="sr-only">{heading}</span>
        </nav>
      </div>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.href} className="rounded-lg border bg-white p-4 shadow-sm">
            {item.tag && (
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-lexcora-gold">
                {item.tag}
              </div>
            )}
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              <Link to={item.href} className="hover:text-lexcora-gold underline-offset-4 hover:underline">
                {item.title}
              </Link>
            </h3>
            {item.description && <p className="mt-2 text-sm text-slate-600">{item.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
};
