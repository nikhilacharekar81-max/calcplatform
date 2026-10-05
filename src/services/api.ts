import { Category, Subcategory, Calculator, StatsResponse, SiteSettings, BlogPost, BlogCategory, BlogSubcategory } from '../types/schema.ts';

const TOKEN_KEY = 'calc_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// High-performance client-side memory cache with request deduplication
const routeCache = new Map<string, any>();
const inFlightRoutePromises = new Map<string, Promise<any>>();
let categoriesCache: any = typeof window !== 'undefined' ? (window as any).__INITIAL_CATEGORIES__ || null : null;
let inFlightCategoriesPromise: Promise<any> | null = null;

// Pre-fill routeCache from SSR initial payload
if (typeof window !== 'undefined' && (window as any).__INITIAL_ROUTE_DATA__) {
  const currentKey = window.location.pathname.split('?')[0].split('#')[0].replace(/^\/|\/$/g, '').toLowerCase();
  routeCache.set(currentKey, (window as any).__INITIAL_ROUTE_DATA__);
}

export function clearPublicCache(): void {
  routeCache.clear();
  inFlightRoutePromises.clear();
  categoriesCache = null;
  inFlightCategoriesPromise = null;
}

export const api = {
  // Public APIs
  async getCategories(forceRefresh = false): Promise<Array<Category & { subcategoriesCount: number; calculatorsCount: number; subcategories: Subcategory[] }>> {
    if (!forceRefresh && categoriesCache) {
      return categoriesCache;
    }
    if (!forceRefresh && inFlightCategoriesPromise) {
      return inFlightCategoriesPromise;
    }

    inFlightCategoriesPromise = (async () => {
      try {
        const res = await fetch('/api/public/categories');
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch categories`);
        const data = await res.json();
        if (Array.isArray(data)) {
          categoriesCache = data;
        }
        return data;
      } catch (err) {
        if (categoriesCache) return categoriesCache;
        console.warn('Network error fetching categories, returning empty array fallback:', err);
        return [];
      } finally {
        inFlightCategoriesPromise = null;
      }
    })();

    return inFlightCategoriesPromise;
  },

  async getSubcategories(params?: { categorySlug?: string; categoryId?: string }): Promise<Array<Subcategory & { category?: Category; calculatorsCount: number }>> {
    try {
      const query = new URLSearchParams();
      if (params?.categorySlug) query.set('categorySlug', params.categorySlug);
      if (params?.categoryId) query.set('categoryId', params.categoryId);
      const res = await fetch(`/api/public/subcategories?${query.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch subcategories`);
      return await res.json();
    } catch (err) {
      console.warn('Network error fetching subcategories:', err);
      return [];
    }
  },

  async getCalculators(params?: {
    categorySlug?: string;
    subcategorySlug?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<Array<Calculator & { category?: Category; subcategory?: Subcategory }>> {
    try {
      const query = new URLSearchParams();
      if (params?.categorySlug) query.set('categorySlug', params.categorySlug);
      if (params?.subcategorySlug) query.set('subcategorySlug', params.subcategorySlug);
      if (params?.search) query.set('search', params.search);
      if (params?.featured) query.set('featured', 'true');
      if (params?.limit) query.set('limit', params.limit.toString());

      const res = await fetch(`/api/public/calculators?${query.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch calculators`);
      return await res.json();
    } catch (err) {
      console.warn('Network error fetching calculators:', err);
      return [];
    }
  },

  async resolvePath(path: string, forceRefresh = false): Promise<{
    type: 'home' | 'category' | 'subcategory' | 'calculator';
    category?: Category;
    subcategory?: Subcategory;
    subcategories?: Subcategory[];
    calculators?: Calculator[];
    calculator?: Calculator;
    siblingSubcategories?: Subcategory[];
    relatedCalculators?: Calculator[];
  }> {
    const normalizedKey = path.split('?')[0].split('#')[0].replace(/^\/|\/$/g, '').toLowerCase();
    if (!forceRefresh && routeCache.has(normalizedKey)) {
      return routeCache.get(normalizedKey);
    }
    if (!forceRefresh && inFlightRoutePromises.has(normalizedKey)) {
      return inFlightRoutePromises.get(normalizedKey)!;
    }

    const routePromise = (async () => {
      try {
        const res = await fetch(`/api/public/resolve?path=${encodeURIComponent(path)}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('NOT_FOUND');
          }
          throw new Error('Failed to resolve path');
        }
        const data = await res.json();
        routeCache.set(normalizedKey, data);
        return data;
      } finally {
        inFlightRoutePromises.delete(normalizedKey);
      }
    })();

    inFlightRoutePromises.set(normalizedKey, routePromise);
    return routePromise;
  },

  async getStats(): Promise<StatsResponse> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch statistics');
    return res.json();
  },

  // Auth APIs
  async login(credentials: { username: string; password: string }): Promise<{ success: boolean; token?: string; error?: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setAdminToken(data.token);
    }
    return data;
  },

  async checkAuth(): Promise<{ authenticated: boolean; username?: string }> {
    const token = getAdminToken();
    if (!token) return { authenticated: false };
    try {
      const res = await fetch('/api/auth/check', {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return { authenticated: false };
      return res.json();
    } catch {
      return { authenticated: false };
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } finally {
      clearAdminToken();
    }
  },

  // Admin Categories
  async adminGetCategories(params?: { search?: string; status?: 'active' | 'inactive' }): Promise<Array<Category & { subcategoriesCount: number; calculatorsCount: number }>> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    const res = await fetch(`/api/admin/categories?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin categories');
    return res.json();
  },

  async adminCreateCategory(category: Partial<Category>): Promise<Category> {
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(category),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create category');
    clearPublicCache();
    return data;
  },

  async adminUpdateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update category');
    clearPublicCache();
    return data;
  },

  async adminToggleCategory(id: string): Promise<{ success: boolean; isActive: boolean }> {
    const res = await fetch(`/api/admin/categories/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle category');
    clearPublicCache();
    return data;
  },

  async adminDeleteCategory(id: string, force: boolean = false): Promise<{ success: boolean; requiresConfirmation?: boolean; subCount?: number; calcCount?: number; error?: string }> {
    const res = await fetch(`/api/admin/categories/${id}?force=${force ? 'true' : 'false'}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 409) return data;
      throw new Error(data.error || 'Failed to delete category');
    }
    clearPublicCache();
    return data;
  },

  async adminReorderCategories(orderedIds: string[]): Promise<void> {
    const res = await fetch('/api/admin/categories/reorder', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderedIds }),
    });
    if (!res.ok) throw new Error('Failed to reorder categories');
    clearPublicCache();
  },

  async adminBulkCategoryStatus(ids: string[], isActive: boolean): Promise<{ success: boolean; count?: number }> {
    const res = await fetch('/api/admin/categories/bulk-status', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids, isActive }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to bulk update categories status');
    clearPublicCache();
    return data;
  },

  async adminBulkCategoryDelete(ids: string[]): Promise<{ success: boolean; count?: number; deletedSubcategories?: number; deletedCalculators?: number }> {
    const res = await fetch('/api/admin/categories/bulk-delete', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to bulk delete categories');
    clearPublicCache();
    return data;
  },

  // Admin Subcategories
  async adminGetSubcategories(params?: { categoryId?: string; search?: string; status?: 'active' | 'inactive' }): Promise<Array<Subcategory & { category?: Category; calculatorsCount: number }>> {
    const query = new URLSearchParams();
    if (params?.categoryId) query.set('categoryId', params.categoryId);
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    const res = await fetch(`/api/admin/subcategories?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin subcategories');
    return res.json();
  },

  async adminCreateSubcategory(subcategory: Partial<Subcategory>): Promise<Subcategory> {
    const res = await fetch('/api/admin/subcategories', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(subcategory),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create subcategory');
    clearPublicCache();
    return data;
  },

  async adminUpdateSubcategory(id: string, updates: Partial<Subcategory>): Promise<Subcategory> {
    const res = await fetch(`/api/admin/subcategories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update subcategory');
    clearPublicCache();
    return data;
  },

  async adminToggleSubcategory(id: string): Promise<{ success: boolean; isActive: boolean }> {
    const res = await fetch(`/api/admin/subcategories/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle subcategory');
    clearPublicCache();
    return data;
  },

  async adminDeleteSubcategory(id: string, force: boolean = false): Promise<{ success: boolean; requiresConfirmation?: boolean; calcCount?: number; error?: string }> {
    const res = await fetch(`/api/admin/subcategories/${id}?force=${force ? 'true' : 'false'}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 409) return data;
      throw new Error(data.error || 'Failed to delete subcategory');
    }
    clearPublicCache();
    return data;
  },

  async adminReorderSubcategories(orderedIds: string[]): Promise<void> {
    const res = await fetch('/api/admin/subcategories/reorder', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderedIds }),
    });
    if (!res.ok) throw new Error('Failed to reorder subcategories');
    clearPublicCache();
  },

  async adminBulkSubcategoryStatus(ids: string[], isActive: boolean): Promise<{ success: boolean; count?: number }> {
    const res = await fetch('/api/admin/subcategories/bulk-status', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids, isActive }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to bulk update subcategories status');
    clearPublicCache();
    return data;
  },

  async adminBulkSubcategoryDelete(ids: string[]): Promise<{ success: boolean; count?: number; deletedCalculators?: number }> {
    const res = await fetch('/api/admin/subcategories/bulk-delete', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to bulk delete subcategories');
    clearPublicCache();
    return data;
  },

  // Admin Calculators
  async adminGetCalculators(params?: { categoryId?: string; subcategoryId?: string; search?: string; status?: 'active' | 'inactive' }): Promise<Array<Calculator & { category?: Category; subcategory?: Subcategory }>> {
    const query = new URLSearchParams();
    if (params?.categoryId) query.set('categoryId', params.categoryId);
    if (params?.subcategoryId) query.set('subcategoryId', params.subcategoryId);
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    const res = await fetch(`/api/admin/calculators?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin calculators');
    return res.json();
  },

  async adminGetCalculator(id: string): Promise<Calculator> {
    const res = await fetch(`/api/admin/calculators/${id}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch calculator');
    return data;
  },

  async adminCreateCalculator(calculator: Partial<Calculator>): Promise<Calculator> {
    const res = await fetch('/api/admin/calculators', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(calculator),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create calculator');
    clearPublicCache();
    return data;
  },

  async adminUpdateCalculator(id: string, updates: Partial<Calculator>): Promise<Calculator> {
    const res = await fetch(`/api/admin/calculators/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update calculator');
    clearPublicCache();
    return data;
  },

  async adminToggleCalculator(id: string): Promise<{ success: boolean; isActive: boolean }> {
    const res = await fetch(`/api/admin/calculators/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle calculator');
    clearPublicCache();
    return data;
  },

  async adminDuplicateCalculator(id: string): Promise<Calculator> {
    const res = await fetch(`/api/admin/calculators/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to duplicate calculator');
    clearPublicCache();
    return data;
  },

  async adminDeleteCalculator(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/calculators/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete calculator');
    clearPublicCache();
    return data;
  },

  async adminReorderCalculators(orderedIds: string[]): Promise<void> {
    const res = await fetch('/api/admin/calculators/reorder', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderedIds }),
    });
    if (!res.ok) throw new Error('Failed to reorder calculators');
    clearPublicCache();
  },

  async adminBulkCalculatorStatus(ids: string[], isActive: boolean): Promise<{ success: boolean; count?: number }> {
    const res = await fetch('/api/admin/calculators/bulk-status', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids, isActive }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to bulk update calculators status');
    clearPublicCache();
    return data;
  },

  async adminBulkCalculatorDelete(ids: string[]): Promise<{ success: boolean; count?: number }> {
    const res = await fetch('/api/admin/calculators/bulk-delete', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to bulk delete calculators');
    clearPublicCache();
    return data;
  },

  async adminApplyModulesToAll(modules: any[]): Promise<{ success: boolean; count: number }> {
    const res = await fetch('/api/admin/modules/apply-all', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ modules }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to apply modules to all calculators');
    clearPublicCache();
    return data;
  },

  // Admin Settings & Backup
  async adminGetSettings(): Promise<SiteSettings & { hasPassword?: boolean }> {
    const res = await fetch('/api/admin/settings', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async adminUpdateSettings(settings: Partial<SiteSettings & { newPassword?: string }>): Promise<{ success: boolean; settings: SiteSettings }> {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data;
  },

  async adminRestoreDatabase(payload: any): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/admin/restore', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to restore database');
    return data;
  },

  // ==========================================
  // PUBLIC BLOG APIS
  // ==========================================
  async getBlogs(params?: {
    category?: string;
    tag?: string;
    search?: string;
    limit?: number;
    offset?: number;
    featured?: boolean;
  }): Promise<{ posts: BlogPost[]; total: number; offset: number; limit: number }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    if (params?.featured) query.set('featured', 'true');

    const res = await fetch(`/api/public/blogs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch blog posts');
    return res.json();
  },

  async getBlogBySlug(slug: string): Promise<{
    post: BlogPost;
    relatedCalculators: Calculator[];
    relatedPosts: BlogPost[];
  }> {
    const res = await fetch(`/api/public/blogs/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Blog post not found');
    return res.json();
  },

  async getBlogCategories(): Promise<Array<BlogCategory & { postCount: number }>> {
    const res = await fetch('/api/public/blog-categories');
    if (!res.ok) throw new Error('Failed to fetch blog categories');
    return res.json();
  },

  // ==========================================
  // ADMIN BLOG APIS
  // ==========================================
  async adminGetBlogs(params?: { status?: string; category?: string; search?: string }): Promise<BlogPost[]> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`/api/admin/blogs?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin blog posts');
    return res.json();
  },

  async adminGetBlogById(id: string): Promise<BlogPost> {
    const res = await fetch(`/api/admin/blogs/${encodeURIComponent(id)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch blog post');
    return res.json();
  },

  async adminCreateBlog(post: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch('/api/admin/blogs', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(post),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create blog post');
    return data;
  },

  async adminUpdateBlog(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch(`/api/admin/blogs/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(post),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update blog post');
    return data;
  },

  async adminDeleteBlog(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/blogs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete blog post');
    return data;
  },

  async adminToggleBlogStatus(id: string): Promise<{ success: boolean; status: 'published' | 'draft'; post: BlogPost }> {
    const res = await fetch(`/api/admin/blogs/${encodeURIComponent(id)}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle blog post status');
    return data;
  },

  async adminBulkBlogStatus(ids: string[], status: 'published' | 'draft'): Promise<{ success: boolean; count: number }> {
    const res = await fetch('/api/admin/blogs/bulk-status', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids, status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update bulk blog status');
    return data;
  },

  async adminBulkBlogDelete(ids: string[]): Promise<{ success: boolean; count: number }> {
    const res = await fetch('/api/admin/blogs/bulk-delete', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to bulk delete blog posts');
    return data;
  },

  // ==========================================
  // BLOG CATEGORIES & SUBCATEGORIES APIS
  // ==========================================
  async adminGetBlogCategories(): Promise<BlogCategory[]> {
    const res = await fetch('/api/admin/blog-categories', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch blog categories');
    return res.json();
  },

  async adminCreateBlogCategory(cat: { name: string; slug?: string; description?: string; order?: number; isActive?: boolean }): Promise<BlogCategory> {
    const res = await fetch('/api/admin/blog-categories', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cat),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create blog category');
    return data;
  },

  async adminUpdateBlogCategory(id: string, cat: { name?: string; slug?: string; description?: string; order?: number; isActive?: boolean }): Promise<BlogCategory> {
    const res = await fetch(`/api/admin/blog-categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(cat),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update blog category');
    return data;
  },

  async adminDeleteBlogCategory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/blog-categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete blog category');
    return data;
  },

  async adminGetBlogSubcategories(blogCategoryId?: string): Promise<Array<BlogSubcategory & { categoryName?: string }>> {
    const query = new URLSearchParams();
    if (blogCategoryId) query.set('blogCategoryId', blogCategoryId);

    const res = await fetch(`/api/admin/blog-subcategories?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch blog subcategories');
    return res.json();
  },

  async adminCreateBlogSubcategory(sub: { blogCategoryId: string; name: string; slug?: string; description?: string; order?: number; isActive?: boolean }): Promise<BlogSubcategory> {
    const res = await fetch('/api/admin/blog-subcategories', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(sub),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create blog subcategory');
    return data;
  },

  async adminUpdateBlogSubcategory(id: string, sub: { blogCategoryId?: string; name?: string; slug?: string; description?: string; order?: number; isActive?: boolean }): Promise<BlogSubcategory> {
    const res = await fetch(`/api/admin/blog-subcategories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(sub),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update blog subcategory');
    return data;
  },

  async adminDeleteBlogSubcategory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/blog-subcategories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete blog subcategory');
    return data;
  },

  async adminBulkBlogCategoryStatus(ids: string[], isActive: boolean): Promise<{ success: boolean }> {
    const res = await fetch('/api/admin/blog-categories/bulk-status', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids, isActive }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update blog categories bulk status');
    return data;
  },

  async adminBulkBlogCategoryDelete(ids: string[]): Promise<{ success: boolean }> {
    const res = await fetch('/api/admin/blog-categories/bulk-delete', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to bulk delete blog categories');
    return data;
  },

  async adminBulkBlogSubcategoryStatus(ids: string[], isActive: boolean): Promise<{ success: boolean }> {
    const res = await fetch('/api/admin/blog-subcategories/bulk-status', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids, isActive }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update blog subcategories bulk status');
    return data;
  },

  async adminBulkBlogSubcategoryDelete(ids: string[]): Promise<{ success: boolean }> {
    const res = await fetch('/api/admin/blog-subcategories/bulk-delete', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to bulk delete blog subcategories');
    return data;
  },

  // AI Scenario Advisory & Dynamic Layout API
  async getAdvisoryLayout(params: any): Promise<any> {
    const res = await fetch('/api/ai/advisory-layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate advisory layout');
    return data;
  },
};

