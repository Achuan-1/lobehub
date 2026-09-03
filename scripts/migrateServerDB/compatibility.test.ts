import { describe, expect, it } from 'vitest';

import { shouldSkipPgSearchMigrations } from './compatibility';

describe('shouldSkipPgSearchMigrations', () => {
  it('skips pg_search for a Neon DATABASE_URL', () => {
    expect(
      shouldSkipPgSearchMigrations({
        DATABASE_URL: 'postgresql://user:password@ep-example.us-east-1.aws.neon.tech/db?sslmode=require',
      }),
    ).toBe(true);
  });

  it('keeps the existing Netlify compatibility path', () => {
    expect(
      shouldSkipPgSearchMigrations({ NETLIFY_DB_URL: 'postgresql://example.netlify/db' }),
    ).toBe(true);
  });

  it('keeps pg_search migrations for self-hosted Postgres', () => {
    expect(
      shouldSkipPgSearchMigrations({ DATABASE_URL: 'postgresql://localhost:5432/lobehub' }),
    ).toBe(false);
  });
});
