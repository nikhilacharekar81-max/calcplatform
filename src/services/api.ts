import { Category, Subcategory, Calculator, StatsResponse, SiteSettings } from '../types/schema.ts';

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

export const api = {
  // Public APIs
  async getCategories(): Promise<Array<Category & { subcategoriesCount: number; calculatorsCount: number; subcategories: Subcategory[] }>> {
    const res = await fetch('/api/public/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getSubcategories(params?: { categorySlug?: string; categoryId?: string }): Promise<Array<Subcategory & { category?: Category; calculatorsCount: number }>> {
    const query = new URLSearchParams();
    if (params?.categorySlug) query.set('categorySlug', params.categorySlug);
    if (params?.categoryId) query.set('categoryId', params.categoryId);
    const res = await fetch(`/api/public/subcategories?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch subcategories');
    return res.json();
  },

  async getCalculators(params?: {
    categorySlug?: string;
    subcategorySlug?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<Array<Calculator & { category?: Category; subcategory?: Subcategory }>> {
    const query = new URLSearchParams();
    if (params?.categorySlug) query.set('categorySlug', params.categorySlug);
    if (params?.subcategorySlug) query.set('subcategorySlug', params.subcategorySlug);
    if (params?.search) query.set('search', params.search);
    if (params?.featured) query.set('featured', 'true');
    if (params?.limit) query.set('limit', params.limit.toString());

    const res = await fetch(`/api/public/calculators?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch calculators');
    return res.json();
  },

  async resolvePath(path: string): Promise<{
    type: 'home' | 'category' | 'subcategory' | 'calculator';
    category?: Category;
    subcategory?: Subcategory;
    subcategories?: Subcategory[];
    calculators?: Calculator[];
    calculator?: Calculator;
    siblingSubcategories?: Subcategory[];
    relatedCalculators?: Calculator[];
  }> {
    const res = await fetch(`/api/public/resolve?path=${encodeURIComponent(path)}`);
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('NOT_FOUND');
      }
      throw new Error('Failed to resolve path');
    }
    return res.json();
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
    return data;
  },

  async adminToggleCategory(id: string): Promise<{ success: boolean; isActive: boolean }> {
    const res = await fetch(`/api/admin/categories/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle category');
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
    return data;
  },

  async adminReorderCategories(orderedIds: string[]): Promise<void> {
    const res = await fetch('/api/admin/categories/reorder', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderedIds }),
    });
    if (!res.ok) throw new Error('Failed to reorder categories');
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
    return data;
  },

  async adminToggleSubcategory(id: string): Promise<{ success: boolean; isActive: boolean }> {
    const res = await fetch(`/api/admin/subcategories/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle subcategory');
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
    return data;
  },

  async adminReorderSubcategories(orderedIds: string[]): Promise<void> {
    const res = await fetch('/api/admin/subcategories/reorder', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderedIds }),
    });
    if (!res.ok) throw new Error('Failed to reorder subcategories');
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
    return data;
  },

  async adminToggleCalculator(id: string): Promise<{ success: boolean; isActive: boolean }> {
    const res = await fetch(`/api/admin/calculators/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle calculator');
    return data;
  },

  async adminDuplicateCalculator(id: string): Promise<Calculator> {
    const res = await fetch(`/api/admin/calculators/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to duplicate calculator');
    return data;
  },

  async adminDeleteCalculator(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/calculators/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete calculator');
    return data;
  },

  async adminReorderCalculators(orderedIds: string[]): Promise<void> {
    const res = await fetch('/api/admin/calculators/reorder', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderedIds }),
    });
    if (!res.ok) throw new Error('Failed to reorder calculators');
  },

  async adminApplyModulesToAll(modules: any[]): Promise<{ success: boolean; count: number }> {
    const res = await fetch('/api/admin/modules/apply-all', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ modules }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to apply modules to all calculators');
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
};
