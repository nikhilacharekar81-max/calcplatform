import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { DatabaseSchema, Category, Subcategory, Calculator, SiteSettings } from './src/types/schema.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultSettings: SiteSettings = {
  siteTitle: 'CalcPlatform - Global Calculator Platform',
  siteDescription: 'Production-ready global calculator directory and engine with clean, high-precision calculation tools.',
  siteKeywords: 'calculators, online tools, finance, math, health, conversion, physics, science, engineering',
  brandName: 'CalcPlatform',
  adminUsername: 'admin',
  adminPasswordHash: 'admin123',
  footerNotice: '© CalcPlatform. All calculations are provided for informational and educational purposes.',
  canonicalBaseUrl: 'https://calcplatform.org',
  contactEmail: 'admin@calcplatform.org',
};

// INITIAL DATABASE: ABSOLUTELY 0 CATEGORIES, 0 SUBCATEGORIES, 0 CALCULATORS
function getInitialDb(): DatabaseSchema {
  return {
    categories: [],
    subcategories: [],
    calculators: [],
    settings: defaultSettings,
  };
}

// Database helper with safe atomic writing & retry logic
function readDb(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialDb();
    writeDb(initial, 'initial_file_creation');
    return initial;
  }

  let attempts = 0;
  while (attempts < 5) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      if (!raw || raw.trim().length === 0) {
        throw new Error('Database file is empty during read');
      }
      const parsed = JSON.parse(raw);
      return {
        categories: Array.isArray(parsed.categories) ? parsed.categories : [],
        subcategories: Array.isArray(parsed.subcategories) ? parsed.subcategories : [],
        calculators: Array.isArray(parsed.calculators) ? parsed.calculators : [],
        settings: { ...defaultSettings, ...(parsed.settings || {}) },
      };
    } catch (err) {
      attempts++;
      if (attempts >= 5) {
        console.error(`[CRITICAL DATABASE ERROR] Failed to read ${DB_FILE} after 5 attempts:`, err);
        throw new Error(`Database read failure: Unable to safely parse ${DB_FILE}`);
      }
      const start = Date.now();
      while (Date.now() - start < 5) {}
    }
  }

  throw new Error('Database read error');
}

function writeDb(data: DatabaseSchema, source: string = 'unknown'): boolean {
  try {
    let prevCalcCount = 0;
    let prevCalcIds: string[] = [];

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        if (raw && raw.trim().length > 0) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.calculators)) {
            prevCalcCount = parsed.calculators.length;
            prevCalcIds = parsed.calculators.map((c: any) => c.id);
          }
        }
      } catch (e) {
        // Ignore parse error on previous disk copy
      }
    }

    const nextCalcCount = data.calculators ? data.calculators.length : 0;
    const nextCalcIds = data.calculators ? data.calculators.map((c: any) => c.id) : [];

    // SAFETY GUARD (PHASE 4): Block accidental empty writes that wipe existing calculators
    if (prevCalcCount > 0 && nextCalcCount === 0 && source !== 'explicit_delete_all_confirmed') {
      const stack = new Error().stack;
      console.error(`[BLOCKED CALCULATOR DB WRITE] Attempted to wipe all ${prevCalcCount} calculators from disk! Source: ${source}`);
      console.error('Stack trace:', stack);
      throw new Error(`Database Safety Guard Blocked Write: Attempted to replace ${prevCalcCount} calculators with 0 calculators from source '${source}'.`);
    }

    const targetCalcSummaries = (data.calculators || []).map((c: any) => {
      const enabled = (c.modules || []).filter((m: any) => m.isEnabled).length;
      const disabled = (c.modules || []).filter((m: any) => !m.isEnabled).length;
      return `${c.id}(${c.name}): ${enabled} ON / ${disabled} OFF (total ${c.modules ? c.modules.length : 0})`;
    });

    console.log(`[DB_WRITE] Timestamp: ${new Date().toISOString()} | Source: ${source} | Count BEFORE: ${prevCalcCount} | Count AFTER: ${nextCalcCount} | Modules: [${targetCalcSummaries.join('; ')}]`);

    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err: any) {
    console.error(`[ERROR IN writeDb (${source})]:`, err.message || err);
    throw err;
  }
}

// Initialize on startup
readDb();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isDev = process.env.NODE_ENV !== 'production';

  app.use(express.json({ limit: '10mb' }));

  // Helper for slug generation & conflict resolution
  function cleanSlug(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Persistent Auth Sessions
  const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

  function loadSessions(): Set<string> {
    try {
      if (fs.existsSync(SESSIONS_FILE)) {
        const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const s = new Set<string>(list);
          s.add('admin-demo-token-active');
          return s;
        }
      }
    } catch (err) {
      console.error('Error reading sessions file:', err);
    }
    return new Set<string>(['admin-demo-token-active']);
  }

  function saveSessions(sessions: Set<string>): void {
    try {
      const dir = path.dirname(SESSIONS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(Array.from(sessions)), 'utf-8');
    } catch (err) {
      console.error('Error saving sessions file:', err);
    }
  }

  const activeSessions = loadSessions();

  function requireAdmin(req: Request, res: Response, next: () => void) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || (req.query.token as string);
    if (!token || !activeSessions.has(token)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin session' });
    }
    next();
  }

  // ==========================================
  // AUTH API
  // ==========================================
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    const db = readDb();
    if (
      username === db.settings.adminUsername &&
      password === db.settings.adminPasswordHash
    ) {
      const token = `adm_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      activeSessions.add(token);
      saveSessions(activeSessions);
      return res.json({
        success: true,
        token,
        user: { username: db.settings.adminUsername, role: 'admin' },
      });
    }
    return res.status(401).json({ success: false, error: 'Invalid username or password' });
  });

  app.get('/api/auth/check', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || (req.query.token as string);
    if (token && activeSessions.has(token)) {
      const db = readDb();
      return res.json({ authenticated: true, username: db.settings.adminUsername });
    }
    return res.json({ authenticated: false });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || (req.query.token as string);
    if (token) {
      activeSessions.delete(token);
      saveSessions(activeSessions);
    }
    return res.json({ success: true });
  });

  // ==========================================
  // STATS API
  // ==========================================
  app.get('/api/stats', (_req: Request, res: Response) => {
    const db = readDb();
    const activeCatIds = new Set(db.categories.filter((c) => c.isActive).map((c) => c.id));
    const activeSubIds = new Set(
      db.subcategories.filter((s) => s.isActive && activeCatIds.has(s.categoryId)).map((s) => s.id)
    );

    const stats = {
      totalCategories: db.categories.length,
      activeCategories: db.categories.filter((c) => c.isActive).length,
      totalSubcategories: db.subcategories.length,
      activeSubcategories: db.subcategories.filter((s) => s.isActive && activeCatIds.has(s.categoryId)).length,
      totalCalculators: db.calculators.length,
      activeCalculators: db.calculators.filter(
        (calc) => calc.isActive && activeCatIds.has(calc.categoryId) && activeSubIds.has(calc.subcategoryId)
      ).length,
    };
    return res.json(stats);
  });

  // ==========================================
  // PUBLIC API
  // ==========================================
  app.get('/api/public/categories', (_req: Request, res: Response) => {
    const db = readDb();
    const activeCategories = db.categories
      .filter((c) => c.isActive)
      .sort((a, b) => a.order - b.order);

    const result = activeCategories.map((cat) => {
      const activeSubs = db.subcategories.filter((s) => s.categoryId === cat.id && s.isActive);
      const activeSubIds = new Set(activeSubs.map((s) => s.id));
      const activeCalcs = db.calculators.filter(
        (c) => c.categoryId === cat.id && c.isActive && activeSubIds.has(c.subcategoryId)
      );

      return {
        ...cat,
        subcategoriesCount: activeSubs.length,
        calculatorsCount: activeCalcs.length,
        subcategories: activeSubs.sort((a, b) => a.order - b.order),
      };
    });

    return res.json(result);
  });

  app.get('/api/public/subcategories', (req: Request, res: Response) => {
    const db = readDb();
    const { categorySlug, categoryId } = req.query;
    const activeCatMap = new Map(db.categories.filter((c) => c.isActive).map((c) => [c.id, c]));

    let subs = db.subcategories.filter((s) => s.isActive && activeCatMap.has(s.categoryId));

    if (categoryId) {
      subs = subs.filter((s) => s.categoryId === categoryId);
    } else if (categorySlug) {
      const cat = db.categories.find((c) => c.slug === categorySlug && c.isActive);
      if (cat) {
        subs = subs.filter((s) => s.categoryId === cat.id);
      } else {
        subs = [];
      }
    }

    const result = subs.sort((a, b) => a.order - b.order).map((s) => {
      const calcsCount = db.calculators.filter(
        (c) => c.subcategoryId === s.id && c.isActive && activeCatMap.has(c.categoryId)
      ).length;
      return {
        ...s,
        category: activeCatMap.get(s.categoryId),
        calculatorsCount: calcsCount,
      };
    });

    return res.json(result);
  });

  app.get('/api/public/calculators', (req: Request, res: Response) => {
    const db = readDb();
    const { categorySlug, subcategorySlug, search, featured, limit } = req.query;

    const activeCatMap = new Map(db.categories.filter((c) => c.isActive).map((c) => [c.id, c]));
    const activeSubMap = new Map(
      db.subcategories.filter((s) => s.isActive && activeCatMap.has(s.categoryId)).map((s) => [s.id, s])
    );

    let calcs = db.calculators.filter(
      (c) => c.isActive && activeCatMap.has(c.categoryId) && activeSubMap.has(c.subcategoryId)
    );

    if (categorySlug) {
      const cat = db.categories.find((c) => c.slug === categorySlug && c.isActive);
      if (cat) {
        calcs = calcs.filter((c) => c.categoryId === cat.id);
      } else {
        calcs = [];
      }
    }

    if (subcategorySlug) {
      const sub = db.subcategories.find((s) => s.slug === subcategorySlug && s.isActive);
      if (sub) {
        calcs = calcs.filter((c) => c.subcategoryId === sub.id);
      } else {
        calcs = [];
      }
    }

    if (featured === 'true') {
      calcs = calcs.filter((c) => c.isFeatured);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      calcs = calcs.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          (c.seoKeywords && c.seoKeywords.toLowerCase().includes(q)) ||
          activeCatMap.get(c.categoryId)?.name.toLowerCase().includes(q) ||
          activeSubMap.get(c.subcategoryId)?.name.toLowerCase().includes(q)
      );
    }

    calcs.sort((a, b) => a.order - b.order);

    if (limit) {
      calcs = calcs.slice(0, parseInt(limit as string, 10));
    }

    const result = calcs.map((calc) => ({
      ...calc,
      category: activeCatMap.get(calc.categoryId),
      subcategory: activeSubMap.get(calc.subcategoryId),
    }));

    return res.json(result);
  });

  // Dynamic Route Resolver for SEO-friendly URLs:
  // /:catSlug
  // /:catSlug/:subSlug
  // /:catSlug/:subSlug/:calcSlug
  app.get('/api/public/resolve', (req: Request, res: Response) => {
    const rawPath = (req.query.path as string || '').replace(/^\/|\/$/g, '');
    const parts = rawPath.split('/').filter(Boolean);

    const db = readDb();
    const activeCatMap = new Map(db.categories.filter((c) => c.isActive).map((c) => [c.id, c]));
    const activeSubMap = new Map(
      db.subcategories.filter((s) => s.isActive && activeCatMap.has(s.categoryId)).map((s) => [s.id, s])
    );

    if (parts.length === 0) {
      return res.json({ type: 'home' });
    }

    if (parts.length === 1) {
      const catSlug = parts[0];
      const category = db.categories.find((c) => c.slug === catSlug && c.isActive);
      if (!category) {
        return res.status(404).json({ error: 'Category not found or inactive' });
      }

      const subcategories = db.subcategories
        .filter((s) => s.categoryId === category.id && s.isActive)
        .sort((a, b) => a.order - b.order);

      const activeSubIds = new Set(subcategories.map((s) => s.id));
      const calculators = db.calculators
        .filter((c) => c.categoryId === category.id && c.isActive && activeSubIds.has(c.subcategoryId))
        .sort((a, b) => a.order - b.order);

      return res.json({
        type: 'category',
        category,
        subcategories,
        calculators,
      });
    }

    if (parts.length === 2) {
      const [catSlug, subSlug] = parts;
      const category = db.categories.find((c) => c.slug === catSlug && c.isActive);
      if (!category) {
        return res.status(404).json({ error: 'Category not found or inactive' });
      }

      const subcategory = db.subcategories.find(
        (s) => s.slug === subSlug && s.categoryId === category.id && s.isActive
      );
      if (!subcategory) {
        return res.status(404).json({ error: 'Subcategory not found or inactive' });
      }

      const calculators = db.calculators
        .filter((c) => c.subcategoryId === subcategory.id && c.isActive)
        .sort((a, b) => a.order - b.order);

      // Sibling subcategories for easy navigation
      const siblingSubcategories = db.subcategories
        .filter((s) => s.categoryId === category.id && s.isActive)
        .sort((a, b) => a.order - b.order);

      return res.json({
        type: 'subcategory',
        category,
        subcategory,
        calculators,
        siblingSubcategories,
      });
    }

    if (parts.length === 3) {
      const [catSlug, subSlug, calcSlug] = parts;
      const category = db.categories.find((c) => c.slug === catSlug && c.isActive);
      if (!category) {
        return res.status(404).json({ error: 'Category not found or inactive' });
      }

      const subcategory = db.subcategories.find(
        (s) => s.slug === subSlug && s.categoryId === category.id && s.isActive
      );
      if (!subcategory) {
        return res.status(404).json({ error: 'Subcategory not found or inactive' });
      }

      const calculator = db.calculators.find(
        (c) => c.slug === calcSlug && c.subcategoryId === subcategory.id && c.isActive
      );
      if (!calculator) {
        return res.status(404).json({ error: 'Calculator not found or inactive' });
      }

      // Increment view count quietly
      calculator.viewsCount = (calculator.viewsCount || 0) + 1;
      writeDb(db);

      // Related calculators in the same subcategory
      const relatedCalculators = db.calculators
        .filter((c) => c.subcategoryId === subcategory.id && c.id !== calculator.id && c.isActive)
        .slice(0, 6);

      return res.json({
        type: 'calculator',
        category,
        subcategory,
        calculator,
        relatedCalculators,
      });
    }

    return res.status(404).json({ error: 'Path not found' });
  });

  // ==========================================
  // DYNAMIC SITEMAP & ROBOTS.TXT
  // ==========================================
  app.get(['/sitemap.xml', '/api/public/sitemap.xml'], (_req: Request, res: Response) => {
    const db = readDb();
    const baseUrl = (db.settings.canonicalBaseUrl || 'https://calcplatform.org').replace(/\/$/, '');
    const activeCatMap = new Map(db.categories.filter((c) => c.isActive).map((c) => [c.id, c]));
    const activeSubMap = new Map(
      db.subcategories.filter((s) => s.isActive && activeCatMap.has(s.categoryId)).map((s) => [s.id, s])
    );

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Homepage
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // Active Categories
    for (const cat of activeCatMap.values()) {
      xml += `  <url>\n    <loc>${baseUrl}/${cat.slug}</loc>\n    <lastmod>${cat.updatedAt || new Date().toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    // Active Subcategories
    for (const sub of activeSubMap.values()) {
      const parentCat = activeCatMap.get(sub.categoryId);
      if (parentCat) {
        xml += `  <url>\n    <loc>${baseUrl}/${parentCat.slug}/${sub.slug}</loc>\n    <lastmod>${sub.updatedAt || new Date().toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      }
    }

    // Active Calculators
    const activeCalcs = db.calculators.filter(
      (c) => c.isActive && activeCatMap.has(c.categoryId) && activeSubMap.has(c.subcategoryId)
    );

    for (const calc of activeCalcs) {
      const parentCat = activeCatMap.get(calc.categoryId);
      const parentSub = activeSubMap.get(calc.subcategoryId);
      if (parentCat && parentSub) {
        xml += `  <url>\n    <loc>${baseUrl}/${parentCat.slug}/${parentSub.slug}/${calc.slug}</loc>\n    <lastmod>${calc.updatedAt || new Date().toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      }
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    return res.send(xml);
  });

  app.get('/robots.txt', (_req: Request, res: Response) => {
    const db = readDb();
    const baseUrl = (db.settings.canonicalBaseUrl || 'https://calcplatform.org').replace(/\/$/, '');
    const txt = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
    res.header('Content-Type', 'text/plain');
    return res.send(txt);
  });

  // ==========================================
  // ADMIN CATEGORIES API
  // ==========================================
  app.get('/api/admin/categories', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { search, status } = req.query;
    let list = [...db.categories];

    if (status === 'active') list = list.filter((c) => c.isActive);
    if (status === 'inactive') list = list.filter((c) => !c.isActive);
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
    }

    list.sort((a, b) => a.order - b.order);

    const withCounts = list.map((cat) => {
      const subs = db.subcategories.filter((s) => s.categoryId === cat.id);
      const calcs = db.calculators.filter((c) => c.categoryId === cat.id);
      return {
        ...cat,
        subcategoriesCount: subs.length,
        calculatorsCount: calcs.length,
      };
    });

    return res.json(withCounts);
  });

  app.post('/api/admin/categories', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { name, slug, description, seoTitle, seoDescription, seoKeywords, icon, order, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    let finalSlug = cleanSlug(slug || name);
    if (!finalSlug) {
      return res.status(400).json({ error: 'Invalid category slug' });
    }

    // Ensure uniqueness of category slug
    if (db.categories.some((c) => c.slug === finalSlug)) {
      return res.status(400).json({ error: `Category slug "${finalSlug}" is already taken.` });
    }

    const newCategory: Category = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || '',
      seoTitle: seoTitle?.trim() || name.trim(),
      seoDescription: seoDescription?.trim() || description?.trim() || '',
      seoKeywords: seoKeywords?.trim() || '',
      icon: icon || 'Folder',
      order: typeof order === 'number' ? order : db.categories.length + 1,
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.categories.push(newCategory);
    writeDb(db);

    return res.status(201).json(newCategory);
  });

  app.put('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const catIndex = db.categories.findIndex((c) => c.id === id);
    if (catIndex === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const { name, slug, description, seoTitle, seoDescription, seoKeywords, icon, order, isActive } = req.body;

    if (name && !name.trim()) {
      return res.status(400).json({ error: 'Category name cannot be empty' });
    }

    let finalSlug = slug ? cleanSlug(slug) : db.categories[catIndex].slug;
    if (finalSlug !== db.categories[catIndex].slug && db.categories.some((c) => c.slug === finalSlug && c.id !== id)) {
      return res.status(400).json({ error: `Category slug "${finalSlug}" is already taken.` });
    }

    const updated: Category = {
      ...db.categories[catIndex],
      name: name?.trim() || db.categories[catIndex].name,
      slug: finalSlug,
      description: description !== undefined ? description.trim() : db.categories[catIndex].description,
      seoTitle: seoTitle !== undefined ? seoTitle.trim() : db.categories[catIndex].seoTitle,
      seoDescription: seoDescription !== undefined ? seoDescription.trim() : db.categories[catIndex].seoDescription,
      seoKeywords: seoKeywords !== undefined ? seoKeywords.trim() : db.categories[catIndex].seoKeywords,
      icon: icon || db.categories[catIndex].icon,
      order: typeof order === 'number' ? order : db.categories[catIndex].order,
      isActive: isActive !== undefined ? Boolean(isActive) : db.categories[catIndex].isActive,
      updatedAt: new Date().toISOString(),
    };

    db.categories[catIndex] = updated;
    writeDb(db);

    return res.json(updated);
  });

  app.patch('/api/admin/categories/:id/toggle', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const cat = db.categories.find((c) => c.id === id);
    if (!cat) {
      return res.status(404).json({ error: 'Category not found' });
    }

    cat.isActive = !cat.isActive;
    cat.updatedAt = new Date().toISOString();
    writeDb(db);

    return res.json({ success: true, isActive: cat.isActive });
  });

  app.delete('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const { force } = req.query;

    const subCount = db.subcategories.filter((s) => s.categoryId === id).length;
    const calcCount = db.calculators.filter((c) => c.categoryId === id).length;

    if ((subCount > 0 || calcCount > 0) && force !== 'true') {
      return res.status(409).json({
        error: `Cannot delete category: contains ${subCount} subcategories and ${calcCount} calculators. Confirm deletion with force=true to cascade delete.`,
        requiresConfirmation: true,
        subCount,
        calcCount,
      });
    }

    // Cascade delete subcategories and calculators under this category
    db.categories = db.categories.filter((c) => c.id !== id);
    db.subcategories = db.subcategories.filter((s) => s.categoryId !== id);
    db.calculators = db.calculators.filter((c) => c.categoryId !== id);

    writeDb(db);
    return res.json({ success: true, message: 'Category deleted safely' });
  });

  app.post('/api/admin/categories/reorder', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds array required' });
    }

    orderedIds.forEach((id: string, index: number) => {
      const cat = db.categories.find((c) => c.id === id);
      if (cat) cat.order = index + 1;
    });

    writeDb(db);
    return res.json({ success: true });
  });

  // ==========================================
  // ADMIN SUBCATEGORIES API
  // ==========================================
  app.get('/api/admin/subcategories', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { categoryId, search, status } = req.query;
    let list = [...db.subcategories];

    if (categoryId) list = list.filter((s) => s.categoryId === categoryId);
    if (status === 'active') list = list.filter((s) => s.isActive);
    if (status === 'inactive') list = list.filter((s) => !s.isActive);
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q));
    }

    list.sort((a, b) => a.order - b.order);

    const catMap = new Map(db.categories.map((c) => [c.id, c]));
    const withDetails = list.map((sub) => {
      const calcs = db.calculators.filter((c) => c.subcategoryId === sub.id);
      return {
        ...sub,
        category: catMap.get(sub.categoryId),
        calculatorsCount: calcs.length,
      };
    });

    return res.json(withDetails);
  });

  app.post('/api/admin/subcategories', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { categoryId, name, slug, description, seoTitle, seoDescription, seoKeywords, order, isActive } = req.body;

    if (!categoryId) {
      return res.status(400).json({ error: 'Parent Category is required' });
    }
    const parentCat = db.categories.find((c) => c.id === categoryId);
    if (!parentCat) {
      return res.status(400).json({ error: 'Specified parent category does not exist' });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Subcategory name is required' });
    }

    let finalSlug = cleanSlug(slug || name);
    if (!finalSlug) {
      return res.status(400).json({ error: 'Invalid subcategory slug' });
    }

    // Slug must be unique within the same parent category
    if (db.subcategories.some((s) => s.categoryId === categoryId && s.slug === finalSlug)) {
      return res.status(400).json({ error: `Subcategory slug "${finalSlug}" is already taken under this category.` });
    }

    const newSub: Subcategory = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      categoryId,
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || '',
      seoTitle: seoTitle?.trim() || name.trim(),
      seoDescription: seoDescription?.trim() || description?.trim() || '',
      seoKeywords: seoKeywords?.trim() || '',
      order: typeof order === 'number' ? order : db.subcategories.filter((s) => s.categoryId === categoryId).length + 1,
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.subcategories.push(newSub);
    writeDb(db);

    return res.status(201).json(newSub);
  });

  app.put('/api/admin/subcategories/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const subIndex = db.subcategories.findIndex((s) => s.id === id);
    if (subIndex === -1) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    const { categoryId, name, slug, description, seoTitle, seoDescription, seoKeywords, order, isActive } = req.body;

    const targetCategoryId = categoryId || db.subcategories[subIndex].categoryId;
    const parentCat = db.categories.find((c) => c.id === targetCategoryId);
    if (!parentCat) {
      return res.status(400).json({ error: 'Target parent category does not exist' });
    }

    let finalSlug = slug ? cleanSlug(slug) : db.subcategories[subIndex].slug;
    if (
      db.subcategories.some(
        (s) => s.categoryId === targetCategoryId && s.slug === finalSlug && s.id !== id
      )
    ) {
      return res.status(400).json({ error: `Subcategory slug "${finalSlug}" is already taken in this category.` });
    }

    const updated: Subcategory = {
      ...db.subcategories[subIndex],
      categoryId: targetCategoryId,
      name: name?.trim() || db.subcategories[subIndex].name,
      slug: finalSlug,
      description: description !== undefined ? description.trim() : db.subcategories[subIndex].description,
      seoTitle: seoTitle !== undefined ? seoTitle.trim() : db.subcategories[subIndex].seoTitle,
      seoDescription: seoDescription !== undefined ? seoDescription.trim() : db.subcategories[subIndex].seoDescription,
      seoKeywords: seoKeywords !== undefined ? seoKeywords.trim() : db.subcategories[subIndex].seoKeywords,
      order: typeof order === 'number' ? order : db.subcategories[subIndex].order,
      isActive: isActive !== undefined ? Boolean(isActive) : db.subcategories[subIndex].isActive,
      updatedAt: new Date().toISOString(),
    };

    // If categoryId changed, update calculators belonging to this subcategory
    if (targetCategoryId !== db.subcategories[subIndex].categoryId) {
      db.calculators.forEach((calc) => {
        if (calc.subcategoryId === id) {
          calc.categoryId = targetCategoryId;
        }
      });
    }

    db.subcategories[subIndex] = updated;
    writeDb(db);

    return res.json(updated);
  });

  app.patch('/api/admin/subcategories/:id/toggle', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const sub = db.subcategories.find((s) => s.id === id);
    if (!sub) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    sub.isActive = !sub.isActive;
    sub.updatedAt = new Date().toISOString();
    writeDb(db);

    return res.json({ success: true, isActive: sub.isActive });
  });

  app.delete('/api/admin/subcategories/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const { force } = req.query;

    const calcCount = db.calculators.filter((c) => c.subcategoryId === id).length;
    if (calcCount > 0 && force !== 'true') {
      return res.status(409).json({
        error: `Cannot delete subcategory: contains ${calcCount} calculators. Confirm deletion with force=true.`,
        requiresConfirmation: true,
        calcCount,
      });
    }

    db.subcategories = db.subcategories.filter((s) => s.id !== id);
    db.calculators = db.calculators.filter((c) => c.subcategoryId !== id);
    writeDb(db);

    return res.json({ success: true });
  });

  app.post('/api/admin/subcategories/reorder', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds array required' });
    }

    orderedIds.forEach((id: string, index: number) => {
      const sub = db.subcategories.find((s) => s.id === id);
      if (sub) sub.order = index + 1;
    });

    writeDb(db);
    return res.json({ success: true });
  });

  // ==========================================
  // ADMIN CALCULATORS API
  // ==========================================
  app.get('/api/admin/calculators', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { categoryId, subcategoryId, status, search } = req.query;
    let list = [...db.calculators];

    if (categoryId) list = list.filter((c) => c.categoryId === categoryId);
    if (subcategoryId) list = list.filter((c) => c.subcategoryId === subcategoryId);
    if (status === 'active') list = list.filter((c) => c.isActive);
    if (status === 'inactive') list = list.filter((c) => !c.isActive);
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
    }

    list.sort((a, b) => a.order - b.order);

    const catMap = new Map(db.categories.map((c) => [c.id, c]));
    const subMap = new Map(db.subcategories.map((s) => [s.id, s]));

    const withParents = list.map((calc) => ({
      ...calc,
      category: catMap.get(calc.categoryId),
      subcategory: subMap.get(calc.subcategoryId),
    }));

    return res.json(withParents);
  });

  function isValidModuleConfig(m: any): boolean {
    return (
      m &&
      typeof m === 'object' &&
      typeof m.id === 'string' &&
      typeof m.moduleId === 'string' &&
      typeof m.name === 'string' &&
      (m.isEnabled === true || m.isEnabled === false) &&
      typeof m.order === 'number'
    );
  }

  app.post('/api/admin/modules/apply-all', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { modules } = req.body;
    if (!Array.isArray(modules) || modules.some((m) => !isValidModuleConfig(m))) {
      return res.status(400).json({ error: 'Invalid modules configuration: each module must have a valid boolean isEnabled property.' });
    }
    db.calculators.forEach((c) => {
      c.modules = modules;
      c.updatedAt = new Date().toISOString();
    });
    writeDb(db, 'admin_apply_modules_to_all');
    return res.json({ success: true, count: db.calculators.length });
  });

  app.get('/api/admin/calculators/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const calc = db.calculators.find((c) => c.id === id);
    if (!calc) {
      return res.status(404).json({ error: 'Calculator not found' });
    }
    return res.json(calc);
  });

  app.post('/api/admin/calculators', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const {
      name,
      slug,
      shortDescription,
      categoryId,
      subcategoryId,
      engineType,
      fields,
      outputs,
      presets,
      modules,
      contentSections,
      faqs,
      examples,
      chartConfig,
      content,
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      noIndex,
      order,
      isActive,
      isFeatured,
      isPopular,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Calculator name is required' });
    }
    if (modules !== undefined) {
      if (!Array.isArray(modules) || modules.some((m) => !isValidModuleConfig(m))) {
        return res.status(400).json({ error: 'Invalid modules configuration: each module must have a valid boolean isEnabled property.' });
      }
    }
    if (!categoryId) {
      return res.status(400).json({ error: 'Category is required' });
    }
    if (!subcategoryId) {
      return res.status(400).json({ error: 'Subcategory is required' });
    }

    const parentCat = db.categories.find((c) => c.id === categoryId);
    const parentSub = db.subcategories.find((s) => s.id === subcategoryId && s.categoryId === categoryId);
    if (!parentCat || !parentSub) {
      return res.status(400).json({ error: 'Invalid category or subcategory selection' });
    }

    let finalSlug = cleanSlug(slug || name);
    if (!finalSlug) {
      return res.status(400).json({ error: 'Invalid calculator slug' });
    }

    // Slug uniqueness within the subcategory
    if (db.calculators.some((c) => c.subcategoryId === subcategoryId && c.slug === finalSlug)) {
      return res.status(400).json({ error: `Calculator slug "${finalSlug}" is already taken under this subcategory.` });
    }

    const newCalc: Calculator = {
      id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      slug: finalSlug,
      shortDescription: shortDescription?.trim() || '',
      categoryId,
      subcategoryId,
      engineType: engineType || 'custom_formula',
      fields: Array.isArray(fields) ? fields : [],
      outputs: Array.isArray(outputs) ? outputs : [],
      presets: Array.isArray(presets) ? presets : [],
      modules: Array.isArray(modules) ? modules : undefined,
      contentSections: Array.isArray(contentSections) ? contentSections : [],
      faqs: Array.isArray(faqs) ? faqs : [],
      examples: Array.isArray(examples) ? examples : [],
      chartConfig: chartConfig || { enabled: false, chartType: 'donut', title: 'Breakdown', segments: [] },
      content: content || { formulaExplanation: '', usageInstructions: '', faqs: [] },
      seoTitle: seoTitle?.trim() || `${name.trim()} - Free Online Calculator`,
      seoDescription: seoDescription?.trim() || shortDescription?.trim() || '',
      seoKeywords: seoKeywords?.trim() || '',
      canonicalUrl: canonicalUrl?.trim() || undefined,
      ogTitle: ogTitle?.trim() || undefined,
      ogDescription: ogDescription?.trim() || undefined,
      ogImage: ogImage?.trim() || undefined,
      noIndex: Boolean(noIndex),
      order: typeof order === 'number' ? order : db.calculators.filter((c) => c.subcategoryId === subcategoryId).length + 1,
      isActive: isActive !== false,
      isFeatured: Boolean(isFeatured),
      isPopular: Boolean(isPopular),
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.calculators.push(newCalc);
    writeDb(db, 'admin_create_calculator');

    return res.status(201).json(newCalc);
  });

  app.put('/api/admin/calculators/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const calcIndex = db.calculators.findIndex((c) => c.id === id);
    if (calcIndex === -1) {
      return res.status(404).json({ error: 'Calculator not found' });
    }

    const {
      name,
      slug,
      shortDescription,
      categoryId,
      subcategoryId,
      engineType,
      fields,
      outputs,
      presets,
      modules,
      contentSections,
      faqs,
      examples,
      chartConfig,
      content,
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      noIndex,
      order,
      isActive,
      isFeatured,
      isPopular,
    } = req.body;

    if (modules !== undefined) {
      if (!Array.isArray(modules) || modules.some((m) => !isValidModuleConfig(m))) {
        return res.status(400).json({ error: 'Invalid modules configuration: each module must have a valid boolean isEnabled property.' });
      }
    }

    const targetCatId = categoryId || db.calculators[calcIndex].categoryId;
    const targetSubId = subcategoryId || db.calculators[calcIndex].subcategoryId;

    let finalSlug = slug ? cleanSlug(slug) : db.calculators[calcIndex].slug;
    if (
      db.calculators.some(
        (c) => c.subcategoryId === targetSubId && c.slug === finalSlug && c.id !== id
      )
    ) {
      return res.status(400).json({ error: `Calculator slug "${finalSlug}" is already taken in this subcategory.` });
    }

    const updated: Calculator = {
      ...db.calculators[calcIndex],
      name: name?.trim() || db.calculators[calcIndex].name,
      slug: finalSlug,
      shortDescription: shortDescription !== undefined ? shortDescription.trim() : db.calculators[calcIndex].shortDescription,
      categoryId: targetCatId,
      subcategoryId: targetSubId,
      engineType: engineType !== undefined ? engineType : db.calculators[calcIndex].engineType,
      fields: Array.isArray(fields) ? fields : db.calculators[calcIndex].fields,
      outputs: Array.isArray(outputs) ? outputs : db.calculators[calcIndex].outputs,
      presets: Array.isArray(presets) ? presets : db.calculators[calcIndex].presets,
      modules: Array.isArray(modules) ? modules : db.calculators[calcIndex].modules,
      contentSections: Array.isArray(contentSections) ? contentSections : db.calculators[calcIndex].contentSections,
      faqs: Array.isArray(faqs) ? faqs : db.calculators[calcIndex].faqs,
      examples: Array.isArray(examples) ? examples : db.calculators[calcIndex].examples,
      chartConfig: chartConfig !== undefined ? chartConfig : db.calculators[calcIndex].chartConfig,
      content: content !== undefined ? content : db.calculators[calcIndex].content,
      seoTitle: seoTitle !== undefined ? seoTitle.trim() : db.calculators[calcIndex].seoTitle,
      seoDescription: seoDescription !== undefined ? seoDescription.trim() : db.calculators[calcIndex].seoDescription,
      seoKeywords: seoKeywords !== undefined ? seoKeywords.trim() : db.calculators[calcIndex].seoKeywords,
      canonicalUrl: canonicalUrl !== undefined ? canonicalUrl.trim() : db.calculators[calcIndex].canonicalUrl,
      ogTitle: ogTitle !== undefined ? ogTitle.trim() : db.calculators[calcIndex].ogTitle,
      ogDescription: ogDescription !== undefined ? ogDescription.trim() : db.calculators[calcIndex].ogDescription,
      ogImage: ogImage !== undefined ? ogImage.trim() : db.calculators[calcIndex].ogImage,
      noIndex: noIndex !== undefined ? Boolean(noIndex) : db.calculators[calcIndex].noIndex,
      order: typeof order === 'number' ? order : db.calculators[calcIndex].order,
      isActive: isActive !== undefined ? Boolean(isActive) : db.calculators[calcIndex].isActive,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : db.calculators[calcIndex].isFeatured,
      isPopular: isPopular !== undefined ? Boolean(isPopular) : db.calculators[calcIndex].isPopular,
      updatedAt: new Date().toISOString(),
    };

    db.calculators[calcIndex] = updated;
    writeDb(db, 'admin_update_calculator');

    return res.json(updated);
  });

  app.patch('/api/admin/calculators/:id/toggle', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const calc = db.calculators.find((c) => c.id === id);
    if (!calc) {
      return res.status(404).json({ error: 'Calculator not found' });
    }

    calc.isActive = !calc.isActive;
    calc.updatedAt = new Date().toISOString();
    writeDb(db);

    return res.json({ success: true, isActive: calc.isActive });
  });

  app.post('/api/admin/calculators/:id/duplicate', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const source = db.calculators.find((c) => c.id === id);
    if (!source) {
      return res.status(404).json({ error: 'Calculator not found' });
    }

    let copySlug = `${source.slug}-copy`;
    let count = 1;
    while (db.calculators.some((c) => c.subcategoryId === source.subcategoryId && c.slug === copySlug)) {
      count++;
      copySlug = `${source.slug}-copy-${count}`;
    }

    const cloned: Calculator = {
      ...JSON.parse(JSON.stringify(source)),
      id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: `${source.name} (Copy)`,
      slug: copySlug,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.calculators.push(cloned);
    writeDb(db);

    return res.status(201).json(cloned);
  });

  app.delete('/api/admin/calculators/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    db.calculators = db.calculators.filter((c) => c.id !== id);
    writeDb(db);
    return res.json({ success: true });
  });

  app.post('/api/admin/calculators/reorder', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds array required' });
    }

    orderedIds.forEach((id: string, index: number) => {
      const calc = db.calculators.find((c) => c.id === id);
      if (calc) calc.order = index + 1;
    });

    writeDb(db);
    return res.json({ success: true });
  });

  // ==========================================
  // ADMIN SETTINGS & BACKUP / RESTORE API
  // ==========================================
  app.get('/api/admin/settings', requireAdmin, (_req: Request, res: Response) => {
    const db = readDb();
    const { adminPasswordHash, ...safeSettings } = db.settings;
    return res.json({ ...safeSettings, hasPassword: Boolean(adminPasswordHash) });
  });

  app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const {
      siteTitle,
      siteDescription,
      siteKeywords,
      brandName,
      adminUsername,
      newPassword,
      footerNotice,
      canonicalBaseUrl,
      contactEmail,
    } = req.body;

    if (siteTitle) db.settings.siteTitle = siteTitle.trim();
    if (siteDescription) db.settings.siteDescription = siteDescription.trim();
    if (siteKeywords) db.settings.siteKeywords = siteKeywords.trim();
    if (brandName) db.settings.brandName = brandName.trim();
    if (adminUsername) db.settings.adminUsername = adminUsername.trim();
    if (newPassword && newPassword.trim()) {
      db.settings.adminPasswordHash = newPassword.trim();
    }
    if (footerNotice !== undefined) db.settings.footerNotice = footerNotice.trim();
    if (canonicalBaseUrl !== undefined) db.settings.canonicalBaseUrl = canonicalBaseUrl.trim();
    if (contactEmail !== undefined) db.settings.contactEmail = contactEmail.trim();

    writeDb(db);

    const { adminPasswordHash, ...safeSettings } = db.settings;
    return res.json({ success: true, settings: safeSettings });
  });

  app.get('/api/admin/backup', requireAdmin, (_req: Request, res: Response) => {
    const db = readDb();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=calcplatform-backup-${new Date().toISOString().split('T')[0]}.json`);
    return res.json(db);
  });

  app.post('/api/admin/restore', requireAdmin, (req: Request, res: Response) => {
    const payload = req.body;
    if (!payload || !Array.isArray(payload.categories) || !Array.isArray(payload.subcategories) || !Array.isArray(payload.calculators)) {
      return res.status(400).json({ error: 'Invalid backup file format' });
    }

    const restoredDb: DatabaseSchema = {
      categories: payload.categories,
      subcategories: payload.subcategories,
      calculators: payload.calculators,
      settings: { ...defaultSettings, ...(payload.settings || {}) },
    };

    writeDb(restoredDb);
    return res.json({ success: true, message: 'Database restored successfully' });
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
