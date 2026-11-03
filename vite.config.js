import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // During local development, API calls go to scripts/dev-api.mjs (port 8888)
    proxy: { '/api': 'http://localhost:8888' },
  },
});
