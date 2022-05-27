
import { defineConfig } from 'tsup'

export default defineConfig({
  splitting: true,
  clean: true,
  dts: true,
  entryPoints: ['src/*.ts'],
  format: ['cjs', 'esm'],
  target: 'node12',
  shims: false
})