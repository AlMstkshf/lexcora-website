import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0'
      },

      plugins: (() => {
        const plugins: any[] = [react()];
        // If ANALYZE=true is set in env, generate a bundle visualizer report at build time
        if (process.env.ANALYZE === 'true') {
          plugins.push(visualizer({ filename: 'dist/stats.html', open: false }));
        }
        return plugins;
      })(),
      // process env keys are intentionally not injected into client bundles. Server should hold secrets.

      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },

      // Build optimizations: explicit code-splitting to reduce initial bundle size
      build: {
        rollupOptions: {
          output: {
            manualChunks(id: string) {
              if (id.includes('node_modules')) {
                // Group React into its own vendor chunk
                if (id.includes('react')) return 'react-vendor';
                if (id.includes('lucide-react')) return 'icons';
                // Fallback vendor chunk
                return 'vendor';
              }
              // Explicitly return undefined when not matching to satisfy strict checks
              return undefined as any;
            }
          }
        }
      }
    };
});
