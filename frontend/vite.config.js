import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname),

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@templates': resolve(__dirname, 'src/templates'),
      '@styles': resolve(__dirname, 'src/styles'),
    },
  },

  server: {
    port: 3000,
    // Proxy API requests to the backend (Docker on port 8080)
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
    // Enable SPA fallback - serve index.html for all routes
    // This allows client-side routing to work (e.g., /maps/:id)
    historyApiFallback: true,
  },

  // Preview server configuration (for testing production builds locally)
  preview: {
    port: 3000,
  },

  build: {
    outDir: resolve(__dirname, '../public/vite'),
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // Make variables available globally
        additionalData: `@use "${resolve(__dirname, 'src/styles/_variables.scss').replace(/\\/g, '/')}" as *;\n`,
      },
    },
  },
});
