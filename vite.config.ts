import { defineConfig, mergeConfig } from 'vite';
import { defineConfig as defineConfigVitest } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
const viteConfig = defineConfig({
  plugins: [react()],
});

const vitestConfig = defineConfigVitest({
  test: {
    setupFiles: './vitest-setup.ts',
    environment: 'jsdom',
  },
});

export default mergeConfig(viteConfig, vitestConfig);
