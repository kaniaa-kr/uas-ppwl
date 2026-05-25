import esbuild from 'esbuild'
import { copyFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

// Build backend code
await esbuild.build({
  entryPoints: ['src/lambda.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/index.mjs',
  format: 'esm',
  external: ['@prisma/client'], // Keep Prisma external
  minify: true,
})

// Copy package.json & prisma schema
copyFileSync('package.json', 'dist/package.json')
copyFileSync('prisma/schema.prisma', 'dist/schema.prisma')

// Install prod dependencies only in dist/
process.chdir('dist')
execSync('bun install --production')
process.chdir('..')

console.log('✅ Lambda build ready: dist/')