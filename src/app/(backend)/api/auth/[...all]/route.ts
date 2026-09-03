import { toNextJsHandler } from 'better-auth/next-js';
import type { NextRequest } from 'next/server';

import { auth } from '@/auth';

const jsonContentTypeRegex = /^application\/(?:[a-z0-9.+-]*\+)?json/i;

const handler = toNextJsHandler(auth);

const getMockSession = (request: NextRequest) => {
  const isMockSessionRequest =
    process.env.ENABLE_MOCK_DEV_USER === '1' &&
    new URL(request.url).pathname === '/api/auth/get-session';

  if (!isMockSessionRequest) return;

  const userId = process.env.MOCK_DEV_USER_ID || 'DEV_USER';
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return Response.json({
    session: {
      createdAt: now,
      expiresAt,
      id: `mock-session-${userId}`,
      token: `mock-token-${userId}`,
      updatedAt: now,
      userId,
    },
    user: {
      createdAt: now,
      email: 'local-dev@localhost',
      emailVerified: true,
      id: userId,
      image: '/achuan-ai-logo.png',
      name: '阿川 AI',
      updatedAt: now,
      username: 'achuan-ai',
    },
  });
};

const malformedJsonResponse = () =>
  Response.json({ code: 'INVALID_JSON', message: 'Malformed JSON request body' }, { status: 400 });

/**
 * better-call currently treats Request.json() SyntaxError as a server error.
 * Validate JSON bodies at the route boundary so malformed client payloads stay 400s.
 */
const validateJsonBody = async (request: Request) => {
  const contentType = request.headers.get('content-type') || '';
  if (!request.body || !jsonContentTypeRegex.test(contentType)) return;

  try {
    await request.clone().json();
  } catch (error) {
    if (error instanceof SyntaxError) return malformedJsonResponse();
    throw error;
  }
};

export const GET = async (request: NextRequest) => getMockSession(request) || handler.GET(request);

export const POST = async (request: NextRequest) => {
  const invalidJsonResponse = await validateJsonBody(request);
  if (invalidJsonResponse) return invalidJsonResponse;

  return handler.POST(request);
};
