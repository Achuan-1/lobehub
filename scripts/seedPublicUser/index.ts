/**
 * Ensure the single shared user exists for an explicitly enabled no-login
 * deployment. This runs after database migrations on Netlify.
 */
const main = async () => {
  if (process.env.ENABLE_MOCK_DEV_USER !== '1') {
    console.log('Public mock-user mode is disabled; skipping user seed.');
    return;
  }

  const connectionString = process.env.DATABASE_URL || process.env.NETLIFY_DB_URL;
  if (!connectionString) throw new Error('DATABASE_URL or NETLIFY_DB_URL is required');
  process.env.DATABASE_URL ||= connectionString;

  const userId = process.env.MOCK_DEV_USER_ID || 'PUBLIC_USER';
  const { serverDB } = await import('../../packages/database/src/server');
  const { users } = await import('../../packages/database/src/schemas/user');

  await serverDB
    .insert(users)
    .values({
      email: 'shared-user@localhost',
      emailVerified: true,
      fullName: 'Shared User',
      id: userId,
      username: 'shared-user',
    })
    .onConflictDoNothing();

  console.log(`Shared user is ready: ${userId}`);
};

main().catch((error) => {
  console.error('Failed to seed shared user:', error);
  process.exit(1);
});
