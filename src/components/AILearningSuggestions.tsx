'use client';

import React, { useState, useEffect } from 'react';
import { aiService, AILearningSuggestion, AIUserContext } from './AIService';

interface AILearningSuggestionsProps {
  userContext: AIUserContext;
  onSuggestionClick?: (suggestion: AILearningSuggestion) => void;
}

export default function AILearningSuggestions({ userContext, onSuggestionClick }: AILearningSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<AILearningSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAIAvailable, setIsAIAvailable] = useState(false);

  useEffect(() => {
    setIsAIAvailable(aiService.isAvailable());
  }, []);

  useEffect(() => {
    if (isAIAvailable) {
      generateSuggestions();
    }
  }, [userContext, isAIAvailable]);

  const generateSuggestions = async () => {
    if (!isAIAvailable) return;

    setIsLoading(true);
    setError('');

    try {
      const aiSuggestions = await aiService.generateLearningSuggestions(userContext);
      setSuggestions(aiSuggestions);
    } catch (err) {
      console.error('Failed to generate AI suggestions:', err);
      setError('Unable to generate AI suggestions. Using default recommendations.');
      // Fallback suggestions are handled by the AI service
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectIcon = (subject: string) => {
    const subjectIcons: { [key: string]: string } = {
      'Math': '🔢',
      'Science': '🔬',
      'History': '📚',
      'English': '📝',
      'Art': '🎨',
      'Music': '🎵',
      'Physical Education': '⚽',
      'Technology': '💻',
      'General': '📖',
      'Exploration': '🔍',
      'Reflection': '🤔'
    };

    return subjectIcons[subject] || '📚';
  };

  if (!isAIAvailable) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-blue-900 font-medium">AI Learning Assistant</h3>
        </div>
        <p className="text-blue-700 text-sm">
          Enable AI features in your profile to get personalized learning suggestions based on your mood, 
          stress level, and learning patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Learning Suggestions</h3>
        </div>
        <button
          onClick={generateSuggestions}
          disabled={isLoading}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                suggestion.moodBoost ? 'border-l-4 border-l-green-500' : ''
              }`}
              onClick={() => onSuggestionClick?.(suggestion)}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                  {getSubjectIcon(suggestion.subject)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    {suggestion.moodBoost && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Mood Boost
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{suggestion.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(suggestion.difficulty)}`}>
                        {suggestion.difficulty}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {suggestion.estimatedTime}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {suggestion.subject}
                    </div>
                  </div>
                  
                  <div className="mt-3 p-2 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Why recommended:</span> {suggestion.whyRecommended}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="text-xs text-gray-500 text-center">
          Suggestions are personalized based on your current mood ({userContext.recentMood}/5), 
          stress level ({userContext.stressLevel}/5), and learning preferences.
        </div>
      )}
    </div>
  );
} 