import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500">
        <li className="flex items-center">
          <a
            href="/"
            className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </a>
        </li>

        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            {item.href && !item.isCurrent ? (
              <a
                href={item.href}
                className="text-slate-500 hover:text-slate-900 transition-colors truncate max-w-[200px]"
              >
                {item.label}
              </a>
            ) : (
              <span
                className="font-semibold text-slate-800 truncate max-w-[240px]"
                aria-current={item.isCurrent ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
