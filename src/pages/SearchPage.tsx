import React, { useState, useEffect } from 'react';
import { Search, Calculator as CalcIcon, ArrowRight, Filter } from 'lucide-react';
import { api } from '../services/api.ts';
import { Calculator, Category, Subcategory } from '../types/schema.ts';
import { EmptyState } from '../components/common/EmptyState.tsx';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<Calculator & { category?: Category; subcategory?: Subcategory }>>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q') || '';
    const cat = urlParams.get('category') || '';
    setQuery(q);
    setSelectedCategorySlug(cat);

    api.getCategories().then(setCategories).catch(() => {});
    loadSearch(q, cat);
  }, []);

  const loadSearch = async (q: string, categorySlug: string) => {
    setIsLoading(true);
    try {
      const data = await api.getCalculators({
        search: q,
        categorySlug: categorySlug || undefined,
      });
      setResults(data);
    } catch (err) {
      console.error('Search query failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedCategorySlug) params.set('category', selectedCategorySlug);
    window.history.replaceState({}, '', `/search?${params.toString()}`);
    loadSearch(query, selectedCategorySlug);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Search Header Banner */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#222325]">
          Find Calculators & Formulas
        </h1>
        <p className="text-sm text-[#74767e]">
          Search across all published categories, disciplines, and computational engines
        </p>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 mt-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#74767e] absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by calculator name, formula, or discipline..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#dadbdd] rounded-md focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20 text-sm font-semibold text-[#222325] outline-hidden shadow-xs"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategorySlug}
              onChange={(e) => {
                setSelectedCategorySlug(e.target.value);
                loadSearch(query, e.target.value);
              }}
              className="px-4 py-3 bg-white border border-[#dadbdd] rounded-md text-xs font-bold text-[#404145] focus:border-[#1dbf73] outline-hidden cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-6 py-3 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-md transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e4e5e7] text-xs font-semibold text-[#74767e]">
        <span>
          Showing {results.length} result{results.length === 1 ? '' : 's'}
          {query ? ` for "${query}"` : ''}
        </span>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-[#f5f5f5] rounded-lg animate-pulse border border-[#e4e5e7]" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((calc) => {
            const url = calc.category && calc.subcategory ? `/${calc.category.slug}/${calc.subcategory.slug}/${calc.slug}` : '#';
            return (
              <a
                key={calc.id}
                href={url}
                className="p-5 bg-white rounded-lg border border-[#e4e5e7] hover:border-[#1dbf73] hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#74767e] mb-2.5">
                    <span className="font-semibold text-[#1dbf73]">{calc.category?.name} / {calc.subcategory?.name}</span>
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
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title={query ? `No Calculators Found for "${query}"` : 'No Calculators Available'}
          description={
            query
              ? 'Try searching with different terms or selecting another category.'
              : 'There are currently no calculators published on the platform.'
          }
          actionLabel="Return to Homepage"
          actionHref="/"
          secondaryLabel="Admin Management"
          secondaryHref="/admin"
        />
      )}
    </div>
  );
};
