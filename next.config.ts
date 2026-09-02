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
const nextConfig = defineConfig({
  ...(isVercel || isNetlify ? serverlessConfig : {}),
  ...(isNetlify ? { experimental: { webpackMemoryOptimizations: true } } : {}),
});

export default nextConfig;
