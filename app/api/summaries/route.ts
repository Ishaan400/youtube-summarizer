import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Summary from '@/lib/db/models/Summary';
import { getAuthUser } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const summaries = await Summary.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      summaries: summaries.map((s) => ({
        _id: s._id.toString(),
        url: s.url,
        summary: s.summary,
        createdAt: s.createdAt,
      })),
    });
  } catch (error) {
    console.error('Fetch summaries error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
