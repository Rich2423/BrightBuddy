'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import LearningSuggestions from '../../components/LearningSuggestions';

interface JournalEntry {
  id: string;
  date: string;
  mood: number;
  stress: number;
  learningNote: string;
  subject: string;
  voiceNote?: string;
  photo?: string;
  timestamp: number;
}

const subjects = [
  'Math', 'Science', 'Reading', 'Writing', 'History', 
  'Art', 'Music', 'Physical Education', 'Social Studies', 'Technology'
];

const moodEmojis = ['😢', '😕', '😐', '🙂', '😄'];
const stressLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];

export default function JournalEntryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    mood: 3,
    stress: 3,
    learningNote: '',
    subject: 'Math'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        mood: formData.mood,
        stress: formData.stress,
        learningNote: formData.learningNote,
        subject: formData.subject,
        timestamp: Date.now()
      };

      // Get existing entries
      const existingEntries = localStorage.getItem('journalEntries');
      const entries = existingEntries ? JSON.parse(existingEntries) : [];
      
      // Add new entry
      entries.push(newEntry);
      
      // Save back to localStorage
      localStorage.setItem('journalEntries', JSON.stringify(entries));
      
      // Show suggestions instead of redirecting
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuggestions) {
    return (
      <LearningSuggestions 
        currentMood={formData.mood}
        currentStress={formData.stress}
        showAfterEntry={true}
      />
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📝 Today's Learning Adventure</h1>
          <p className="text-gray-600">Share what you learned and how you're feeling today!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What subject did you learn about today? 📚
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling today? 😊
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moodEmojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData({ ...formData, mood: index + 1 })}
                  className={`p-4 rounded-xl text-2xl transition-all ${
                    formData.mood === index + 1
                      ? 'bg-blue-100 border-2 border-blue-500 scale-110'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              {formData.mood === 1 && 'Very sad'}
              {formData.mood === 2 && 'A bit down'}
              {formData.mood === 3 && 'Okay'}
              {formData.mood === 4 && 'Pretty good'}
              {formData.mood === 5 && 'Great!'}
            </p>
          </div>

          {/* Stress Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How stressed do you feel? 😰
            </label>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <label key={level} className="flex items-center p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="stress"
                    value={level}
                    checked={formData.stress === level}
                    onChange={(e) => setFormData({ ...formData, stress: parseInt(e.target.value) })}
                    className="mr-3"
                  />
                  <span className="flex-1">{stressLabels[level - 1]}</span>
                  <span className="text-sm text-gray-500">Level {level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Learning Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What did you learn today? Share your thoughts! 💭
            </label>
            <textarea
              value={formData.learningNote}
              onChange={(e) => setFormData({ ...formData, learningNote: e.target.value })}
              placeholder="Tell us about what you learned, what was interesting, what was challenging, or anything else you'd like to share!"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 btn btn-outline btn-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.learningNote.trim()}
              className="flex-1 btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save My Entry ✨'}
            </button>
          </div>
        </form>
      </div>
      </div>
    </ProtectedRoute>
  );
} 