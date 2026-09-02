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

const netlifyConfig: Pick<NextConfig, 'experimental' | 'webpack'> = {
  experimental: {
    webpackBuildWorker: true,
    webpackMemoryOptimizations: true,
  },
  webpack(config, { nextRuntime }) {
    // Some packages (such as epub2) reference their own files without a
    // leading "./". Prefer the package-local file before looking in
    // node_modules so those imports remain resolvable in the server bundle.
    config.resolve.preferRelative = true;

    if (nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/auth': resolve(process.cwd(), 'src/libs/next/proxy/netlify-edge-auth-stub.ts'),
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
  ...(isNetlify ? netlifyConfig : {}),
});

export default nextConfig;
