/**
 * Example component showing how to use the AI services
 * This demonstrates all the AI integration features
 */

import React, { useState } from 'react';
import { aiService } from '../services/api';

export const AIServiceExample: React.FC = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [healthStatus, setHealthStatus] = useState<any>(null);

  // Generate article from title
  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await aiService.generateArticle(title);
      setResult(response.result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate article');
    } finally {
      setLoading(false);
    }
  };

  // Improve text readability
  const handleImprove = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await aiService.improveText(text);
      setResult(response.result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to improve text');
    } finally {
      setLoading(false);
    }
  };

  // Summarize text
  const handleSummarize = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await aiService.summarizeText(text);
      setResult(response.result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to summarize text');
    } finally {
      setLoading(false);
    }
  };

  // Process batch of items
  const handleBatch = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      const items = [
        { title: 'AI in Healthcare', action: 'generate' },
        { title: 'Machine Learning Basics', action: 'generate' },
      ];

      const response = await aiService.batchProcess(items);
      setResult(JSON.stringify(response.results, null, 2));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process batch');
    } finally {
      setLoading(false);
    }
  };

  // Check AI service health
  const handleHealthCheck = async () => {
    try {
      const status = await aiService.healthCheck();
      setHealthStatus(status);
    } catch (err: any) {
      setHealthStatus({ status: 'unhealthy', error: err.message });
    }
  };

  return (
    <div className="ai-service-example p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Service Integration Example</h1>

      {/* Health Check Section */}
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Service Health</h2>
        <button
          onClick={handleHealthCheck}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Check Health
        </button>
        {healthStatus && (
          <pre className="mt-2 p-2 bg-white rounded text-sm">
            {JSON.stringify(healthStatus, null, 2)}
          </pre>
        )}
      </div>

      {/* Generate Article Section */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Generate Article from Title</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter article title..."
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !title}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate Article'}
        </button>
      </div>

      {/* Improve Text Section */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Improve Text Readability</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to improve..."
          className="w-full p-2 border rounded mb-2 h-32"
        />
        <button
          onClick={handleImprove}
          disabled={loading || !text}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Improving...' : 'Improve Text'}
        </button>
      </div>

      {/* Summarize Text Section */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Summarize Text</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to summarize..."
          className="w-full p-2 border rounded mb-2 h-32"
        />
        <button
          onClick={handleSummarize}
          disabled={loading || !text}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
        >
          {loading ? 'Summarizing...' : 'Summarize Text'}
        </button>
      </div>

      {/* Batch Process Section */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Batch Processing</h2>
        <p className="text-sm text-gray-600 mb-2">
          Process multiple items at once (demo with predefined items)
        </p>
        <button
          onClick={handleBatch}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Process Batch'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mb-4 p-4 bg-green-100 rounded">
          <h3 className="text-lg font-semibold mb-2">Result:</h3>
          <div className="whitespace-pre-wrap bg-white p-4 rounded">
            {result}
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Processing with AI...</p>
        </div>
      )}
    </div>
  );
};

export default AIServiceExample;

