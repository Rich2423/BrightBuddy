'use client';

import React, { useState, useEffect } from 'react';
import { aiService, type AIMotivationalContent, type AIUserContext } from './AIService';

interface AIMotivationalContentProps {
  userContext: AIUserContext;
  type?: 'encouragement' | 'celebration' | 'support';
  onContentGenerated?: (content: AIMotivationalContent) => void;
}

export default function AIMotivationalContent({ userContext, type = 'encouragement', onContentGenerated }: AIMotivationalContentProps) {
  const [content, setContent] = useState<AIMotivationalContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAIAvailable, setIsAIAvailable] = useState(false);

  useEffect(() => {
    setIsAIAvailable(aiService.isAvailable());
  }, []);

  useEffect(() => {
    if (isAIAvailable) {
      generateContent();
    }
  }, [userContext, type, isAIAvailable]);

  const generateContent = async () => {
    if (!isAIAvailable) return;

    setIsLoading(true);
    setError('');

    try {
      const aiContent = await aiService.generateMotivationalContent(userContext, type);
      setContent(aiContent);
      onContentGenerated?.(aiContent);
    } catch (err) {
      console.error('Failed to generate motivational content:', err);
      setError('Unable to generate motivational content. Using default message.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'encouragement': return '💪';
      case 'celebration': return '🎉';
      case 'support': return '🤗';
      default: return '💪';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'encouragement': return 'from-blue-500 to-purple-600';
      case 'celebration': return 'from-yellow-500 to-orange-600';
      case 'support': return 'from-green-500 to-teal-600';
      default: return 'from-blue-500 to-purple-600';
    }
  };

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'encouragement': return 'Daily Encouragement';
      case 'celebration': return 'Achievement Celebration';
      case 'support': return 'Supportive Message';
      default: return 'Motivational Message';
    }
  };

  if (!isAIAvailable) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-blue-900 font-medium">AI Motivational Content</h3>
        </div>
        <p className="text-blue-700 text-sm">
          Enable AI features to receive personalized motivational messages and encouragement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-8 h-8 bg-gradient-to-r ${getTypeColor(type)} rounded-lg flex items-center justify-center mr-3`}>
            <span className="text-white text-sm">{getTypeIcon(type)}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{getTypeTitle(type)}</h3>
        </div>
        <button
          onClick={generateContent}
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
        <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ) : content ? (
        <div className={`bg-white border border-gray-200 rounded-lg p-6 bg-gradient-to-br ${getTypeColor(type)} bg-opacity-5`}>
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(type)} rounded-full flex items-center justify-center flex-shrink-0`}>
              <span className="text-white text-lg">{getTypeIcon(type)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{getTypeTitle(type)}</h4>
                {content.actionable && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Actionable
                  </span>
                )}
              </div>
              
                             <p className="text-gray-700 text-lg leading-relaxed mb-3">
                 &ldquo;{content.message}&rdquo;
               </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Context: {content.context}</span>
                <span className="capitalize">{content.type}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {content && (
        <div className="text-xs text-gray-500 text-center">
          This message is personalized based on your current mood ({userContext.recentMood}/5), 
          stress level ({userContext.stressLevel}/5), and learning streak ({userContext.learningStreak} days).
        </div>
      )}
    </div>
  );
} 