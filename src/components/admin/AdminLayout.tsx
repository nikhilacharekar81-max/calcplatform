import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderTree,
  Layers,
  Calculator,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';
import { api } from '../../services/api.ts';

interface AdminLayoutProps {
  currentTab: 'dashboard' | 'categories' | 'subcategories' | 'calculators' | 'modules' | 'content-seo' | 'settings' | 'calculator-editor';
  onNavigate: (tab: 'dashboard' | 'categories' | 'subcategories' | 'calculators' | 'modules' | 'content-seo' | 'settings' | 'calculator-editor', param?: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onNavigate,
  onLogout,
  children,
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'subcategories', label: 'Subcategories', icon: Layers },
    { id: 'calculators', label: 'Calculators', icon: Calculator },
    { id: 'modules', label: 'Modules & Order', icon: Layers },
    { id: 'content-seo', label: 'Rich-Text & SEO Content', icon: BookOpen },
    { id: 'settings', label: 'Settings & SEO', icon: Settings },
  ] as const;

  const handleLogoutClick = async () => {
    await api.logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#e4e5e7] shrink-0 select-none">
        {/* Brand Bar */}
        <div className="h-16 px-6 border-b border-[#e4e5e7] flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" target="_blank" rel="noreferrer" className="text-xl font-black text-[#222325] tracking-tighter">
              <span>calcplatform</span>
              <span className="text-[#1dbf73] font-extrabold text-2xl">.</span>
            </a>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-[11px] font-bold text-[#74767e] uppercase tracking-wider px-3 py-2">
            Admin Console
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id || (item.id === 'calculators' && currentTab === 'calculator-editor');

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-md transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#e8faf1] text-[#013a12] border-l-4 border-[#1dbf73]'
                    : 'text-[#62646a] hover:text-[#222325] hover:bg-[#f7f7f7]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 stroke-[1.75] ${isActive ? 'text-[#1dbf73]' : 'text-[#74767e]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#e4e5e7] space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#62646a] hover:text-[#222325] hover:bg-[#f5f5f5] rounded-md transition-colors"
          >
            <span>Live Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#74767e]" />
          </a>

          <button
            type="button"
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-[#e4e5e7] px-4 py-3 flex items-center justify-between">
        <div className="text-lg font-black text-[#222325] tracking-tight">
          <span>calcplatform</span>
          <span className="text-[#1dbf73] font-extrabold text-xl">.</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 text-[#404145] hover:text-[#222325] rounded-md"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-white border-b border-[#e4e5e7] p-4 space-y-1.5 z-30">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileNavOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-md text-left ${
                  isActive ? 'bg-[#e8faf1] text-[#013a12]' : 'text-[#62646a] hover:bg-[#f7f7f7]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#1dbf73]" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-[#e4e5e7] flex items-center justify-between">
            <a href="/" className="text-xs font-semibold text-[#62646a]">
              View Site
            </a>
            <button
              onClick={handleLogoutClick}
              className="text-xs font-bold text-rose-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="hidden md:flex h-16 bg-white border-b border-[#e4e5e7] px-8 items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#74767e] font-semibold capitalize">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#222325] font-bold">{currentTab.replace('-', ' ')}</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#1dbf73] hover:text-[#19a463] px-3.5 py-1.5 rounded-md border border-[#1dbf73]/30 hover:bg-[#e8faf1] flex items-center gap-1.5 transition-colors"
            >
              <span>View Public Platform</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#1dbf73]" />
            </a>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
