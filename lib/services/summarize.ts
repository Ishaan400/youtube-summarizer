import { ServiceConfigError, UpstreamServiceError } from '@/lib/services/errors';

const DEFAULT_SUMMARY_PROMPT =
  'Summarize the following YouTube video transcript clearly and concisely. Focus on the main points, key takeaways, and conclusions.';

function parseSummaryPayload(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (typeof record.summary === 'string' && record.summary.trim()) {
    return record.summary.trim();
  }

  if (typeof record.text === 'string' && record.text.trim()) {
    return record.text.trim();
  }

  const choices = record.choices;
  if (Array.isArray(choices) && choices.length > 0) {
    const firstChoice = choices[0];
    if (firstChoice && typeof firstChoice === 'object') {
      const message = (firstChoice as Record<string, unknown>).message;
      if (message && typeof message === 'object') {
        const content = (message as Record<string, unknown>).content;
        if (typeof content === 'string' && content.trim()) {
          return content.trim();
        }
      }
    }
  }

  return null;
}

async function summarizeWithOpenAiFormat(
  apiUrl: string,
  apiKey: string,
  transcript: string,
  language: string
): Promise<string> {
  const model = process.env.AI_MODEL || 'gpt-4o-mini';
  const prompt = `${DEFAULT_SUMMARY_PROMPT} Write the summary in ${language}.`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: transcript },
      ],
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new UpstreamServiceError(
      `Summarization service failed (${response.status}): ${errorText || response.statusText}`,
      502
    );
  }

  const data: unknown = await response.json();
  const summary = parseSummaryPayload(data);

  if (!summary) {
    throw new UpstreamServiceError('Summarization service returned an empty or invalid response', 502);
  }

  return summary;
}

async function summarizeWithCustomFormat(
  apiUrl: string,
  transcript: string,
  language: string
): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const apiKey = process.env.AI_SUMMARIZATION_API_KEY;
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      text: transcript,
      transcript,
      language,
      prompt: `${DEFAULT_SUMMARY_PROMPT} Write the summary in ${language}.`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new UpstreamServiceError(
      `Summarization service failed (${response.status}): ${errorText || response.statusText}`,
      502
    );
  }

  const data: unknown = await response.json();
  const summary = parseSummaryPayload(data);

  if (!summary) {
    throw new UpstreamServiceError('Summarization service returned an empty or invalid response', 502);
  }

  return summary;
}

export async function summarizeTranscript(
  transcript: string,
  language = 'English'
): Promise<string> {
  const apiUrl = process.env.AI_SUMMARIZATION_API_URL;

  if (!apiUrl) {
    throw new ServiceConfigError('AI_SUMMARIZATION_API_URL is not configured');
  }

  const apiKey = process.env.AI_SUMMARIZATION_API_KEY;
  const usesOpenAiFormat =
    apiUrl.includes('openai.com') || apiUrl.includes('/chat/completions');

  if (usesOpenAiFormat) {
    if (!apiKey) {
      throw new ServiceConfigError('AI_SUMMARIZATION_API_KEY is required for OpenAI-compatible APIs');
    }

    return summarizeWithOpenAiFormat(apiUrl, apiKey, transcript, language);
  }

  return summarizeWithCustomFormat(apiUrl, transcript, language);
}
