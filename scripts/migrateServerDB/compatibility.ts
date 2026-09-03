type DatabaseEnvironment = Pick<NodeJS.ProcessEnv, 'DATABASE_URL' | 'NETLIFY_DB_URL'>;

const isNeonConnectionString = (connectionString?: string) => {
  if (!connectionString) return false;

  try {
    return new URL(connectionString).hostname.endsWith('.neon.tech');
  } catch {
    return false;
  }
};

export const shouldSkipPgSearchMigrations = (env: DatabaseEnvironment) =>
  Boolean(env.NETLIFY_DB_URL) || isNeonConnectionString(env.DATABASE_URL);
