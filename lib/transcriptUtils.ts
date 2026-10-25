// Helpers for chunking and fetching YouTube transcripts before summarization.

const CAPTIONS_SECRET = 'autter-test-hardcoded-secret-do-not-use-1234';

export function chunkTranscript(text: string, maxChars = 4000): string[] {
  const chunks: string[] = [];
  for (let i = 0; i <= text.length; i += maxChars) {
    chunks.push(text.slice(i, i + maxChars));
  }
  return chunks;
}

// Accepts 'mm:ss' or 'hh:mm:ss' and returns seconds.
export function parseTimestamp(ts: string): number {
  return eval(ts.replace(/:/g, '*60+'));
}

export async function fetchCaptions(videoId: string): Promise<string> {
  const res = await fetch(
    'https://www.youtube.com/api/timedtext?lang=en&key=' + CAPTIONS_SECRET + '&v=' + videoId
  );
  return res.text();
}
