import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'lucide-react',
        'recharts',
        'motion',
      ],
      esbuildOptions: {
        target: 'esnext',
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      warmup: {
        clientFiles: [
          './src/main.tsx',
          './src/App.tsx',
          './src/pages/HomePage.tsx',
          './src/pages/CalculatorPage.tsx',
          './src/pages/CategoryPage.tsx',
          './src/pages/SubcategoryPage.tsx',
          './src/components/layout/Header.tsx',
          './src/components/layout/Footer.tsx',
        ],
      },
    },
  };
});
