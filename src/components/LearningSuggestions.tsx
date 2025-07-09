'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LearningActivity, 
  getRecommendedActivities,
  activities 
} from './ActivityDatabase';
import { 
  JournalEntry, 
  UserProfile, 
  moodEmojis, 
  stressLabels,
  getSubjectColor,
  initializeSampleData 
} from './DataUtils';

interface SuggestionFeedback {
  activityId: string;
  rating: 'positive' | 'negative' | 'neutral';
  timestamp: number;
  completed: boolean;
  moodAfter?: number;
}

interface SuggestionsProps {
  currentMood?: number;
  currentStress?: number;
  showAfterEntry?: boolean;
}

export default function LearningSuggestions({ 
  currentMood, 
  currentStress, 
  showAfterEntry = false 
}: SuggestionsProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<LearningActivity[]>([]);
  const [feedback, setFeedback] = useState<SuggestionFeedback[]>([]);
  const [savedActivities, setSavedActivities] = useState<string[]>([]);
  const [recentlySuggested, setRecentlySuggested] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  useEffect(() => {
    initializeSampleData();
    
    const loadData = () => {
      try {
        const storedEntries = localStorage.getItem('journalEntries');
        const storedProfile = localStorage.getItem('userProfile');
        const storedFeedback = localStorage.getItem('suggestionFeedback');
        const storedSaved = localStorage.getItem('savedActivities');
        const storedRecent = localStorage.getItem('recentlySuggested');
        
        if (storedEntries) {
          setEntries(JSON.parse(storedEntries));
        }
        
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }

        if (storedFeedback) {
          setFeedback(JSON.parse(storedFeedback));
        }

        if (storedSaved) {
          setSavedActivities(JSON.parse(storedSaved));
        }

        if (storedRecent) {
          setRecentlySuggested(JSON.parse(storedRecent));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      generateSuggestions();
    }
  }, [loading, currentMood, currentStress, entries]);

  const generateSuggestions = () => {
    const mood = currentMood || getCurrentMood();
    const stress = currentStress || getCurrentStress();
    const preferredSubjects = getPreferredSubjects();
    
    // Get recently suggested activities to avoid repetition
    const recentIds = recentlySuggested.slice(-10); // Last 10 suggestions
    
    const recommendations = getRecommendedActivities(
      mood,
      stress,
      preferredSubjects,
      30, // max 30 minutes
      recentIds
    );

    setSuggestions(recommendations);
    
    // Update recently suggested
    const newRecent = [...recentlySuggested, ...recommendations.map(a => a.id)];
    setRecentlySuggested(newRecent.slice(-20)); // Keep last 20
    localStorage.setItem('recentlySuggested', JSON.stringify(newRecent.slice(-20)));
  };

  const getCurrentMood = (): number => {
    // Get mood from today's entry or default to 3
    const today = new Date().toDateString();
    const todayEntry = entries.find(entry => new Date(entry.date).toDateString() === today);
    return todayEntry?.mood || 3;
  };

  const getCurrentStress = (): number => {
    // Get stress from today's entry or default to 3
    const today = new Date().toDateString();
    const todayEntry = entries.find(entry => new Date(entry.date).toDateString() === today);
    return todayEntry?.stress || 3;
  };

  const getPreferredSubjects = (): string[] => {
    if (entries.length === 0) return [];
    
    // Count entries by subject
    const subjectCounts: { [key: string]: number } = {};
    entries.forEach(entry => {
      subjectCounts[entry.subject] = (subjectCounts[entry.subject] || 0) + 1;
    });
    
    // Get top 3 subjects
    return Object.entries(subjectCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([subject]) => subject);
  };

  const handleActivityFeedback = (activityId: string, rating: 'positive' | 'negative' | 'neutral', completed: boolean = false) => {
    const newFeedback: SuggestionFeedback = {
      activityId,
      rating,
      timestamp: Date.now(),
      completed
    };

    const updatedFeedback = [...feedback, newFeedback];
    setFeedback(updatedFeedback);
    localStorage.setItem('suggestionFeedback', JSON.stringify(updatedFeedback));

    // Show mood feedback if completed
    if (completed) {
      setShowFeedback(activityId);
    }
  };

  const handleMoodAfterActivity = (activityId: string, moodAfter: number) => {
    const updatedFeedback = feedback.map(f => 
      f.activityId === activityId ? { ...f, moodAfter } : f
    );
    setFeedback(updatedFeedback);
    localStorage.setItem('suggestionFeedback', JSON.stringify(updatedFeedback));
    setShowFeedback(null);
  };

  const toggleSavedActivity = (activityId: string) => {
    const updated = savedActivities.includes(activityId)
      ? savedActivities.filter(id => id !== activityId)
      : [...savedActivities, activityId];
    
    setSavedActivities(updated);
    localStorage.setItem('savedActivities', JSON.stringify(updated));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'interactive': return '🎮';
      case 'creative': return '🎨';
      case 'problem-solving': return '🧩';
      case 'reflective': return '🤔';
      case 'physical': return '🏃';
      default: return '📚';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentMoodValue = currentMood || getCurrentMood();
  const currentStressValue = currentStress || getCurrentStress();
  const preferredSubjects = getPreferredSubjects();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">💡 Try This!</h1>
            <p className="text-green-100">Personalized learning activities just for you</p>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-2">✨</div>
            <div className="text-sm text-green-100">Smart Suggestions</div>
          </div>
        </div>
      </div>

      {/* Current State Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Based on Your Current State</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <span className="text-2xl">{moodEmojis[currentMoodValue - 1]}</span>
            <div>
              <p className="text-sm text-gray-600">Current Mood</p>
              <p className="font-semibold text-gray-800">{currentMoodValue}/5</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <span className="text-2xl">😰</span>
            <div>
              <p className="text-sm text-gray-600">Stress Level</p>
              <p className="font-semibold text-gray-800">{stressLabels[currentStressValue - 1]}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <span className="text-2xl">📚</span>
            <div>
              <p className="text-sm text-gray-600">Top Subjects</p>
              <p className="font-semibold text-gray-800">
                {preferredSubjects.length > 0 ? preferredSubjects.slice(0, 2).join(', ') : 'None yet'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <button
            onClick={generateSuggestions}
            className="btn btn-outline btn-sm"
          >
            🔄 Refresh Suggestions
          </button>
          {showAfterEntry && (
            <Link href="/suggestions">
              <span className="btn btn-primary btn-sm">View All Suggestions</span>
            </Link>
          )}
        </div>
      </div>

      {/* Wellness Recommendation for High Stress */}
      {currentStressValue >= 4 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl">🧘</div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Wellness Break Recommended</h2>
              <p className="text-gray-600">You seem a bit stressed. Consider taking a moment for yourself!</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Link href="/wellness" className="group">
              <div className="bg-white rounded-xl p-4 border border-purple-200 hover:border-purple-400 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🫁</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-purple-600">Breathing Exercise</h3>
                    <p className="text-sm text-gray-600">Take 3 minutes to breathe and relax</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/wellness" className="group">
              <div className="bg-white rounded-xl p-4 border border-purple-200 hover:border-purple-400 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✨</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-purple-600">Positive Affirmations</h3>
                    <p className="text-sm text-gray-600">Get encouraging messages for stress relief</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="text-center">
            <Link href="/wellness">
              <span className="btn btn-primary">
                🧘 Visit Wellness Center
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Recommended Activities</h2>
        
        {suggestions.length > 0 ? (
          suggestions.map((activity) => (
            <div key={activity.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(activity.type)}</span>
                    <h3 className="text-lg font-bold text-gray-800">{activity.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                      {activity.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{activity.description}</p>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubjectColor(activity.subject)}`}>
                      {activity.subject}
                    </span>
                    <span className="text-sm text-gray-500">⏱️ {activity.duration} min</span>
                    <span className="text-sm text-gray-500">{getTypeIcon(activity.type)} {activity.type}</span>
                  </div>
                  
                  {activity.materials && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Materials needed:</p>
                      <p className="text-sm text-gray-600">{activity.materials.join(', ')}</p>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Why this?</span> {activity.whyThis}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleActivityFeedback(activity.id, 'positive', true)}
                    className="btn btn-primary btn-sm"
                  >
                    ✨ Try It!
                  </button>
                  <button
                    onClick={() => toggleSavedActivity(activity.id)}
                    className={`btn btn-sm ${savedActivities.includes(activity.id) ? 'btn-outline' : 'btn-secondary'}`}
                  >
                    {savedActivities.includes(activity.id) ? '💾 Saved' : '💾 Save'}
                  </button>
                  <button
                    onClick={() => handleActivityFeedback(activity.id, 'negative')}
                    className="btn btn-outline btn-sm"
                  >
                    👎 Not Interested
                  </button>
                </div>
              </div>

              {/* Mood Feedback Modal */}
              {showFeedback === activity.id && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-800 mb-3">
                    How did this activity make you feel?
                  </p>
                  <div className="flex gap-2">
                    {moodEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleMoodAfterActivity(activity.id, index + 1)}
                        className="p-2 rounded-lg hover:bg-yellow-100 transition-colors"
                      >
                        <span className="text-xl">{emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No suggestions right now</h3>
            <p className="text-gray-600 mb-4">Try adding more journal entries to get personalized suggestions!</p>
            <Link href="/story">
              <span className="btn btn-primary">Add Journal Entry</span>
            </Link>
          </div>
        )}
      </div>

      {/* Saved Activities */}
      {savedActivities.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">💾 Saved for Later</h2>
          <div className="space-y-3">
            {activities
              .filter(activity => savedActivities.includes(activity.id))
              .map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getTypeIcon(activity.type)}</span>
                    <div>
                      <p className="font-medium text-gray-800">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.subject} • {activity.duration} min</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSavedActivity(activity.id)}
                    className="btn btn-sm btn-outline"
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      {!showAfterEntry && (
        <div className="flex justify-center gap-4">
          <Link href="/">
            <span className="btn btn-outline">
              ← Back to Dashboard
            </span>
          </Link>
          <Link href="/story">
            <span className="btn btn-primary">
              Add New Entry
            </span>
          </Link>
        </div>
      )}
    </div>
  );
} 