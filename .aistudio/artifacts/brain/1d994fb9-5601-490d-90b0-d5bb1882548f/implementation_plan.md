# Implementation Plan: WordPress-Like Blog CMS & Article Publishing Engine

Build and integrate a full-featured, WordPress-style **Blog Content Management System (CMS)** allowing administrators to create, edit, schedule, and publish rich editorial blog posts, and giving public visitors a modern `/blog` hub and `/blog/:slug` reading experience with interactive calculator embeds.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The Blog CMS will be fully integrated into both the **Admin Workspace** (`/admin/blogs` and `/admin/blog-editor`) and the **Public Reader Frontend** (`/blog` and `/blog/:slug`), with seed articles covering FY 2026-27 tax strategies.

- **Admin Editor**: Gutenberg/Classic style hybrid with rich formatting (Headings, Tables, Blockquotes, Callout boxes, Image embeds, Interactive Calculator widgets), live slug generator, Category/Tag manager, SEO Meta previews, and Draft/Publish status.
- **Reader Experience**: Clean typography (`prose-emerald`), dynamic Sticky Table of Contents, Reading Progress bar, Social Share buttons, Author Bios, Related Posts, and Schema.org `BlogPosting` JSON-LD for search engine ranking.
- **Embedded Tools**: Authors can embed live calculators (e.g., Salary Tax, Old vs New, or TDS) directly into the body of blog posts.

---

### 1. Architectural Blueprint & Data Schema

#### A. Database Schema (`data/db.json` & `src/types/schema.ts`)
```typescript
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Rich HTML with embedded components
  featuredImage: string;
  category: string; // e.g. "Tax Planning", "TDS Compliance", "Budget 2026"
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
    bio?: string;
  };
  status: 'published' | 'draft' | 'archived';
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  views: number;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  embeddedCalculators?: string[]; // e.g. ['salary-tax', 'tds']
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
}
```

#### B. Server API Endpoints (`server.ts`)
- `GET /api/public/blogs` - Query published posts with pagination, search, category, and tag filters.
- `GET /api/public/blogs/:slug` - Single post resolver with view count auto-increment and related articles.
- `GET /api/public/blog-categories` - Category list with post counts.
- `POST /api/admin/blogs` - Create blog post (auth protected).
- `PUT /api/admin/blogs/:id` - Update post details, content, status (auth protected).
- `DELETE /api/admin/blogs/:id` - Delete post (auth protected).

---

### 2. Admin CMS Features (`src/pages/admin/AdminBlogManager.tsx` & `AdminBlogEditor.tsx`)

1. **Dashboard / Post List Table**:
   - Status filters: *All (12)*, *Published (10)*, *Drafts (2)*.
   - Real-time search by title or tag.
   - Column sort: Featured Image thumbnail, Title, Category badge, Author, Views, Publish Date, Status badge.
   - Actions: *Edit*, *Quick Edit (title, slug, status)*, *Duplicate*, *Delete*, *Live Preview*.
2. **Rich WordPress-Style Post Editor**:
   - **Main Canvas**:
     - Large title input with auto-generated permalink (`/blog/your-custom-slug`) and edit button.
     - Excerpt summary field.
     - Rich Formatting Toolbar: H2, H3, Bold, Italic, Underline, Strikethrough, Bullet Lists, Numbered Lists, Blockquotes, Code, Tables, Green/Amber Warning Callouts, Image insertion, and **"Embed Calculator"** dropdown.
     - Visual WYSIWYG mode + Raw HTML / Markdown toggle.
   - **Right Inspector Sidebar**:
     - *Publish Card*: Status (Draft vs Published), Published Date, "Save Draft" & "Publish / Update" buttons.
     - *Category Selector*: Checkboxes + "Add New Category" modal.
     - *Tag Manager*: Multi-badge tag selector.
     - *Featured Image*: Image URL input, preset gallery, and instant preview.
     - *Author Selector*: Choose author profile (Tax Expert, Chartered Accountant, Financial Analyst).
     - *SEO & Social Meta Box*: Google SERP snippet live preview, Custom SEO Title, Meta Description, Keywords.
     - *Embedded Calculator Picker*: Toggle which calculators appear at the bottom or inline.

---

### 3. Public Reader Experience (`src/pages/BlogIndexPage.tsx` & `BlogPostPage.tsx`)

1. **Blog Hub (`/blog`)**:
   - **Hero Featured Article Banner**: Big visual card showcasing the latest tax deep-dive.
   - **Filter Toolbar**: Category tabs (*All*, *Tax Planning*, *Budget 2026*, *TDS Guide*, *Corporate Tax*) + Search bar.
   - **Card Grid**: Modern responsive cards with cover photo, category pill, reading time, publication date, author avatar, and title.
   - **Sidebar Widget**: Trending posts, Quick Calculator links, and Newsletter subscribe card.
2. **Single Article View (`/blog/:slug`)**:
   - Reading progress bar fixed at top of screen.
   - Hero header with breadcrumbs, publish date, author bio chip, and reading time.
   - **Sticky Table of Contents (TOC)**: Automatically extracts `<h2>` and `<h3>` tags with active scroll highlighting.
   - Rich article body with responsive tables, styled blockquotes, and callout cards.
   - **Interactive Calculator Embeds**: Live embedded calculator widgets (e.g. Salary Tax or TDS Calculator) mounted inside the article so readers can run calculations immediately.
   - Author info footer box with social links.
   - **Related Articles**: 3-card recommendation grid.
   - **SEO JSON-LD**: Complete Schema.org `BlogPosting` structured data.

---

### 4. Step-by-Step Execution Plan

1. **Schema & Backend API**:
   - Update `src/types/schema.ts` with `BlogPost` and `BlogCategory` interfaces.
   - Add sample seed blog posts in `data/db.json` with FY 2026-27 direct tax articles.
   - Implement `/api/public/blogs`, `/api/public/blogs/:slug`, and `/api/admin/blogs` in `server.ts`.
2. **Admin CMS Workspace**:
   - Create `src/pages/admin/AdminBlogManager.tsx` (posts list, filters, categories).
   - Create `src/pages/admin/AdminBlogEditor.tsx` (WordPress-style editor, sidebar controls, SEO preview, calculator embeds).
   - Register Blog CMS tab in `AdminLayout.tsx` and routing in `App.tsx`.
3. **Public Blog Hub & Article Reader**:
   - Create `src/pages/BlogIndexPage.tsx` (`/blog`) with search, category filtering, and featured heroes.
   - Create `src/pages/BlogPostPage.tsx` (`/blog/:slug`) with Table of Contents, progress bar, social sharing, and embedded calculator integration.
4. **Header Navigation & Sitemap**:
   - Add "Blog" link to `Header.tsx` and `Footer.tsx`.
   - Update route resolver and metadata for search engine indexing.
5. **Verification & Testing**:
   - Test creating a new post from `/admin`, publishing, and viewing at `/blog/:slug`.
   - Run `lint_applet` and `compile_applet`.
