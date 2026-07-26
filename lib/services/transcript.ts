import { extractYouTubeVideoId } from '@/lib/utils/youtube';
import { ServiceConfigError, UpstreamServiceError } from '@/lib/services/errors';

function parseTranscriptPayload(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (typeof record.transcript === 'string' && record.transcript.trim()) {
    return record.transcript.trim();
  }

  if (typeof record.text === 'string' && record.text.trim()) {
    return record.text.trim();
  }

  if (record.data && typeof record.data === 'object') {
    return parseTranscriptPayload(record.data);
  }

  return null;
}

export async function fetchYouTubeTranscript(youtubeUrl: string): Promise<string> {
  const apiUrl = process.env.YOUTUBE_TRANSCRIPT_API_URL;

  if (!apiUrl) {
    throw new ServiceConfigError('YOUTUBE_TRANSCRIPT_API_URL is not configured');
  }

  const videoId = extractYouTubeVideoId(youtubeUrl);

  if (!videoId) {
    throw new UpstreamServiceError('Could not extract a video ID from the YouTube URL', 400);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const apiKey = process.env.YOUTUBE_TRANSCRIPT_API_KEY;
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ url: youtubeUrl, videoId }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new UpstreamServiceError(
      `Transcript service failed (${response.status}): ${errorText || response.statusText}`,
      502
    );
  }

  const data: unknown = await response.json();
  const transcript = parseTranscriptPayload(data);

  if (!transcript) {
    throw new UpstreamServiceError('Transcript service returned an empty or invalid response', 502);
  }

  return transcript;
}
