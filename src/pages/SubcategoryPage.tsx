import React from 'react';
import { Layers, Calculator as CalcIcon, ArrowRight } from 'lucide-react';
import { Category, Subcategory, Calculator } from '../types/schema.ts';
import { Breadcrumbs } from '../components/layout/Breadcrumbs.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';

interface SubcategoryPageProps {
  category: Category;
  subcategory: Subcategory;
  calculators: Calculator[];
  siblingSubcategories?: Subcategory[];
}

export const SubcategoryPage: React.FC<SubcategoryPageProps> = ({
  category,
  subcategory,
  calculators,
  siblingSubcategories = [],
}) => {
  const breadcrumbs = [
    { label: category.name, href: `/${category.slug}` },
    { label: subcategory.name, isCurrent: true },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={breadcrumbs} />

      {/* Subcategory Header */}
      <div className="py-8 border-b border-[#e4e5e7] mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg bg-[#013a12] text-[#1dbf73] flex items-center justify-center shadow-xs">
            <Layers className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#222325] tracking-tight">
              {subcategory.seoTitle || subcategory.name}
            </h1>
            <p className="text-xs text-[#74767e] font-mono mt-0.5">
              Path: /{category.slug}/{subcategory.slug}
            </p>
          </div>
        </div>

        {subcategory.description && (
          <p className="text-sm sm:text-base text-[#404145] max-w-3xl leading-relaxed mt-3">
            {subcategory.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Column */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#f5f5f5]">
            <h2 className="text-xl font-bold text-[#222325]">
              Calculators in {subcategory.name} ({calculators.length})
            </h2>
            <span className="text-xs text-[#74767e]">
              Category: <strong className="text-[#222325]">{category.name}</strong>
            </span>
          </div>

          {calculators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {calculators.map((calc) => (
                <a
                  key={calc.id}
                  href={`/${category.slug}/${subcategory.slug}/${calc.slug}`}
                  className="p-5 rounded-lg border border-[#e4e5e7] hover:border-[#1dbf73] hover:shadow-md bg-white transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#74767e] mb-2">
                      <span className="font-semibold text-[#1dbf73]">{subcategory.name}</span>
                      <CalcIcon className="w-4 h-4 text-[#74767e]" />
                    </div>
                    <h3 className="text-sm font-bold text-[#222325] group-hover:text-[#1dbf73] transition-colors">
                      {calc.name}
                    </h3>
                    {calc.shortDescription && (
                      <p className="text-xs text-[#74767e] mt-1.5 line-clamp-2 leading-relaxed">
                        {calc.shortDescription}
                      </p>
                    )}
                  </div>
                  <div className="mt-5 pt-3 border-t border-[#f5f5f5] flex items-center justify-between text-xs font-bold text-[#1dbf73]">
                    <span>Calculate Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalcIcon}
              title="No Calculators Created Yet"
              description={`No calculators have been published under ${subcategory.name} yet.`}
              actionLabel="Add Calculator"
              actionHref={`/admin/calculators`}
            />
          )}
        </div>

        {/* Sidebar: Sibling subcategories */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-[#fafafa] rounded-xl border border-[#e4e5e7]">
            <h3 className="text-xs font-bold text-[#222325] uppercase tracking-wider mb-4">
              More Subcategories in {category.name}
            </h3>
            {siblingSubcategories.length > 0 ? (
              <ul className="space-y-2">
                {siblingSubcategories.map((sib) => {
                  const isCurrent = sib.id === subcategory.id;
                  return (
                    <li key={sib.id}>
                      <a
                        href={`/${category.slug}/${sib.slug}`}
                        className={`block text-xs py-2 px-3 rounded-md font-semibold transition-colors ${
                          isCurrent
                            ? 'bg-[#013a12] text-white shadow-xs'
                            : 'text-[#404145] hover:bg-[#f5f5f5] hover:text-[#1dbf73]'
                        }`}
                      >
                        {sib.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-xs text-[#74767e]">No other subcategories.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
