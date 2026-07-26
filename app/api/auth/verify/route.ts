import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);

  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: { id: user.id, email: user.email },
  });
}
