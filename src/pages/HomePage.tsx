import React, { useState, useEffect } from 'react';
import { Search, Folder, Calculator as CalcIcon, ArrowRight, Shield, Layers, CheckCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api.ts';
import { Category, Calculator, Subcategory } from '../types/schema.ts';
import { EmptyState } from '../components/common/EmptyState.tsx';

interface HomePageProps {
  onOpenSearch: () => void;
  brandName?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenSearch, brandName = 'calcplatform' }) => {
  const [categories, setCategories] = useState<Array<Category & { subcategoriesCount: number; calculatorsCount: number; subcategories: Subcategory[] }>>([]);
  const [featuredCalculators, setFeaturedCalculators] = useState<Array<Calculator & { category?: Category; subcategory?: Subcategory }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setIsLoading(true);
    try {
      const [catsData, featuredData] = await Promise.all([
        api.getCategories(),
        api.getCalculators({ featured: true, limit: 8 }),
      ]);
      setCategories(catsData || []);
      setFeaturedCalculators(featuredData || []);
    } catch (err) {
      console.warn('Failed to load home data on first attempt, retrying...', err);
      try {
        const [catsData, featuredData] = await Promise.all([
          api.getCategories(true),
          api.getCalculators({ featured: true, limit: 8 }),
        ]);
        setCategories(catsData || []);
        setFeaturedCalculators(featuredData || []);
      } catch (retryErr) {
        console.error('Failed to load home data after retry:', retryErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasContent = categories.length > 0;
  const cleanBrand = brandName.toLowerCase().replace(/\./g, '');

  return (
    <div className="w-full">
      {/* Fiverr-Style Hero Section (Deep Forest Green Banner #013a12) */}
      <section className="w-full bg-[#013a12] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1dbf73]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1dbf73]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-[#1dbf73] mb-5 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Global Computational Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Find the right <span className="text-[#1dbf73] font-serif italic">computational tools</span>, right away.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Instant, high-precision online calculators for finance, engineering, mathematics, health, and science.
            </p>

            {/* Fiverr Signature Big Search Box */}
            <div className="mt-8 max-w-2xl">
              <div
                onClick={onOpenSearch}
                className="w-full flex items-center bg-white rounded-md overflow-hidden shadow-2xl p-1 sm:p-1.5 transition-all cursor-pointer group"
              >
                <div className="flex-1 flex items-center px-3 sm:px-4 py-2 text-sm text-[#74767e]">
                  <Search className="w-5 h-5 text-[#74767e] mr-3 shrink-0 group-hover:text-[#222325]" />
                  <span className="truncate text-slate-500 font-normal">
                    Search calculators by name, discipline, or formula...
                  </span>
                </div>
                <button
                  type="button"
                  className="bg-[#1dbf73] hover:bg-[#19a463] text-white font-semibold text-sm px-6 py-3 rounded-md flex items-center gap-2 transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

            {/* Popular Topics Strip */}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-white">Popular:</span>
              {hasContent ? (
                categories.slice(0, 5).map((cat) => (
                  <a
                    key={cat.id}
                    href={`/${cat.slug}`}
                    className="px-3 py-1 rounded-full border border-white/20 hover:border-white hover:bg-white/10 text-white transition-colors"
                  >
                    {cat.name}
                  </a>
                ))
              ) : (
                <span className="text-slate-400 italic">Categories will appear here once published from Admin</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Fiverr Trust Highlights Bar */}
      <section className="w-full bg-[#fafafa] border-b border-[#e4e5e7] py-6 px-4">
        <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-6 text-xs sm:text-sm text-[#404145] font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#1dbf73]" />
            <span>High-precision mathematical engine</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#1dbf73]" />
            <span>Zero latency instant recalculations</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#1dbf73]" />
            <span>100% free & mobile-optimized</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#1dbf73]" />
            <span>SEO-friendly clean permalinks</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Categories Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e4e5e7] gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
                Explore Calculators by Category
              </h2>
              <p className="text-xs sm:text-sm text-[#74767e] mt-1">
                Browse accurate calculation engines structured by field and discipline
              </p>
            </div>
            {hasContent && (
              <span className="text-xs font-semibold text-[#74767e] font-mono-num">
                {categories.length} {categories.length === 1 ? 'Category' : 'Categories'} Available
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-[#f5f5f5] rounded-lg animate-pulse border border-[#e4e5e7]" />
              ))}
            </div>
          ) : hasContent ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg border border-[#e4e5e7] p-6 hover:shadow-lg hover:border-[#1dbf73] transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-md bg-[#f7f7f7] border border-[#e4e5e7] flex items-center justify-center text-[#222325] group-hover:bg-[#1dbf73] group-hover:text-white group-hover:border-[#1dbf73] transition-all">
                        <Folder className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <span className="text-xs font-mono font-semibold text-[#74767e] bg-[#f7f7f7] px-2 py-0.5 rounded">
                        {category.calculatorsCount} tool{category.calculatorsCount === 1 ? '' : 's'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#222325] group-hover:text-[#1dbf73] transition-colors">
                      <a href={`/${category.slug}`}>
                        {category.name}
                      </a>
                    </h3>

                    {category.description && (
                      <p className="text-xs text-[#74767e] mt-2 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    )}

                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#f5f5f5] flex flex-wrap gap-1.5">
                        {category.subcategories.slice(0, 3).map((sub) => (
                          <a
                            key={sub.id}
                            href={`/${category.slug}/${sub.slug}`}
                            className="text-[11px] text-[#62646a] hover:text-[#1dbf73] bg-[#f7f7f7] hover:bg-[#e8faf1] px-2 py-0.5 rounded transition-colors"
                          >
                            {sub.name}
                          </a>
                        ))}
                        {category.subcategories.length > 3 && (
                          <span className="text-[11px] text-[#74767e] self-center">
                            +{category.subcategories.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#f5f5f5] flex items-center justify-between">
                    <a
                      href={`/${category.slug}`}
                      className="text-xs font-bold text-[#222325] group-hover:text-[#1dbf73] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Explore category</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Layers}
              title="Platform Ready — No Categories Created Yet"
              description="This is a clean, unpopulated installation. Click below to enter the Admin Panel and create your initial categories and calculators."
              actionLabel="Open Admin Console"
              actionHref="/admin"
              secondaryLabel="Manage Categories"
              secondaryHref="/admin/categories"
            />
          )}
        </section>

        {/* Featured Calculators Grid */}
        {featuredCalculators.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e4e5e7]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
                  Popular & Featured Calculators
                </h2>
                <p className="text-xs sm:text-sm text-[#74767e] mt-1">
                  High-frequency calculation tools recommended by our community
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredCalculators.map((calc) => {
                const url = calc.category && calc.subcategory ? `/${calc.category.slug}/${calc.subcategory.slug}/${calc.slug}` : '#';
                return (
                  <div
                    key={calc.id}
                    className="bg-white rounded-lg border border-[#e4e5e7] p-5 hover:shadow-lg hover:border-[#1dbf73] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#74767e] mb-3">
                        <span className="font-semibold text-[#1dbf73] truncate">{calc.category?.name}</span>
                        <CalcIcon className="w-4 h-4 text-[#74767e]" />
                      </div>

                      <h3 className="text-sm font-bold text-[#222325] group-hover:text-[#1dbf73] transition-colors line-clamp-1">
                        <a href={url}>{calc.name}</a>
                      </h3>

                      {calc.shortDescription && (
                        <p className="text-xs text-[#74767e] mt-2 line-clamp-2 leading-relaxed">
                          {calc.shortDescription}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#f5f5f5] flex items-center justify-between">
                      <span className="text-[11px] text-[#74767e]">{calc.subcategory?.name}</span>
                      <a
                        href={url}
                        className="text-xs font-bold text-[#1dbf73] hover:text-[#19a463] inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Calculate</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Fiverr-Style Call to Action Banner (Forest Green #013a12) */}
        <section className="bg-[#013a12] text-white rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#1dbf73]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1dbf73] uppercase tracking-widest">
              <Shield className="w-4 h-4" />
              <span>Administration & Dynamic Scale</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Manage calculation engines with zero code changes
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Add formulas, adjust variables, update units, and configure categories directly from the administrative dashboard.
            </p>
          </div>

          <a
            href="/admin"
            className="px-6 py-3.5 text-xs font-bold text-[#013a12] bg-[#1dbf73] hover:bg-white rounded-md transition-all shrink-0 shadow-md cursor-pointer relative z-10"
          >
            Launch Admin Console
          </a>
        </section>
      </main>
    </div>
  );
};
