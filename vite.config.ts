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

      // Allow both Vite- and Next-style public env var prefixes so client embeds can read them
      envPrefix: ['VITE_', 'NEXT_PUBLIC_'],

    };
});
