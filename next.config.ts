import { resolve } from 'node:path';

import type { NextConfig } from 'next';

import { defineConfig } from './src/libs/next/config/define-config';

const isVercel = !!process.env.VERCEL_ENV;
const isNetlify = process.env.NETLIFY === 'true';

const serverlessConfig = {
  // Keep optional local-runtime binaries out of serverless functions. They are
  // only used by desktop/local agent features and can exceed provider limits.
  outputFileTracingExcludes: {
    '*': [
      'node_modules/.pnpm/@img+sharp-libvips-*musl*',
      'node_modules/.pnpm/@anthropic-ai+claude-agent-sdk-*/**',
      'node_modules/@anthropic-ai/claude-agent-sdk-*/**',
      'node_modules/.pnpm/ffmpeg-static@*/**',
      'node_modules/ffmpeg-static/**',
      // Exclude SPA/desktop/mobile build artifacts from serverless functions
      'public/_spa/**',
      'dist/desktop/**',
      'dist/mobile/**',
      'apps/desktop/**',
      'packages/database/migrations/**',
    ],
  },
};

const serverlessBuildConfig: Pick<NextConfig, 'experimental' | 'webpack'> = {
  experimental: {
    webpackBuildWorker: true,
    webpackMemoryOptimizations: true,
  },
  webpack(config, { nextRuntime }) {
    // epub2 optionally loads the native `zipfile` package inside a try/catch
    // and falls back to adm-zip when it is unavailable. Webpack resolves the
    // optional import eagerly, so provide a throwing module that preserves the
    // package's intended fallback behavior without changing global resolution.
    config.resolve.alias = {
      ...config.resolve.alias,
      'zipfile$': resolve(
        process.cwd(),
        'src/libs/document-loaders/loaders/epub/zipfile-unavailable.cjs',
      ),
    };

    // On Netlify, Next.js 16 can leave nextRuntime undefined while compiling
    // legacy middleware.ts. Only the explicit Node server build may include
    // the full Better Auth and OpenTelemetry implementations.
    if (isNetlify && nextRuntime !== 'nodejs') {
      config.resolve.alias = {
        ...config.resolve.alias,
        './instrumentation.node': resolve(
          process.cwd(),
          'src/libs/next/proxy/netlify-edge-instrumentation-stub.ts',
        ),
      };
    }
    config.module.rules.push({ test: /\.md$/, type: 'asset/source' });
    config.resolve.fallback = { ...config.resolve.fallback, 'zlib-sync': false };
    return config;
  },
};

const nextConfig = defineConfig({
  ...(isVercel || isNetlify ? serverlessConfig : {}),
  ...(isVercel || isNetlify ? serverlessBuildConfig : {}),
});

export default nextConfig;
