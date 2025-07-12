'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import LearningSuggestions from '../../components/LearningSuggestions';
import AILearningSuggestions from '../../components/AILearningSuggestions';
import { type AIUserContext } from '../../components/AIService';

export default function SuggestionsPage() {
  const [userContext, setUserContext] = useState<AIUserContext>({
    recentMood: 3,
    stressLevel: 2,
    favoriteSubjects: ['Math', 'Science'],
    goals: ['Improve problem-solving skills', 'Learn new concepts'],
    challenges: ['Time management', 'Focus'],
    learningStreak: 5,
    totalEntries: 12
  });

  useEffect(() => {
    // Load user data from localStorage or other sources
    const savedMood = localStorage.getItem('currentMood');
    const savedStress = localStorage.getItem('currentStress');
    const savedSubjects = localStorage.getItem('favoriteSubjects');
    const savedGoals = localStorage.getItem('learningGoals');
    const savedStreak = localStorage.getItem('learningStreak');
    const savedEntries = localStorage.getItem('totalEntries');

    if (savedMood) userContext.recentMood = parseInt(savedMood);
    if (savedStress) userContext.stressLevel = parseInt(savedStress);
    if (savedSubjects) userContext.favoriteSubjects = JSON.parse(savedSubjects);
    if (savedGoals) userContext.goals = JSON.parse(savedGoals);
    if (savedStreak) userContext.learningStreak = parseInt(savedStreak);
    if (savedEntries) userContext.totalEntries = parseInt(savedEntries);
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Suggestions</h1>
            <p className="text-gray-600">
              Discover personalized learning activities and recommendations to enhance your educational journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Suggestions</h2>
              <AILearningSuggestions 
                userContext={userContext}
                onSuggestionClick={(suggestion) => {
                  console.log('Selected AI suggestion:', suggestion);
                  // Handle suggestion selection
                }}
              />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Curated Activities</h2>
              <LearningSuggestions />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 