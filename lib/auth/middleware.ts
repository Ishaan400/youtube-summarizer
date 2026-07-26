import { NextRequest } from 'next/server';
import { verifyToken, JwtPayload } from './jwt';

export function getAuthUser(request: NextRequest): JwtPayload | null {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
