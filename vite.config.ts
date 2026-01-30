import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Cloud Run sets the PORT env var, but vite preview needs --port flag which we set in package.json
  // This defines the API Key at build time so it is available in the browser bundle
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  server: {
    host: true,
  }
});