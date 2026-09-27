import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Layers,
  Calculator as CalcIcon,
  Plus,
  CheckCircle2,
  FileCode,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { StatsResponse } from '../../types/schema.ts';

interface AdminDashboardProps {
  onNavigate: (tab: 'dashboard' | 'categories' | 'subcategories' | 'calculators' | 'settings' | 'calculator-editor', param?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<StatsResponse>({
    totalCategories: 0,
    activeCategories: 0,
    totalSubcategories: 0,
    activeSubcategories: 0,
    totalCalculators: 0,
    activeCalculators: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Categories',
      total: stats.totalCategories,
      active: stats.activeCategories,
      icon: FolderTree,
      linkTab: 'categories' as const,
    },
    {
      title: 'Subcategories',
      total: stats.totalSubcategories,
      active: stats.activeSubcategories,
      icon: Layers,
      linkTab: 'subcategories' as const,
    },
    {
      title: 'Calculators',
      total: stats.totalCalculators,
      active: stats.activeCalculators,
      icon: CalcIcon,
      linkTab: 'calculators' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e4e5e7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#222325] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#74767e] mt-1">
            Real-time status of categories, subcategories, and calculation formulas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('categories')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#404145] bg-white hover:bg-[#f5f5f5] border border-[#dadbdd] rounded-md transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('calculator-editor', 'new')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-md transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Calculator</span>
          </button>
        </div>
      </div>

      {/* Numeric Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-[#e4e5e7] p-6 flex flex-col justify-between hover:border-[#1dbf73] hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#74767e] uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-[#e8faf1] text-[#1dbf73] flex items-center justify-center">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono text-[#222325] tabular-nums">
                    {isLoading ? '-' : card.total}
                  </span>
                  <span className="text-xs text-[#74767e]">total records</span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-[#404145]">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#1dbf73]" />
                  <span className="font-mono font-bold text-[#222325] tabular-nums">
                    {isLoading ? '-' : card.active}
                  </span>
                  <span>Active & visible on live site</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f5f5f5]">
                <button
                  type="button"
                  onClick={() => onNavigate(card.linkTab)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#1dbf73] hover:text-[#19a463] transition-colors cursor-pointer"
                >
                  <span>Manage {card.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fresh Installation Guide */}
      {stats.totalCategories === 0 ? (
        <div className="p-8 bg-white border border-[#e4e5e7] rounded-xl space-y-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#013a12] text-[#1dbf73] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#222325]">
                Fresh Setup: Empty Database
              </h3>
              <p className="text-xs sm:text-sm text-[#74767e] mt-1 max-w-2xl leading-relaxed">
                Your database is completely empty. Create your category hierarchy and calculators in 3 easy steps:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="p-5 rounded-lg border border-[#e4e5e7] bg-[#fafafa] space-y-2">
              <div className="text-xs font-bold font-mono text-[#1dbf73]">STEP 1</div>
              <h4 className="text-sm font-bold text-[#222325]">Create Category</h4>
              <p className="text-xs text-[#74767e] leading-relaxed">
                Define the top-level parent discipline (e.g. Finance, Health, Math).
              </p>
              <button
                type="button"
                onClick={() => onNavigate('categories')}
                className="mt-3 text-xs font-bold text-[#1dbf73] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Add Category</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-lg border border-[#e4e5e7] bg-[#fafafa] space-y-2">
              <div className="text-xs font-bold font-mono text-[#1dbf73]">STEP 2</div>
              <h4 className="text-sm font-bold text-[#222325]">Add Subcategory</h4>
              <p className="text-xs text-[#74767e] leading-relaxed">
                Group related calculators under your parent category (e.g. Loans, Fitness).
              </p>
              <button
                type="button"
                onClick={() => onNavigate('subcategories')}
                className="mt-3 text-xs font-bold text-[#1dbf73] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Add Subcategory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-lg border border-[#e4e5e7] bg-[#fafafa] space-y-2">
              <div className="text-xs font-bold font-mono text-[#1dbf73]">STEP 3</div>
              <h4 className="text-sm font-bold text-[#222325]">Build Calculator</h4>
              <p className="text-xs text-[#74767e] leading-relaxed">
                Add input fields, configure mathematical formulas, and test the live engine.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('calculator-editor', 'new')}
                className="mt-3 text-xs font-bold text-[#1dbf73] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Launch Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl border border-[#e4e5e7] space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1dbf73]" />
            <h3 className="text-sm font-bold text-[#222325]">
              Dynamic SEO Permalinks & Sitemap
            </h3>
          </div>
          <p className="text-xs text-[#74767e] leading-relaxed">
            The platform generates 3-tier canonical slugs (<code className="font-mono bg-[#f5f5f5] px-1 py-0.5 rounded text-[#222325]">/:category/:subcategory/:calculator</code>), JSON-LD schemas, and an up-to-date XML Sitemap.
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs font-bold">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="text-[#1dbf73] hover:underline"
            >
              Open Live Sitemap.xml
            </a>
            <span aria-hidden="true" className="text-[#dadbdd]">·</span>
            <button
              onClick={() => onNavigate('settings')}
              className="text-[#404145] hover:text-[#1dbf73] hover:underline cursor-pointer"
            >
              Configure SEO Meta
            </button>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-[#e4e5e7] space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#222325]" />
            <h3 className="text-sm font-bold text-[#222325]">
              Portable JSON Database Backup
            </h3>
          </div>
          <p className="text-xs text-[#74767e] leading-relaxed">
            Database writes are atomic and persistent. You can download complete JSON snapshot backups or restore at any time.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('settings')}
              className="text-xs font-bold text-[#1dbf73] hover:underline cursor-pointer"
            >
              Manage Database & Backups →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
