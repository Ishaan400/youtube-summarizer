'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Youtube, LogOut, Plus, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface Summary {
  _id: string;
  url: string;
  summary: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [url, setUrl] = useState('');
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [currentSummary, setCurrentSummary] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        router.push('/login');
        return;
      }

      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setCurrentSummary('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/summarize',
        { youtubeUrl: url },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCurrentSummary(response.data.summary);
        setUrl('');
        // Refresh summaries list
        fetchSummaries();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummaries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/summaries', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSummaries(response.data.summaries);
      }
    } catch (err) {
      console.error('Failed to fetch summaries', err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSummaries();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg">
              <Youtube className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">YT Summarizer</h1>
              <p className="text-white/60 text-xs">AI-powered summaries</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium text-sm">{user.email}</p>
              <p className="text-white/60 text-xs">Premium Member</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {/* Summarizer Section */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="card bg-white/10 border border-white/20 backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Summarize a Video</h2>
                <p className="text-white/60">Paste a YouTube URL and get a concise summary in seconds</p>
              </div>

              <form onSubmit={handleSummarize} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 bg-red-500/20 text-red-200 p-3 rounded-lg text-sm border border-red-500/30">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-white font-medium mb-2 text-sm">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Generate Summary
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Current Summary Display */}
            {currentSummary && (
              <div className="mt-6 card bg-green-500/10 border border-green-500/30">
                <h3 className="text-lg font-semibold text-green-400 mb-3">✓ Summary Generated</h3>
                <div className="bg-white/10 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <p className="text-white/80 leading-relaxed">{currentSummary}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Summary History</h2>

          {isFetching ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : summaries.length > 0 ? (
            <div className="grid gap-4">
              {summaries.map((summary) => (
                <div key={summary._id} className="card bg-white/10 border border-white/20">
                  <div className="flex justify-between items-start mb-3">
                    <a
                      href={summary.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium truncate flex-1 mr-4"
                    >
                      {summary.url}
                    </a>
                    <span className="text-white/50 text-xs whitespace-nowrap">
                      {new Date(summary.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm line-clamp-3">{summary.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="card bg-white/10 border border-white/20 text-center py-12">
              <p className="text-white/60">No summaries yet. Create one to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
