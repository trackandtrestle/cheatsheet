// One-file build for publishing as a self-contained page: lazy chunks are inlined.
import { defineConfig, mergeConfig } from 'vite';
import base from './vite.config';

export default mergeConfig(
  base,
  defineConfig({
    build: {
      outDir: 'dist-single',
      chunkSizeWarningLimit: 4000,
      rolldownOptions: { output: { inlineDynamicImports: true } },
    },
  }),
);
