'use client';

import React, { useState, useEffect } from 'react';
import { aiService, type AIReflectionPrompt, type AIUserContext } from './AIService';

interface AIReflectionPromptsProps {
  userContext: AIUserContext;
  category: 'learning' | 'wellness' | 'goals' | 'growth';
  onPromptSelect?: (prompt: AIReflectionPrompt) => void;
}

export default function AIReflectionPrompts({ userContext, category, onPromptSelect }: AIReflectionPromptsProps) {
  const [prompts, setPrompts] = useState<AIReflectionPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAIAvailable, setIsAIAvailable] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<AIReflectionPrompt | null>(null);

  useEffect(() => {
    setIsAIAvailable(aiService.isAvailable());
  }, []);

  useEffect(() => {
    if (isAIAvailable) {
      generatePrompts();
    }
  }, [userContext, category, isAIAvailable]);

  const generatePrompts = async () => {
    if (!isAIAvailable) return;

    setIsLoading(true);
    setError('');

    try {
      const aiPrompts = await aiService.generateReflectionPrompts(userContext, category);
      setPrompts(aiPrompts);
    } catch (err) {
      console.error('Failed to generate reflection prompts:', err);
      setError('Unable to generate reflection prompts. Using default questions.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return '📚';
      case 'wellness': return '🧘';
      case 'goals': return '🎯';
      case 'growth': return '🌱';
      default: return '🤔';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'from-blue-500 to-indigo-600';
      case 'wellness': return 'from-green-500 to-emerald-600';
      case 'goals': return 'from-purple-500 to-violet-600';
      case 'growth': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'learning': return 'Learning Reflection';
      case 'wellness': return 'Wellness Check-in';
      case 'goals': return 'Goal Reflection';
      case 'growth': return 'Personal Growth';
      default: return 'Reflection';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'deep': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePromptClick = (prompt: AIReflectionPrompt) => {
    setSelectedPrompt(prompt);
    onPromptSelect?.(prompt);
  };

  if (!isAIAvailable) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-blue-900 font-medium">AI Reflection Prompts</h3>
        </div>
        <p className="text-blue-700 text-sm">
          Enable AI features to get personalized reflection questions based on your learning journey.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-8 h-8 bg-gradient-to-r ${getCategoryColor(category)} rounded-lg flex items-center justify-center mr-3`}>
            <span className="text-white text-sm">{getCategoryIcon(category)}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{getCategoryTitle(category)}</h3>
        </div>
        <button
          onClick={generatePrompts}
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
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt, index) => (
            <div
              key={index}
              className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${
                selectedPrompt === prompt ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handlePromptClick(prompt)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${getCategoryColor(category)} rounded-lg flex items-center justify-center text-white text-sm`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-2">{prompt.question}</h4>
                  
                  {prompt.followUp && (
                    <p className="text-gray-600 text-sm mb-3 italic">
                      Follow-up: {prompt.followUp}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(prompt.difficulty)}`}>
                        {prompt.difficulty}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full capitalize">
                        {prompt.category}
                      </span>
                    </div>
                    
                    {selectedPrompt === prompt && (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {prompts.length > 0 && (
        <div className="text-xs text-gray-500 text-center">
          These reflection prompts are personalized based on your current mood ({userContext.recentMood}/5), 
          stress level ({userContext.stressLevel}/5), and learning preferences.
        </div>
      )}

      {selectedPrompt && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Selected Prompt:</h4>
          <p className="text-blue-800 text-sm mb-2">{selectedPrompt.question}</p>
          {selectedPrompt.followUp && (
            <p className="text-blue-700 text-sm italic">{selectedPrompt.followUp}</p>
          )}
        </div>
      )}
    </div>
  );
} 