import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/main.ts', 'src/**/*.module.ts'],
    },
  },
  resolve: {
    alias: {
      '@karfani/shared': path.resolve(__dirname, '../shared/src/index.ts'),
      '@karfani/database': path.resolve(__dirname, './test/mocks/database.ts'),
    },
  },
  plugins: [swc.vite()],
});
