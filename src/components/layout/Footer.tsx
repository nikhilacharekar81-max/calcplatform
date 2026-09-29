import React, { useState, useEffect } from 'react';
import { Shield, FileText, Globe, Heart } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Category } from '../../types/schema.ts';

interface FooterProps {
  brandName?: string;
  footerNotice?: string;
}

export const Footer: React.FC<FooterProps> = ({
  brandName = 'calcplatform',
  footerNotice = '© CalcPlatform International Ltd. All calculation engines provided for educational and analytical purposes.',
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  const cleanBrand = brandName.toLowerCase().replace(/\./g, '');

  return (
    <footer className="w-full bg-white border-t border-[#e4e5e7] mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Categories */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-bold text-[#404145] mb-4">
              Categories
            </h4>
            {categories.length > 0 ? (
              <ul className="space-y-3 text-sm text-[#74767e]">
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`/${cat.slug}`}
                      className="hover:text-[#222325] hover:underline transition-colors"
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#74767e] italic">
                Categories appear here once created.
              </p>
            )}
          </div>

          {/* Col 2: About & Platform */}
          <div>
            <h4 className="text-sm font-bold text-[#404145] mb-4">
              About Platform
            </h4>
            <ul className="space-y-3 text-sm text-[#74767e]">
              <li>
                <a href="/" className="hover:text-[#222325] hover:underline transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-[#1dbf73] transition-colors font-medium">
                  Tax Blog & Guides
                </a>
              </li>
              <li>
                <a href="/search" className="hover:text-[#222325] hover:underline transition-colors">
                  Explore Directory
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-[#222325] hover:underline transition-colors">
                  XML Sitemap
                </a>
              </li>
              <li>
                <a href="/robots.txt" target="_blank" rel="noreferrer" className="hover:text-[#222325] hover:underline transition-colors">
                  Robots File
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Management */}
          <div>
            <h4 className="text-sm font-bold text-[#404145] mb-4">
              Administration
            </h4>
            <ul className="space-y-3 text-sm text-[#74767e]">
              <li>
                <a href="/admin" className="hover:text-[#1dbf73] transition-colors font-medium">
                  Admin Console
                </a>
              </li>
              <li>
                <a href="/admin/categories" className="hover:text-[#222325] hover:underline transition-colors">
                  Category Manager
                </a>
              </li>
              <li>
                <a href="/admin/subcategories" className="hover:text-[#222325] hover:underline transition-colors">
                  Subcategory Manager
                </a>
              </li>
              <li>
                <a href="/admin/calculators" className="hover:text-[#222325] hover:underline transition-colors">
                  Calculator Builder
                </a>
              </li>
              <li>
                <a href="/admin/settings" className="hover:text-[#222325] hover:underline transition-colors">
                  SEO & Backup Settings
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Capabilities */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-[#404145] mb-4">
              Platform Features
            </h4>
            <p className="text-xs text-[#74767e] leading-relaxed">
              Designed for high accuracy, speed, and responsiveness. Powered by client-side mathematical expression parsing with custom variable mapping and formula engines.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#1dbf73] bg-[#e8faf1] hover:bg-[#1dbf73] hover:text-white rounded-md transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Console Access</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Fiverr-style logo, language/currency indicator, and copyright */}
        <div className="pt-8 border-t border-[#e4e5e7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#74767e]">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-xl font-black text-[#222325] tracking-tighter"
            >
              <span>{cleanBrand}</span>
              <span className="text-[#1dbf73] font-extrabold text-2xl">.</span>
            </a>
            <span>{footerNotice}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#62646a]">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#74767e]" /> English (US)
            </span>
            <span>$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
