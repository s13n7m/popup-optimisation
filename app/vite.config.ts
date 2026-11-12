import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The planner app. In dev, /api is proxied to the FastAPI service from step 6 (make serve).
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    proxy: { '/api': { target: 'http://127.0.0.1:8000', rewrite: (p) => p.replace(/^\/api/, '') } },
  },
});
