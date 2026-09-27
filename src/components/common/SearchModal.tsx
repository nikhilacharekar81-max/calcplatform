import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calculator as CalcIcon, ArrowRight, CornerDownLeft } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Calculator, Category, Subcategory } from '../../types/schema.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator?: (url: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectCalculator }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<Calculator & { category?: Category; subcategory?: Subcategory }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      performSearch('');
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  const performSearch = async (q: string) => {
    setIsLoading(true);
    try {
      const data = await api.getCalculators({ search: q, limit: 12 });
      setResults(data);
      setSelectedIndex(0);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    performSearch(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      navigateToCalc(results[selectedIndex]);
    }
  };

  const navigateToCalc = (calc: Calculator & { category?: Category; subcategory?: Subcategory }) => {
    if (calc.category && calc.subcategory) {
      const url = `/${calc.category.slug}/${calc.subcategory.slug}/${calc.slug}`;
      if (onSelectCalculator) {
        onSelectCalculator(url);
      } else {
        window.location.href = url;
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-[#222325]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#dadbdd] overflow-hidden z-10 flex flex-col max-h-[80vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#e4e5e7] bg-white gap-3">
          <Search className="w-5 h-5 text-[#1dbf73] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search all calculators (e.g. loan, percentage, BMI)..."
            className="w-full text-base font-medium text-[#222325] placeholder:text-[#74767e] bg-transparent outline-hidden"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                performSearch('');
              }}
              className="text-[#74767e] hover:text-[#222325] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-[#74767e] bg-[#f5f5f5] border border-[#e4e5e7] rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 flex-1 divide-y divide-[#f5f5f5]">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-[#74767e]">
              Searching calculator database...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((calc, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={calc.id}
                    onClick={() => navigateToCalc(calc)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left p-3.5 rounded-lg flex items-center justify-between group transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#e8faf1] text-[#222325]' : 'text-[#404145] hover:bg-[#fafafa]'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 pr-3">
                      <div className="w-9 h-9 rounded-md bg-white border border-[#e4e5e7] flex items-center justify-center shrink-0 text-[#1dbf73] mt-0.5 shadow-2xs">
                        <CalcIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#222325] truncate">
                            {calc.name}
                          </span>
                        </div>
                        {calc.shortDescription && (
                          <p className="text-xs text-[#74767e] truncate mt-0.5">
                            {calc.shortDescription}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-[11px] text-[#74767e] mt-1">
                          <span className="font-semibold text-[#1dbf73]">{calc.category?.name || 'Category'}</span>
                          <span aria-hidden="true">/</span>
                          <span>{calc.subcategory?.name || 'Subcategory'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-[#74767e] group-hover:text-[#1dbf73]">
                      <span className="text-xs font-semibold hidden sm:inline">Open</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto mb-3 text-[#74767e]">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#222325]">
                {query ? `No calculators found matching "${query}"` : 'No calculators available'}
              </p>
              <p className="text-xs text-[#74767e] mt-1 max-w-sm mx-auto">
                {query
                  ? 'Try searching with different keywords or check spelling.'
                  : 'Calculators created through the admin panel will instantly show up here.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-[#fafafa] border-t border-[#e4e5e7] flex items-center justify-between text-xs text-[#74767e]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3 text-[#1dbf73]" /> Press Enter to Select
            </span>
            <span>↑↓ Navigate</span>
          </div>
          <span className="font-semibold">{results.length} calculator{results.length === 1 ? '' : 's'} available</span>
        </div>
      </div>
    </div>
  );
};
