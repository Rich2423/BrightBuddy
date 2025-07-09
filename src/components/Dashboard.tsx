'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  JournalEntry, 
  UserProfile, 
  moodEmojis, 
  stressColors, 
  stressLabels, 
  subjects, 
  getSubjectColor, 
  getGreeting, 
  getCurrentDate, 
  getStreak, 
  getWeeklyStats,
  initializeSampleData 
} from './DataUtils';

export default function Dashboard() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize sample data if none exists
    initializeSampleData();
    
    // Load data from localStorage
    const loadData = () => {
      try {
        const storedEntries = localStorage.getItem('journalEntries');
        const storedProfile = localStorage.getItem('userProfile');
        
        if (storedEntries) {
          setEntries(JSON.parse(storedEntries));
        }
        
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getTodayEntry = () => {
    const today = new Date().toDateString();
    return entries.find(entry => new Date(entry.date).toDateString() === today);
  };

  const getRecentEntries = () => {
    return entries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };



  const motivationalQuotes = [
    "Every day is a new opportunity to learn something amazing! 🌟",
    "Your brain is like a muscle - the more you use it, the stronger it gets! 💪",
    "Learning is an adventure that never ends! 🚀",
    "You're doing great! Keep up the fantastic work! ⭐",
    "Every challenge is a chance to grow smarter! 🌱"
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const todayEntry = getTodayEntry();
  const streak = getStreak(entries);
  const weeklyStats = getWeeklyStats(entries);
  const recentEntries = getRecentEntries();
  const userName = profile?.name || 'Learner';

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {userName}! 👋
            </h1>
            <p className="text-blue-100 mb-3">{getCurrentDate()}</p>
            <p className="text-lg font-medium">{randomQuote}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-sm text-blue-100">Learning Streak</div>
            <div className="text-2xl font-bold">{streak} days</div>
          </div>
        </div>
      </div>

      {/* Today's Entry Status */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Today's Learning Journey</h2>
        
        {todayEntry ? (
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{moodEmojis[todayEntry.mood - 1]}</span>
                <div>
                  <p className="font-semibold text-green-800">Great job! You've logged today's entry</p>
                  <p className="text-sm text-green-600">Subject: {todayEntry.subject}</p>
                </div>
              </div>
              <Link href="/story">
                <span className="btn btn-sm btn-outline">Edit Entry</span>
              </Link>
            </div>
            <p className="text-gray-700 text-sm line-clamp-2">{todayEntry.learningNote}</p>
          </div>
        ) : (
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200 text-center">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Ready to learn something new?</h3>
            <p className="text-orange-600 mb-4">Share what you learned today and how you're feeling!</p>
            <Link href="/story">
              <span className="btn btn-primary btn-lg">Add Today's Entry</span>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-blue-600">{streak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl mb-2">📅</div>
          <div className="text-2xl font-bold text-green-600">{weeklyStats.count}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl mb-2">📚</div>
          <div className="text-lg font-bold text-purple-600 truncate">{weeklyStats.mostFrequentSubject}</div>
          <div className="text-sm text-gray-600">Top Subject</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl mb-2">{moodEmojis[weeklyStats.averageMood - 1] || '😐'}</div>
          <div className="text-2xl font-bold text-yellow-600">{weeklyStats.averageMood}/5</div>
          <div className="text-sm text-gray-600">Avg Mood</div>
        </div>
      </div>

      {/* Recent Entries Timeline */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Learning Adventures</h2>
          <div className="flex gap-2">
            <Link href="/profile">
              <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All →</span>
            </Link>
            <Link href="/progress">
              <span className="text-purple-600 hover:text-purple-800 text-sm font-medium">Analytics →</span>
            </Link>
            <Link href="/advanced-progress">
              <span className="text-green-600 hover:text-green-800 text-sm font-medium">Analytics →</span>
            </Link>
          </div>
        </div>
        
        {recentEntries.length > 0 ? (
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100">
                <div className="text-2xl">{moodEmojis[entry.mood - 1]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(entry.subject)}`}>
                      {entry.subject}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${stressColors[entry.stress - 1]}`}>
                      {stressLabels[entry.stress - 1]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{entry.learningNote}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🌟</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Start Your Learning Journey!</h3>
            <p className="text-gray-600 mb-4">Your first entry will appear here and begin your amazing learning adventure!</p>
            <Link href="/story">
              <span className="btn btn-primary">Create Your First Entry</span>
            </Link>
          </div>
        )}
      </div>

      {/* Navigation & Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/story" className="flex-1">
          <span className="btn btn-primary btn-lg w-full">
            <span className="text-xl mr-2">✨</span>
            Add New Entry
          </span>
        </Link>
        <Link href="/suggestions" className="flex-1">
          <span className="btn btn-outline btn-lg w-full">
            <span className="text-xl mr-2">💡</span>
            Get Suggestions
          </span>
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/profile">
          <span className="btn btn-secondary btn-lg">
            <span className="text-xl mr-2">📊</span>
            My Progress
          </span>
        </Link>
        <Link href="/wellness">
          <span className="btn btn-secondary btn-lg">
            <span className="text-xl mr-2">🧘</span>
            Wellness Center
          </span>
        </Link>
      </div>
    </div>
  );
} 