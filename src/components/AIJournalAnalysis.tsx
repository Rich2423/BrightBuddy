'use client';

import React, { useState, useEffect } from 'react';
import { aiService, type AIJournalAnalysis } from './AIService';

interface AIJournalAnalysisProps {
  entryText: string;
  userHistory: {
    totalEntries: number;
    averageMood: number;
    favoriteSubjects: string[];
  };
  onAnalysisComplete?: (analysis: AIJournalAnalysis) => void;
}

export default function AIJournalAnalysis({ entryText, userHistory, onAnalysisComplete }: AIJournalAnalysisProps) {
  const [analysis, setAnalysis] = useState<AIJournalAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAIAvailable, setIsAIAvailable] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    setIsAIAvailable(aiService.isAvailable());
  }, []);

  const analyzeEntry = async () => {
    if (!isAIAvailable || !entryText.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const aiAnalysis = await aiService.analyzeJournalEntry(entryText, userHistory);
      setAnalysis(aiAnalysis);
      onAnalysisComplete?.(aiAnalysis);
      setShowAnalysis(true);
    } catch (err) {
      console.error('Failed to analyze journal entry:', err);
      setError('Unable to analyze entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'neutral': return 'text-gray-600 bg-gray-50';
      case 'concerned': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'concerned': return '🤔';
      default: return '📝';
    }
  };

  if (!isAIAvailable) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-blue-900 font-medium">AI Journal Analysis</h3>
        </div>
        <p className="text-blue-700 text-sm">
          Enable AI features to get intelligent insights and feedback on your journal entries.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!showAnalysis && (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">AI Journal Analysis</h3>
          </div>
          <button
            onClick={analyzeEntry}
            disabled={isLoading || !entryText.trim()}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-md hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </div>
            ) : (
              'Analyze Entry'
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      )}

      {analysis && showAnalysis && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">{getSentimentIcon(analysis.sentiment)}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(analysis.sentiment)}`}>
              {analysis.sentiment} sentiment
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Encouraging Observation</h4>
                  <p className="text-green-800 text-sm">{analysis.encouragingObservation}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Learning Insight</h4>
                  <p className="text-blue-800 text-sm">{analysis.learningInsight}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <h4 className="font-medium text-purple-900 mb-1">Growth Suggestion</h4>
                  <p className="text-purple-800 text-sm">{analysis.growthSuggestion}</p>
                </div>
              </div>
            </div>

            {analysis.topics.length > 0 && (
              <div className="bg-gray-50 rounded-md p-4">
                <h4 className="font-medium text-gray-900 mb-2">Topics Identified</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="text-xs bg-white text-gray-700 px-2 py-1 rounded-full border border-gray-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Confidence: {Math.round(analysis.confidence * 100)}%</span>
              <button
                onClick={() => setShowAnalysis(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                Hide Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {showAnalysis && analysis && (
        <div className="text-xs text-gray-500 text-center">
          AI analysis is based on your journal entry and learning history. 
          The insights are designed to be encouraging and educational.
        </div>
      )}
    </div>
  );
} 