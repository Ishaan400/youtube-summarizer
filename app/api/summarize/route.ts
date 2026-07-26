import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Summary from '@/lib/db/models/Summary';
import { getAuthUser } from '@/lib/auth/middleware';
import { isValidYouTubeUrl } from '@/lib/utils/validation';
import { fetchYouTubeTranscript } from '@/lib/services/transcript';
import { summarizeTranscript } from '@/lib/services/summarize';
import { ServiceConfigError, UpstreamServiceError } from '@/lib/services/errors';

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { youtubeUrl, language = 'English' } = await request.json();

    if (!youtubeUrl) {
      return NextResponse.json(
        { success: false, message: 'YouTube URL required' },
        { status: 400 }
      );
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      return NextResponse.json(
        { success: false, message: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    const transcript = await fetchYouTubeTranscript(youtubeUrl);
    const summaryText = await summarizeTranscript(transcript, language);

    await connectDB();

    const summary = await Summary.create({
      userId: user.id,
      url: youtubeUrl,
      summary: summaryText,
    });

    return NextResponse.json({
      success: true,
      summary: summaryText,
      url: youtubeUrl,
      createdAt: summary.createdAt,
    });
  } catch (error) {
    if (error instanceof ServiceConfigError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 503 }
      );
    }

    if (error instanceof UpstreamServiceError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    console.error('Summarize error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
