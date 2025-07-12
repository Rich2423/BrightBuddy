'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import AIConfig from '../../components/AIConfig';

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

interface UserProfile {
  name: string;
  age?: number;
  grade?: string;
}

const moodEmojis = ['😢', '😕', '😐', '🙂', '😄'];
const stressColors = ['bg-green-100 text-green-800', 'bg-blue-100 text-blue-800', 'bg-yellow-100 text-yellow-800', 'bg-orange-100 text-orange-800', 'bg-red-100 text-red-800'];
const stressLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];

const subjects = [
  'Math', 'Science', 'Reading', 'Writing', 'History', 
  'Art', 'Music', 'Physical Education', 'Social Studies', 'Technology'
];

const subjectColors = [
  'bg-purple-100 text-purple-800',
  'bg-green-100 text-green-800', 
  'bg-blue-100 text-blue-800',
  'bg-yellow-100 text-yellow-800',
  'bg-red-100 text-red-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-orange-100 text-orange-800',
  'bg-teal-100 text-teal-800',
  'bg-gray-100 text-gray-800'
];

export default function ProfilePage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'entries' | 'stats' | 'profile' | 'ai'>('entries');

  useEffect(() => {
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

  const getSubjectColor = (subject: string) => {
    const index = subjects.indexOf(subject);
    return index >= 0 ? subjectColors[index] : 'bg-gray-100 text-gray-800';
  };

  const getStats = () => {
    if (entries.length === 0) return null;

    const subjectCounts: { [key: string]: number } = {};
    let totalMood = 0;
    let totalStress = 0;
    const monthlyData: { [key: string]: number } = {};

    entries.forEach(entry => {
      // Subject counts
      subjectCounts[entry.subject] = (subjectCounts[entry.subject] || 0) + 1;
      
      // Mood and stress totals
      totalMood += entry.mood;
      totalStress += entry.stress;
      
      // Monthly data
      const month = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    const mostFrequentSubject = Object.keys(subjectCounts).reduce((a, b) => 
      subjectCounts[a] > subjectCounts[b] ? a : b
    );

    return {
      totalEntries: entries.length,
      averageMood: Math.round(totalMood / entries.length),
      averageStress: Math.round(totalStress / entries.length),
      mostFrequentSubject,
      subjectCounts,
      monthlyData
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getStats();
  const userName = profile?.name || 'Learner';

  return (
    <ProtectedRoute>
      <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 My Learning Progress</h1>
            <p className="text-purple-100">Keep track of your amazing learning journey!</p>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-2">🎓</div>
            <div className="text-sm text-purple-100">Total Entries</div>
            <div className="text-2xl font-bold">{entries.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-1 shadow-lg border border-gray-100">
        <div className="flex">
          <button
            onClick={() => setActiveTab('entries')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
              activeTab === 'entries' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📝 All Entries
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
              activeTab === 'stats' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📈 Statistics
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
              activeTab === 'profile' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
              activeTab === 'ai' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🤖 AI Settings
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'entries' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">All Learning Entries</h2>
                      <div className="flex gap-2">
            <Link href="/story">
              <span className="btn btn-primary btn-sm">Add New Entry</span>
            </Link>
            <Link href="/progress">
              <span className="btn btn-outline btn-sm">View Analytics</span>
            </Link>
          </div>
          </div>
          
          {entries.length > 0 ? (
            <div className="space-y-4">
              {entries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry) => (
                  <div key={entry.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{moodEmojis[entry.mood - 1]}</span>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {new Date(entry.date).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(entry.subject)}`}>
                              {entry.subject}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${stressColors[entry.stress - 1]}`}>
                              {stressLabels[entry.stress - 1]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{entry.learningNote}</p>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No entries yet!</h3>
              <p className="text-gray-600 mb-6">Start your learning journey by creating your first entry.</p>
              <Link href="/story">
                <span className="btn btn-primary btn-lg">Create Your First Entry</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-6">
          {stats ? (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalEntries}</div>
                  <div className="text-sm text-gray-600">Total Entries</div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
                  <div className="text-2xl mb-2">{moodEmojis[stats.averageMood - 1]}</div>
                  <div className="text-2xl font-bold text-green-600">{stats.averageMood}/5</div>
                  <div className="text-sm text-gray-600">Avg Mood</div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
                  <div className="text-2xl mb-2">😰</div>
                  <div className="text-2xl font-bold text-orange-600">{stats.averageStress}/5</div>
                  <div className="text-sm text-gray-600">Avg Stress</div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="text-lg font-bold text-purple-600 truncate">{stats.mostFrequentSubject}</div>
                  <div className="text-sm text-gray-600">Top Subject</div>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Subject Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(stats.subjectCounts)
                    .sort(([,a], [,b]) => b - a)
                    .map(([subject, count]) => (
                      <div key={subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubjectColor(subject)}`}>
                            {subject}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-gray-800">{count} entries</div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No data yet!</h3>
              <p className="text-gray-600">Create some entries to see your learning statistics.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">My Profile</h2>
          
          {profile ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-6xl">👤</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{profile.name}</h3>
                  {profile.age && <p className="text-gray-600">Age: {profile.age}</p>}
                  {profile.grade && <p className="text-gray-600">Grade: {profile.grade}</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No profile yet!</h3>
              <p className="text-gray-600 mb-4">Set up your profile to personalize your experience.</p>
              <button className="btn btn-primary">Create Profile</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">AI Assistant Settings</h2>
          <AIConfig />
        </div>
      )}

      {/* Back to Dashboard */}
      <div className="text-center">
        <Link href="/">
          <span className="btn btn-outline">
            ← Back to Dashboard
          </span>
        </Link>
      </div>
      </div>
    </ProtectedRoute>
  );
} 