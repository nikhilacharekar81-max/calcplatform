import React, { useState, useEffect } from 'react';
import { Search, Shield, ChevronDown, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Category, Subcategory } from '../../types/schema.ts';

interface HeaderProps {
  onOpenSearch: () => void;
  brandName?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, brandName = 'calcplatform' }) => {
  const [categories, setCategories] = useState<Array<Category & { subcategories: Subcategory[] }>>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    loadActiveCategories();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadActiveCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories for nav:', err);
    }
  };

  // Format brand name lowercase with green dot like Fiverr
  const cleanBrand = brandName.toLowerCase().replace(/\./g, '');

  return (
    <div className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* Top Primary Bar */}
      <header className="w-full bg-white border-b border-[#e4e5e7]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-6 shrink-0">
            <a
              href="/"
              className="text-2xl font-black tracking-tighter text-[#222325] hover:opacity-95 transition-opacity flex items-center"
            >
              <span>{cleanBrand}</span>
              <span className="text-[#1dbf73] font-extrabold text-3xl leading-none">.</span>
            </a>
          </div>

          {/* Fiverr-Style Middle Search Box */}
          <div className="hidden lg:flex flex-1 max-w-xl">
            <div
              onClick={onOpenSearch}
              className="w-full flex items-center border border-[#dadbdd] hover:border-[#222325] rounded-md overflow-hidden transition-colors cursor-pointer bg-white"
            >
              <div className="flex-1 flex items-center px-4 py-2.5 text-sm text-[#74767e]">
                <Search className="w-4 h-4 text-[#74767e] mr-2.5 shrink-0" />
                <span className="truncate">What calculator are you looking for today?</span>
              </div>
              <button
                type="button"
                className="bg-[#1dbf73] hover:bg-[#19a463] text-white px-4 py-2.5 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Submit search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={onOpenSearch}
              className="lg:hidden p-2 text-[#74767e] hover:text-[#222325] hover:bg-[#f5f5f5] rounded-full transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <a
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#62646a] hover:text-[#1dbf73] transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Console</span>
            </a>

            <a
              href="/admin"
              className="px-4 py-2 text-sm font-semibold text-[#1dbf73] hover:text-white border border-[#1dbf73] hover:bg-[#1dbf73] rounded-md transition-all duration-150 shadow-2xs cursor-pointer"
            >
              Sign In
            </a>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#404145] hover:text-[#222325] rounded-md"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Fiverr Horizontal Sub-Navigation Strip */}
      <nav className="w-full bg-white border-b border-[#e4e5e7] hidden md:block overflow-x-auto">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start gap-6 lg:gap-8">
          <a
            href="/scenario-studio"
            className="py-2.5 text-xs font-bold text-slate-800 hover:text-[#1dbf73] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Scenario Studio</span>
          </a>
          <a
            href="/blog"
            className="py-2.5 text-xs font-bold text-[#1dbf73] hover:text-[#19a463] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Tax Blog & Guides</span>
          </a>
          {categories.map((cat) => {
              const hasSubs = cat.subcategories && cat.subcategories.length > 0;
              const isOpen = openDropdown === cat.id;

              return (
                <div
                  key={cat.id}
                  className="relative group py-2.5 shrink-0"
                  onMouseEnter={() => setOpenDropdown(cat.id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <a
                    href={`/${cat.slug}`}
                    className="text-xs font-semibold text-[#62646a] hover:text-[#222325] transition-colors py-1 flex items-center gap-1 relative"
                  >
                    <span>{cat.name}</span>
                    {hasSubs && (
                      <ChevronDown className="w-3 h-3 text-[#74767e] group-hover:text-[#222325] transition-transform" />
                    )}
                    {/* Fiverr active/hover green bar */}
                    <span className="absolute bottom-[-10px] left-0 right-0 h-[2px] bg-[#1dbf73] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  {/* Subcategories Dropdown */}
                  {hasSubs && isOpen && (
                    <div className="absolute left-0 top-full pt-2 w-64 z-50 animate-in fade-in duration-100">
                      <div className="bg-white rounded-lg shadow-xl border border-[#e4e5e7] py-2 overflow-hidden">
                        <div className="px-3.5 py-1 text-[11px] font-bold text-[#74767e] uppercase tracking-wider border-b border-[#f5f5f5] mb-1">
                          {cat.name} Tools
                        </div>
                        {cat.subcategories.map((sub) => (
                          <a
                            key={sub.id}
                            href={`/${cat.slug}/${sub.slug}`}
                            className="block px-3.5 py-2 text-xs font-medium text-[#404145] hover:bg-[#f7f7f7] hover:text-[#1dbf73] transition-colors truncate"
                          >
                            {sub.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e4e5e7] px-4 pt-3 pb-6 space-y-4">
          <div className="space-y-2 pb-2 border-b border-slate-100">
            <a
              href="/scenario-studio"
              className="flex items-center gap-2 py-1 text-sm font-bold text-emerald-600 hover:text-emerald-700"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Scenario Studio (Hybrid Architecture)</span>
            </a>
            <a
              href="/blog"
              className="block py-1 text-sm font-bold text-slate-800 hover:text-emerald-600"
            >
              <span>Tax Blog & Guides</span>
            </a>
          </div>
          <div className="text-xs font-bold text-[#74767e] uppercase tracking-wider">
            All Categories
          </div>
          {categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="py-1">
                  <a
                    href={`/${cat.slug}`}
                    className="block text-sm font-semibold text-[#222325] hover:text-[#1dbf73]"
                  >
                    {cat.name}
                  </a>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="pl-3 mt-1 space-y-1 border-l-2 border-[#e4e5e7]">
                      {cat.subcategories.map((sub) => (
                        <a
                          key={sub.id}
                          href={`/${cat.slug}/${sub.slug}`}
                          className="block text-xs text-[#62646a] hover:text-[#1dbf73] py-0.5"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#74767e] py-2">
              No categories created yet. Log in to the Admin panel to add categories.
            </p>
          )}

          <div className="pt-3 border-t border-[#e4e5e7] space-y-2">
            <a
              href="/admin"
              className="block w-full text-center py-2.5 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-md transition-colors"
            >
              Go to Admin Console
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
