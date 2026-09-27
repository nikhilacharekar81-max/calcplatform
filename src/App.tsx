import React, { useState, useEffect } from 'react';
import { api } from './services/api.ts';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { SearchModal } from './components/common/SearchModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { CategoryPage } from './pages/CategoryPage.tsx';
import { SubcategoryPage } from './pages/SubcategoryPage.tsx';
import { CalculatorPage } from './pages/CalculatorPage.tsx';
import { SearchPage } from './pages/SearchPage.tsx';
import { AdminLoginPage } from './pages/AdminLoginPage.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { AdminCategories } from './pages/admin/AdminCategories.tsx';
import { AdminSubcategories } from './pages/admin/AdminSubcategories.tsx';
import { AdminCalculators } from './pages/admin/AdminCalculators.tsx';
import { AdminCalculatorEditor } from './pages/admin/AdminCalculatorEditor.tsx';
import { AdminModules } from './pages/admin/AdminModules.tsx';
import { AdminContentSeo } from './pages/admin/AdminContentSeo.tsx';
import { AdminSettings } from './pages/admin/AdminSettings.tsx';
import { EmptyState } from './components/common/EmptyState.tsx';
import { AlertCircle } from 'lucide-react';
import { Category, Subcategory, Calculator, SiteSettings } from './types/schema.ts';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'categories' | 'subcategories' | 'calculators' | 'modules' | 'content-seo' | 'settings' | 'calculator-editor'>('dashboard');
  const [activeCalculatorId, setActiveCalculatorId] = useState<string>('new');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<Partial<SiteSettings>>({
    brandName: 'CalcPlatform',
  });

  // Dynamic Route Resolver State
  const [routeData, setRouteData] = useState<{
    type: 'home' | 'category' | 'subcategory' | 'calculator';
    category?: Category;
    subcategory?: Subcategory;
    subcategories?: Subcategory[];
    calculators?: Calculator[];
    calculator?: Calculator;
    siblingSubcategories?: Subcategory[];
    relatedCalculators?: Calculator[];
  } | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeNotFound, setRouteNotFound] = useState(false);

  // Synchronize browser history navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global hotkey for search modal (`/` or `Ctrl+K`)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k')) &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check Admin Authentication
  useEffect(() => {
    if (currentPath.startsWith('/admin')) {
      api.checkAuth().then((res) => {
        setIsAdminAuthenticated(res.authenticated);
      });

      // Parse admin subpath: /admin/categories, /admin/subcategories, /admin/calculators, /admin/modules, /admin/settings, /admin/calculators/new
      const segments = currentPath.split('/').filter(Boolean);
      if (segments[1] === 'categories') setAdminTab('categories');
      else if (segments[1] === 'subcategories') setAdminTab('subcategories');
      else if (segments[1] === 'modules') setAdminTab('modules');
      else if (segments[1] === 'content-seo') setAdminTab('content-seo');
      else if (segments[1] === 'calculators') {
        if (segments[2]) {
          setAdminTab('calculator-editor');
          setActiveCalculatorId(segments[2]);
        } else {
          setAdminTab('calculators');
        }
      } else if (segments[1] === 'settings') setAdminTab('settings');
      else setAdminTab('dashboard');
    }
  }, [currentPath]);

  // Resolve Public Dynamic Routes
  useEffect(() => {
    if (currentPath.startsWith('/admin') || currentPath === '/search') {
      return;
    }

    if (currentPath === '/' || currentPath === '') {
      setRouteData({ type: 'home' });
      setRouteNotFound(false);
      return;
    }

    setRouteLoading(true);
    setRouteNotFound(false);

    api
      .resolvePath(currentPath)
      .then((data) => {
        setRouteData(data);
        setRouteNotFound(false);
      })
      .catch((err) => {
        if (err.message === 'NOT_FOUND') {
          setRouteNotFound(true);
        } else {
          console.error('Route resolve error:', err);
          setRouteNotFound(true);
        }
      })
      .finally(() => {
        setRouteLoading(false);
      });
  }, [currentPath]);

  // Navigation handlers
  const handleAdminNavigate = (tab: typeof adminTab, param?: string) => {
    setAdminTab(tab);
    if (tab === 'calculator-editor' && param) {
      setActiveCalculatorId(param);
      window.history.pushState({}, '', `/admin/calculators/${param}`);
    } else if (tab === 'dashboard') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', `/admin/${tab}`);
    }
  };

  const navigateTo = (url: string) => {
    window.history.pushState({}, '', url);
    setCurrentPath(url);
    window.scrollTo(0, 0);
  };

  // ==========================================
  // ADMIN CONSOLE ROUTE
  // ==========================================
  if (currentPath.startsWith('/admin')) {
    if (isAdminAuthenticated === null) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          Verifying security authorization...
        </div>
      );
    }

    if (!isAdminAuthenticated) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => {
            setIsAdminAuthenticated(true);
            setAdminTab('dashboard');
            navigateTo('/admin');
          }}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onNavigate={handleAdminNavigate}
        onLogout={() => {
          setIsAdminAuthenticated(false);
          navigateTo('/admin');
        }}
      >
        {adminTab === 'dashboard' && <AdminDashboard onNavigate={handleAdminNavigate} />}
        {adminTab === 'categories' && <AdminCategories />}
        {adminTab === 'subcategories' && <AdminSubcategories />}
        {adminTab === 'calculators' && <AdminCalculators onNavigate={handleAdminNavigate} />}
        {adminTab === 'modules' && <AdminModules />}
        {adminTab === 'content-seo' && <AdminContentSeo />}
        {adminTab === 'calculator-editor' && (
          <AdminCalculatorEditor
            calculatorId={activeCalculatorId}
            onBack={() => handleAdminNavigate('calculators')}
            onSaved={() => handleAdminNavigate('calculators')}
          />
        )}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // ==========================================
  // PUBLIC WEBSITE ROUTES
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <Header
        onOpenSearch={() => setIsSearchModalOpen(true)}
        brandName={siteSettings.brandName || 'CalcPlatform'}
      />

      <div className="flex-1 w-full">
        {currentPath === '/search' ? (
          <SearchPage />
        ) : routeLoading ? (
          <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Loading calculator platform...</p>
          </div>
        ) : routeNotFound ? (
          <div className="w-full max-w-7xl mx-auto px-4 py-16">
            <EmptyState
              icon={AlertCircle}
              title="404 - Page Not Found"
              description="The requested category, subcategory, or calculator does not exist or may currently be disabled."
              actionLabel="Return to Homepage"
              actionHref="/"
              secondaryLabel="Admin Dashboard"
              secondaryHref="/admin"
            />
          </div>
        ) : routeData?.type === 'home' ? (
          <HomePage
            onOpenSearch={() => setIsSearchModalOpen(true)}
            brandName={siteSettings.brandName || 'CalcPlatform'}
          />
        ) : routeData?.type === 'category' && routeData.category ? (
          <CategoryPage
            category={routeData.category}
            subcategories={routeData.subcategories || []}
            calculators={routeData.calculators || []}
          />
        ) : routeData?.type === 'subcategory' && routeData.category && routeData.subcategory ? (
          <SubcategoryPage
            category={routeData.category}
            subcategory={routeData.subcategory}
            calculators={routeData.calculators || []}
            siblingSubcategories={routeData.siblingSubcategories || []}
          />
        ) : routeData?.type === 'calculator' && routeData.category && routeData.subcategory && routeData.calculator ? (
          <CalculatorPage
            category={routeData.category}
            subcategory={routeData.subcategory}
            calculator={routeData.calculator}
            relatedCalculators={routeData.relatedCalculators || []}
          />
        ) : (
          <HomePage
            onOpenSearch={() => setIsSearchModalOpen(true)}
            brandName={siteSettings.brandName || 'CalcPlatform'}
          />
        )}
      </div>

      <Footer
        brandName={siteSettings.brandName || 'CalcPlatform'}
        footerNotice={siteSettings.footerNotice}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectCalculator={(url) => navigateTo(url)}
      />
    </div>
  );
}
