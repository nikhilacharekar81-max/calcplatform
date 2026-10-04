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
import { EmptyState } from './components/common/EmptyState.tsx';
import { AlertCircle } from 'lucide-react';
import { Category, Subcategory, Calculator, SiteSettings, BlogPost } from './types/schema.ts';
import { BlogIndexPage } from './pages/BlogIndexPage.tsx';
import { BlogPostPage } from './pages/BlogPostPage.tsx';
import { AdminBlogCategories } from './pages/admin/AdminBlogCategories.tsx';
import { ScenarioStudioPage } from './pages/ScenarioStudioPage.tsx';

// Code-split admin pages so public visitors never load heavy admin bundles on hard refresh
const AdminLoginPage = React.lazy(() =>
  import('./pages/AdminLoginPage.tsx').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminLayout = React.lazy(() =>
  import('./components/admin/AdminLayout.tsx').then((m) => ({ default: m.AdminLayout }))
);
const AdminDashboard = React.lazy(() =>
  import('./pages/admin/AdminDashboard.tsx').then((m) => ({ default: m.AdminDashboard }))
);
const AdminCategories = React.lazy(() =>
  import('./pages/admin/AdminCategories.tsx').then((m) => ({ default: m.AdminCategories }))
);
const AdminSubcategories = React.lazy(() =>
  import('./pages/admin/AdminSubcategories.tsx').then((m) => ({ default: m.AdminSubcategories }))
);
const AdminCalculators = React.lazy(() =>
  import('./pages/admin/AdminCalculators.tsx').then((m) => ({ default: m.AdminCalculators }))
);
const AdminCalculatorEditor = React.lazy(() =>
  import('./pages/admin/AdminCalculatorEditor.tsx').then((m) => ({ default: m.AdminCalculatorEditor }))
);
const AdminModules = React.lazy(() =>
  import('./pages/admin/AdminModules.tsx').then((m) => ({ default: m.AdminModules }))
);
const AdminContentSeo = React.lazy(() =>
  import('./pages/admin/AdminContentSeo.tsx').then((m) => ({ default: m.AdminContentSeo }))
);
const AdminSettings = React.lazy(() =>
  import('./pages/admin/AdminSettings.tsx').then((m) => ({ default: m.AdminSettings }))
);
const AdminEmbedStudio = React.lazy(() =>
  import('./pages/admin/AdminEmbedStudio.tsx').then((m) => ({ default: m.AdminEmbedStudio }))
);
const AdminBlogManager = React.lazy(() =>
  import('./pages/admin/AdminBlogManager.tsx').then((m) => ({ default: m.AdminBlogManager }))
);
const AdminBlogEditor = React.lazy(() =>
  import('./pages/admin/AdminBlogEditor.tsx').then((m) => ({ default: m.AdminBlogEditor }))
);
const AdminBlogDashboard = React.lazy(() =>
  import('./pages/admin/AdminBlogDashboard.tsx').then((m) => ({ default: m.AdminBlogDashboard }))
);

const isSubpagePath = (path: string) => {
  return path !== '/' && path !== '' && !path.startsWith('/admin') && path !== '/search' && !path.startsWith('/blog') && path !== '/scenario-studio' && path !== '/studio';
};

const getInitialRouteData = () => {
  if (typeof window !== 'undefined' && (window as any).__INITIAL_ROUTE_DATA__) {
    const data = (window as any).__INITIAL_ROUTE_DATA__;
    const currentClean = window.location.pathname.split('?')[0].split('#')[0].replace(/^\/|\/$/g, '').toLowerCase();
    if (data.type === 'home' && currentClean === '') return data;
    if (data.type === 'category' && (data.category?.slug?.toLowerCase() === currentClean || currentClean.endsWith(data.category?.slug?.toLowerCase() || ''))) return data;
    if (data.type === 'subcategory' && (`${data.category?.slug}/${data.subcategory?.slug}`.toLowerCase() === currentClean || data.subcategory?.slug?.toLowerCase() === currentClean)) return data;
    if (data.type === 'calculator') {
      const fullCalcPath = `${data.category?.slug}/${data.subcategory?.slug}/${data.calculator?.slug}`.toLowerCase();
      const calcSlug = data.calculator?.slug?.toLowerCase();
      if (
        fullCalcPath === currentClean ||
        calcSlug === currentClean ||
        currentClean.endsWith(calcSlug || '') ||
        (currentClean.includes('tax') && (calcSlug?.includes('tax') || fullCalcPath.includes('tax'))) ||
        currentClean.includes('income-tax')
      ) {
        return data;
      }
    }
  }
  return null;
};

const getNormalizedPath = () => {
  if (typeof window === 'undefined') return '/';
  const hash = window.location.hash;
  if (hash && hash.startsWith('#/')) {
    return hash.substring(1).split('?')[0].split('#')[0] || '/';
  }
  return window.location.pathname;
};

export default function App() {
  const [currentPath, setCurrentPath] = useState(getNormalizedPath);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'categories' | 'subcategories' | 'calculators' | 'modules' | 'content-seo' | 'settings' | 'calculator-editor' | 'embed-studio' | 'blogs' | 'blog-editor' | 'blog-categories' | 'blog-dashboard'>('dashboard');
  const [activeCalculatorId, setActiveCalculatorId] = useState<string>('new');
  const [activeBlogPost, setActiveBlogPost] = useState<BlogPost | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<Partial<SiteSettings>>(() => {
    if (typeof window !== 'undefined' && (window as any).__SITE_SETTINGS__) {
      return (window as any).__SITE_SETTINGS__;
    }
    return { brandName: 'CalcPlatform' };
  });

  const initialSsrData = getInitialRouteData();
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
  } | null>(initialSsrData);

  // Initialize routeLoading true ONLY if we don't have pre-injected SSR data
  const [routeLoading, setRouteLoading] = useState(() => {
    if (initialSsrData) return false;
    return isSubpagePath(getNormalizedPath());
  });
  const [routeNotFound, setRouteNotFound] = useState(false);

  // Synchronize browser history navigation (Back / Forward & Hash Routing)
  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPath(getNormalizedPath());
    };
    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
    };
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

  // Intercept all internal anchor clicks for instantaneous SPA transitions (no page reloads)
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !anchor.getAttribute('target') &&
        !anchor.getAttribute('download') &&
        !anchor.hasAttribute('data-native-link')
      ) {
        e.preventDefault();
        navigateTo(href);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [currentPath]);

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
      else if (segments[1] === 'embed-studio') setAdminTab('embed-studio');
      else if (segments[1] === 'calculators') {
        if (segments[2]) {
          setAdminTab('calculator-editor');
          setActiveCalculatorId(segments[2]);
        } else {
          setAdminTab('calculators');
        }
      } else if (segments[1] === 'blogs') {
        setAdminTab('blogs');
      } else if (segments[1] === 'blog-categories') {
        setAdminTab('blog-categories');
      } else if (segments[1] === 'blog-dashboard') {
        setAdminTab('blog-dashboard');
      } else if (segments[1] === 'settings') setAdminTab('settings');
      else setAdminTab('dashboard');
    }
  }, [currentPath]);

  // Resolve Public Dynamic Routes
  useEffect(() => {
    if (currentPath.startsWith('/admin') || currentPath === '/search' || currentPath === '/blog' || currentPath.startsWith('/blog/')) {
      setRouteLoading(false);
      setRouteNotFound(false);
      return;
    }

    if (currentPath === '/' || currentPath === '') {
      setRouteData({ type: 'home' });
      setRouteNotFound(false);
      setRouteLoading(false);
      return;
    }

    const cleanKey = currentPath.split('?')[0].split('#')[0].replace(/^\/|\/$/g, '').toLowerCase();
    const fullCalcPath = routeData?.calculator
      ? `${routeData.category?.slug}/${routeData.subcategory?.slug}/${routeData.calculator?.slug}`.toLowerCase()
      : '';
    const calcSlug = routeData?.calculator?.slug?.toLowerCase() || '';

    if (
      (cleanKey === '' && routeData?.type === 'home') ||
      (routeData?.type === 'category' && (routeData.category?.slug?.toLowerCase() === cleanKey || cleanKey.endsWith(routeData.category?.slug?.toLowerCase() || ''))) ||
      (routeData?.type === 'subcategory' && (`${routeData.category?.slug}/${routeData.subcategory?.slug}`.toLowerCase() === cleanKey || routeData.subcategory?.slug?.toLowerCase() === cleanKey)) ||
      (routeData?.type === 'calculator' && (fullCalcPath === cleanKey || calcSlug === cleanKey || cleanKey.endsWith(calcSlug) || (cleanKey.includes('tax') && calcSlug.includes('tax'))))
    ) {
      setRouteLoading(false);
      setRouteNotFound(false);
      return;
    }

    let isCancelled = false;
    setRouteLoading(true);
    setRouteNotFound(false);

    api
      .resolvePath(currentPath)
      .then((data) => {
        if (isCancelled) return;
        setRouteData(data);
        setRouteNotFound(false);
      })
      .catch((err) => {
        if (isCancelled) return;
        if (err.message === 'NOT_FOUND') {
          setRouteNotFound(true);
        } else {
          console.error('Route resolve error:', err);
          setRouteNotFound(true);
        }
      })
      .finally(() => {
        if (isCancelled) return;
        setRouteLoading(false);
      });

    return () => {
      isCancelled = true;
    };
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
    if (url === currentPath) return;
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      window.location.hash = `#${url}`;
    } else {
      window.history.pushState({}, '', url);
    }
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
        <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading sign in...</div>}>
          <AdminLoginPage
            onLoginSuccess={() => {
              setIsAdminAuthenticated(true);
              setAdminTab('dashboard');
              navigateTo('/admin');
            }}
          />
        </React.Suspense>
      );
    }

    return (
      <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading admin console...</div>}>
        <AdminLayout
          currentTab={adminTab}
          onNavigate={handleAdminNavigate}
          onLogout={() => {
            setIsAdminAuthenticated(false);
            navigateTo('/admin');
          }}
        >
           {adminTab === 'dashboard' && <AdminDashboard onNavigate={handleAdminNavigate} />}
          {adminTab === 'blog-dashboard' && <AdminBlogDashboard onNavigate={handleAdminNavigate} />}
          {adminTab === 'categories' && <AdminCategories />}
          {adminTab === 'subcategories' && <AdminSubcategories />}
          {adminTab === 'calculators' && <AdminCalculators onNavigate={handleAdminNavigate} />}
          {adminTab === 'modules' && <AdminModules />}
          {adminTab === 'content-seo' && <AdminContentSeo />}
          {adminTab === 'embed-studio' && <AdminEmbedStudio />}
          {adminTab === 'blogs' && (
            <AdminBlogManager
              onEditPost={(post) => {
                setActiveBlogPost(post);
                setAdminTab('blog-editor');
              }}
            />
          )}
          {adminTab === 'blog-editor' && (
            <AdminBlogEditor
              post={activeBlogPost}
              onBack={() => setAdminTab('blogs')}
              onSaved={() => setAdminTab('blogs')}
            />
          )}
          {adminTab === 'blog-categories' && <AdminBlogCategories />}
          {adminTab === 'calculator-editor' && (
            <AdminCalculatorEditor
              calculatorId={activeCalculatorId}
              onBack={() => handleAdminNavigate('calculators')}
              onSaved={() => handleAdminNavigate('calculators')}
            />
          )}
          {adminTab === 'settings' && <AdminSettings />}
        </AdminLayout>
      </React.Suspense>
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
        ) : (currentPath === '/scenario-studio' || currentPath === '/studio') ? (
          <ScenarioStudioPage />
        ) : currentPath === '/blog' ? (
          <BlogIndexPage />
        ) : currentPath.startsWith('/blog/') ? (
          <BlogPostPage slug={currentPath.split('/')[2]} />
        ) : (currentPath === '/' || currentPath === '') ? (
          <HomePage
            onOpenSearch={() => setIsSearchModalOpen(true)}
            brandName={siteSettings.brandName || 'CalcPlatform'}
          />
        ) : routeLoading ? (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-20 h-4 bg-slate-100 rounded-md animate-pulse" />
              <div className="text-slate-300">/</div>
              <div className="w-24 h-4 bg-slate-100 rounded-md animate-pulse" />
            </div>
            <div className="h-9 bg-slate-100 rounded-lg w-72 max-w-full animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-md w-96 max-w-full animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              <div className="lg:col-span-8 bg-slate-50 border border-slate-100 rounded-2xl h-80 p-6 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-[#1dbf73] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-slate-400">Loading calculator...</span>
                </div>
              </div>
              <div className="lg:col-span-4 bg-slate-50 border border-slate-100 rounded-2xl h-72" />
            </div>
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
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-20 h-4 bg-slate-100 rounded-md animate-pulse" />
              <div className="text-slate-300">/</div>
              <div className="w-24 h-4 bg-slate-100 rounded-md animate-pulse" />
            </div>
            <div className="h-9 bg-slate-100 rounded-lg w-72 max-w-full animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-md w-96 max-w-full animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              <div className="lg:col-span-8 bg-slate-50 border border-slate-100 rounded-2xl h-80 p-6 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-[#1dbf73] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-slate-400">Loading calculator...</span>
                </div>
              </div>
              <div className="lg:col-span-4 bg-slate-50 border border-slate-100 rounded-2xl h-72" />
            </div>
          </div>
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
