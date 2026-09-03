import { cpSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import * as dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { migrate as neonMigrate } from 'drizzle-orm/neon-serverless/migrator';
import { migrate as nodeMigrate } from 'drizzle-orm/node-postgres/migrator';

// @ts-ignore tsgo handle esm import cjs and compatibility issues
import { shouldSkipPgSearchMigrations } from './compatibility';
import { DB_FAIL_INIT_HINT, DUPLICATE_EMAIL_HINT, PGVECTOR_HINT } from './errorHint';
import { runWithLockRetry } from './retry';

// Load environment variables in priority order:
// 1. .env (lowest priority)
// 2. .env.[env] (medium priority, overrides .env)
// 3. .env.[env].local (highest priority, overrides previous)
// Use dotenv-expand to support ${var} variable expansion
const env = process.env.NODE_ENV || 'development';
dotenvExpand.expand(dotenv.config()); // Load .env
dotenvExpand.expand(dotenv.config({ override: true, path: `.env.${env}` })); // Load .env.[env] and override
dotenvExpand.expand(dotenv.config({ override: true, path: `.env.${env}.local` })); // Load .env.[env].local and override

const migrationsFolder = path.join(__dirname, '../../packages/database/migrations');

const getMigrationsFolder = () => {
  if (!shouldSkipPgSearchMigrations(process.env)) return migrationsFolder;

  // Managed Neon databases no longer allow the deprecated ParadeDB `pg_search`
  // extension. Keep the migration journal in sync while skipping only the
  // optional full-text-search extension and indexes.
  const compatibleMigrationsFolder = mkdtempSync(
    path.join(tmpdir(), 'lobehub-compatible-migrations-'),
  );
  cpSync(migrationsFolder, compatibleMigrationsFolder, { recursive: true });

  for (const filename of [
    '0090_enable_pg_search.sql',
    '0093_add_bm25_indexes_with_icu.sql',
  ]) {
    writeFileSync(
      path.join(compatibleMigrationsFolder, filename),
      '-- pg_search is unavailable on this managed Neon database; intentionally skipped.\nSELECT 1;\n',
    );
  }

  return compatibleMigrationsFolder;
};

const runMigrations = async () => {
  const { serverDB } = await import('../../packages/database/src/server');

  const time = Date.now();
  await runWithLockRetry(async () => {
    const effectiveMigrationsFolder = getMigrationsFolder();

    if (process.env.DATABASE_DRIVER === 'node') {
      await nodeMigrate(serverDB, { migrationsFolder: effectiveMigrationsFolder });
    } else {
      await neonMigrate(serverDB, { migrationsFolder: effectiveMigrationsFolder });
    }
  });

  console.log('✅ database migration pass. use: %s ms', Date.now() - time);

  process.exit(0);
};

const connectionString = process.env.DATABASE_URL || process.env.NETLIFY_DB_URL;

// Netlify Database provides NETLIFY_DB_URL automatically during builds.
// Normalize it for the existing database adapter and migration tooling.
if (connectionString && !process.env.DATABASE_URL) process.env.DATABASE_URL = connectionString;

// only migrate database if the connection string is available
if (connectionString) {
  runMigrations().catch((err) => {
    console.error('❌ Database migrate failed:', err);

    const errMsg = err.message as string;

    const constraint = (err as { constraint?: string })?.constraint;

    if (errMsg.includes('extension "vector" is not available')) {
      console.info(PGVECTOR_HINT);
    } else if (constraint === 'users_email_unique' || errMsg.includes('users_email_unique')) {
      console.info(DUPLICATE_EMAIL_HINT);
    } else if (errMsg.includes(`Cannot read properties of undefined (reading 'migrate')`)) {
      console.info(DB_FAIL_INIT_HINT);
    }

    process.exit(1);
  });
} else {
  console.log('🟢 not find database env or in desktop mode, migration skipped');
}
