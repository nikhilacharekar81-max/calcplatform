import React from 'react';
import { Folder, Calculator as CalcIcon, ArrowRight, Layers } from 'lucide-react';
import { Category, Subcategory, Calculator } from '../types/schema.ts';
import { Breadcrumbs } from '../components/layout/Breadcrumbs.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';

interface CategoryPageProps {
  category: Category;
  subcategories: Subcategory[];
  calculators: Calculator[];
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  subcategories,
  calculators,
}) => {
  const breadcrumbs = [
    { label: category.name, isCurrent: true },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={breadcrumbs} />

      {/* Category Header Banner */}
      <div className="py-8 border-b border-[#e4e5e7] mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg bg-[#013a12] text-[#1dbf73] flex items-center justify-center shadow-xs">
            <Folder className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#222325] tracking-tight">
              {category.seoTitle || category.name}
            </h1>
            <p className="text-xs text-[#74767e] font-mono mt-0.5">
              Slug: /{category.slug}
            </p>
          </div>
        </div>

        {category.description && (
          <p className="text-sm sm:text-base text-[#404145] max-w-3xl leading-relaxed mt-3">
            {category.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-12">
          {/* Subcategories List */}
          {subcategories.length > 0 ? (
            <div>
              <h2 className="text-xl font-bold text-[#222325] mb-5 pb-2 border-b border-[#f5f5f5]">
                Subcategories in {category.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {subcategories.map((sub) => {
                  const subCalcs = calculators.filter((c) => c.subcategoryId === sub.id);
                  return (
                    <a
                      key={sub.id}
                      href={`/${category.slug}/${sub.slug}`}
                      className="p-6 rounded-lg border border-[#e4e5e7] hover:border-[#1dbf73] hover:shadow-md bg-white transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-bold text-[#222325] group-hover:text-[#1dbf73] transition-colors">
                            {sub.name}
                          </h3>
                          <span className="text-xs font-mono font-semibold text-[#74767e] bg-[#f7f7f7] px-2 py-0.5 rounded">
                            {subCalcs.length} tool{subCalcs.length === 1 ? '' : 's'}
                          </span>
                        </div>
                        {sub.description && (
                          <p className="text-xs text-[#74767e] line-clamp-2 leading-relaxed">
                            {sub.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[#1dbf73]">
                        <span>Browse calculators</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Layers}
              title="No Active Subcategories Yet"
              description={`There are currently no active subcategories under ${category.name}. Log in to Admin to add subcategories and calculators.`}
              actionLabel="Add Subcategory"
              actionHref={`/admin/subcategories?category=${category.id}`}
            />
          )}

          {/* All Calculators in this Category */}
          {calculators.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-[#222325] mb-5 pb-2 border-b border-[#f5f5f5]">
                All Calculators ({calculators.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {calculators.map((calc) => {
                  const sub = subcategories.find((s) => s.id === calc.subcategoryId);
                  const url = sub ? `/${category.slug}/${sub.slug}/${calc.slug}` : '#';

                  return (
                    <a
                      key={calc.id}
                      href={url}
                      className="p-5 rounded-lg border border-[#e4e5e7] hover:border-[#1dbf73] hover:shadow-md bg-white transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#74767e] mb-2">
                          <span className="font-semibold text-[#1dbf73]">{sub?.name || 'Tool'}</span>
                          <CalcIcon className="w-3.5 h-3.5 text-[#74767e]" />
                        </div>
                        <h3 className="text-sm font-bold text-[#222325] group-hover:text-[#1dbf73] transition-colors">
                          {calc.name}
                        </h3>
                        {calc.shortDescription && (
                          <p className="text-xs text-[#74767e] mt-1.5 line-clamp-2">
                            {calc.shortDescription}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#f5f5f5] flex items-center justify-between text-xs font-bold text-[#1dbf73]">
                        <span>Calculate Now</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-[#fafafa] rounded-xl border border-[#e4e5e7]">
            <h3 className="text-xs font-bold text-[#222325] uppercase tracking-wider mb-4">
              Category Details
            </h3>
            <dl className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#e4e5e7]">
                <dt className="text-[#74767e]">Category Name</dt>
                <dd className="font-bold text-[#222325]">{category.name}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#e4e5e7]">
                <dt className="text-[#74767e]">Subcategories</dt>
                <dd className="font-mono font-bold text-[#222325]">{subcategories.length}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#e4e5e7]">
                <dt className="text-[#74767e]">Active Calculators</dt>
                <dd className="font-mono font-bold text-[#222325]">{calculators.length}</dd>
              </div>
              <div className="flex justify-between py-1.5">
                <dt className="text-[#74767e]">Permalink</dt>
                <dd className="font-mono text-[#1dbf73]">/{category.slug}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
