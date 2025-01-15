import React, { useState } from 'react';
import axios from 'axios';
import { useSignOut, useUserData } from '@nhost/react';
import { Youtube, Clock, Brain, LogOut } from 'lucide-react';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signOut } = useSignOut();
  const user = useUserData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await axios.post('https://n8n-dev.subspace.money/webhook/ytube', {
        youtubeUrl: url,
        language: 'English' // Default to English
      });

      let summaryText = '';
      if (Array.isArray(response.data) && response.data[0]?.summary) {
        summaryText = response.data[0].summary;
      } else if (response.data?.summary) {
        summaryText = response.data.summary;
      } else if (typeof response.data === 'string') {
        summaryText = response.data;
      }

      setSummary(summaryText);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Youtube className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">YT Summarizer</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transform YouTube Content into Concise Summaries
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Save time and extract key insights from any YouTube video
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Clock className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Save Time</h3>
            <p className="text-gray-600">Get the main points without watching the entire video</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Brain className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-600">Advanced AI technology for accurate summaries</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium 
                       hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                       transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? 'Generating Summary...' : 'Generate Summary'}
            </button>
          </form>

          {isLoading && (
            <div className="mt-8 flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Analyzing video content...</p>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          )}

          {summary && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}