import { name, version } from './package.json';

import { crx } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';
import manifest from './manifest.config.js';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import zip from 'vite-plugin-zip-pack';

export default defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [
    react(),
    crx({ manifest }),
    zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
  ],
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
});
