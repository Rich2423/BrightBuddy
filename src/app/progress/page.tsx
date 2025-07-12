'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  JournalEntry, 
  UserProfile, 
  moodEmojis, 
  stressLabels,
  subjects,
  getSubjectColor,
  initializeSampleData 
} from '../../components/DataUtils';

type TimePeriod = 'week' | 'month' | '3months' | 'custom';

interface TimeRange {
  start: Date;
  end: Date;
  label: string;
}

interface StreakData {
  current: number;
  best: number;
  consistency: number;
  milestones: number[];
}

interface MoodData {
  average: number;
  distribution: { [key: number]: number };
  trend: { date: string; value: number }[];
  correlation: string;
}

interface SubjectData {
  distribution: { [key: string]: number };
  mostStudied: string;
  leastStudied: string;
  moodCorrelations: { [key: string]: number };
}

interface ActivityData {
  totalEntries: number;
  averagePerWeek: number;
  mostProductiveDay: string;
  averageEntryLength: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export default function ProgressPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const [customRange, setCustomRange] = useState<TimeRange | null>(null);

  useEffect(() => {
    initializeSampleData();
    
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

  const getTimeRange = (): TimeRange => {
    const now = new Date();
    const start = new Date();

    switch (timePeriod) {
      case 'week':
        start.setDate(now.getDate() - 7);
        return { start, end: now, label: 'This Week' };
      case 'month':
        start.setMonth(now.getMonth() - 1);
        return { start, end: now, label: 'This Month' };
      case '3months':
        start.setMonth(now.getMonth() - 3);
        return { start, end: now, label: 'Last 3 Months' };
      case 'custom':
        return customRange || { start, end: now, label: 'Custom Range' };
      default:
        start.setDate(now.getDate() - 7);
        return { start, end: now, label: 'This Week' };
    }
  };

  const getFilteredEntries = (): JournalEntry[] => {
    const range = getTimeRange();
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= range.start && entryDate <= range.end;
    });
  };

  const calculateStreak = (): StreakData => {
    if (entries.length === 0) return { current: 0, best: 0, consistency: 0, milestones: [] };

    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let currentDate = new Date();
    const milestones = [];

    // Calculate current streak
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      const diffTime = currentDate.getTime() - entryDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === currentStreak) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate best streak
    for (let i = 0; i < sortedEntries.length - 1; i++) {
      const currentEntry = new Date(sortedEntries[i].date);
      const nextEntry = new Date(sortedEntries[i + 1].date);
      const diffDays = Math.ceil((currentEntry.getTime() - nextEntry.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak + 1);
        tempStreak = 0;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak + 1);

    // Calculate consistency for current period
    const range = getTimeRange();
    const totalDays = Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24));
    const filteredEntries = getFilteredEntries();
    const consistency = totalDays > 0 ? Math.round((filteredEntries.length / totalDays) * 100) : 0;

    // Check milestones
    if (currentStreak >= 7) milestones.push(7);
    if (currentStreak >= 30) milestones.push(30);
    if (currentStreak >= 100) milestones.push(100);

    return { current: currentStreak, best: bestStreak, consistency, milestones };
  };

  const getMoodData = (): MoodData => {
    const filteredEntries = getFilteredEntries();
    if (filteredEntries.length === 0) {
      return { average: 0, distribution: {}, trend: [], correlation: '' };
    }

    let totalMood = 0;
    const distribution: { [key: number]: number } = {};
    const trend = filteredEntries
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => ({ date: entry.date, value: entry.mood }));

    filteredEntries.forEach(entry => {
      totalMood += entry.mood;
      distribution[entry.mood] = (distribution[entry.mood] || 0) + 1;
    });

    const average = Math.round(totalMood / filteredEntries.length);
    
    // Simple correlation analysis
    let correlation = '';
    const weekendEntries = filteredEntries.filter(entry => {
      const day = new Date(entry.date).getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    });
    
    if (weekendEntries.length > 0) {
      const weekendMood = weekendEntries.reduce((sum, entry) => sum + entry.mood, 0) / weekendEntries.length;
      if (weekendMood > average) {
        correlation = "Your mood tends to be higher on weekends! 🌟";
      } else if (weekendMood < average) {
        correlation = "You seem to have better moods during weekdays! 📚";
      }
    }

    return { average, distribution, trend, correlation };
  };

  const getSubjectData = (): SubjectData => {
    const filteredEntries = getFilteredEntries();
    if (filteredEntries.length === 0) {
      return { distribution: {}, mostStudied: '', leastStudied: '', moodCorrelations: {} };
    }

    const distribution: { [key: string]: number } = {};
    const moodCorrelations: { [key: string]: number } = {};

    filteredEntries.forEach(entry => {
      distribution[entry.subject] = (distribution[entry.subject] || 0) + 1;
      
      if (!moodCorrelations[entry.subject]) {
        moodCorrelations[entry.subject] = 0;
      }
      moodCorrelations[entry.subject] += entry.mood;
    });

    // Calculate average mood per subject
    Object.keys(moodCorrelations).forEach(subject => {
      moodCorrelations[subject] = Math.round(moodCorrelations[subject] / distribution[subject]);
    });

    const sortedSubjects = Object.entries(distribution).sort(([,a], [,b]) => b - a);
    const mostStudied = sortedSubjects[0]?.[0] || '';
    const leastStudied = sortedSubjects[sortedSubjects.length - 1]?.[0] || '';

    return { distribution, mostStudied, leastStudied, moodCorrelations };
  };

  const getActivityData = (): ActivityData => {
    const filteredEntries = getFilteredEntries();
    if (filteredEntries.length === 0) {
      return { totalEntries: 0, averagePerWeek: 0, mostProductiveDay: '', averageEntryLength: 0 };
    }

    const totalEntries = filteredEntries.length;
    const range = getTimeRange();
    const weeksInRange = Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24 * 7));
    const averagePerWeek = Math.round(totalEntries / weeksInRange);

    // Most productive day
    const dayCounts: { [key: string]: number } = {};
    filteredEntries.forEach(entry => {
      const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    const mostProductiveDay = Object.entries(dayCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    // Average entry length
    const totalLength = filteredEntries.reduce((sum, entry) => sum + entry.learningNote.length, 0);
    const averageEntryLength = Math.round(totalLength / totalEntries);

    return { totalEntries, averagePerWeek, mostProductiveDay, averageEntryLength };
  };

  const getAchievements = (): Achievement[] => {
    const streakData = calculateStreak();
    const moodData = getMoodData();
    const subjectData = getSubjectData();
    const activityData = getActivityData();

    const achievements: Achievement[] = [
      {
        id: 'first-entry',
        title: 'First Steps',
        description: 'Created your first learning entry',
        icon: '🌟',
        unlocked: entries.length >= 1
      },
      {
        id: 'week-streak',
        title: 'Week Warrior',
        description: 'Maintained a 7-day learning streak',
        icon: '🔥',
        unlocked: streakData.current >= 7
      },
      {
        id: 'month-streak',
        title: 'Monthly Master',
        description: 'Maintained a 30-day learning streak',
        icon: '🏆',
        unlocked: streakData.current >= 30
      },
      {
        id: 'happy-learner',
        title: 'Happy Learner',
        description: 'Averaged 4+ mood for a week',
        icon: '😄',
        unlocked: moodData.average >= 4
      },
      {
        id: 'subject-explorer',
        title: 'Subject Explorer',
        description: 'Tried 5 different subjects',
        icon: '📚',
        unlocked: Object.keys(subjectData.distribution).length >= 5
      },
      {
        id: 'consistent-writer',
        title: 'Consistent Writer',
        description: 'Wrote 50+ words average per entry',
        icon: '✍️',
        unlocked: activityData.averageEntryLength >= 50
      }
    ];

    return achievements;
  };

  const renderCalendarHeatmap = () => {
    const range = getTimeRange();
    const days = [];
    const current = new Date(range.start);

    while (current <= range.end) {
      const dateStr = current.toISOString().split('T')[0];
      const hasEntry = entries.some(entry => entry.date === dateStr);
      days.push({ date: dateStr, hasEntry });
      current.setDate(current.getDate() + 1);
    }

    return (
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Learning Calendar</h3>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs text-gray-500 text-center py-1">{day}</div>
          ))}
          {days.map((day, index) => (
            <div
              key={day.date}
              className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs ${
                day.hasEntry 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-400'
              }`}
              title={`${day.date}: ${day.hasEntry ? 'Entry logged' : 'No entry'}`}
            >
              {new Date(day.date).getDate()}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMoodTrend = () => {
    const moodData = getMoodData();
    
    return (
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Mood Trend</h3>
        {moodData.trend.length > 0 ? (
          <div className="space-y-2">
            {moodData.trend.map((point, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-20">
                  {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-400 to-green-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(point.value / 5) * 100}%` }}
                  />
                </div>
                <span className="text-lg">{moodEmojis[point.value - 1]}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No mood data for this period</p>
        )}
      </div>
    );
  };

  const renderSubjectChart = () => {
    const subjectData = getSubjectData();
    const total = Object.values(subjectData.distribution).reduce((sum, count) => sum + count, 0);
    
    return (
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Subject Distribution</h3>
        {total > 0 ? (
          <div className="space-y-3">
            {Object.entries(subjectData.distribution)
              .sort(([,a], [,b]) => b - a)
              .map(([subject, count]) => {
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={subject} className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubjectColor(subject)}`}>
                      {subject}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No subject data for this period</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const streakData = calculateStreak();
  const moodData = getMoodData();
  const subjectData = getSubjectData();
  const activityData = getActivityData();
  const achievements = getAchievements();
  const filteredEntries = getFilteredEntries();
  const timeRange = getTimeRange();

  return (
    <ProtectedRoute>
      <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 Learning Analytics</h1>
            <p className="text-indigo-100">Track your progress and celebrate your growth!</p>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-sm text-indigo-100">Progress Tracker</div>
          </div>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Time Period</h2>
          <span className="text-sm text-gray-600">{timeRange.label}</span>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', '3months'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timePeriod === period
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period === 'week' && 'Week'}
              {period === 'month' && 'Month'}
              {period === '3months' && '3 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* Streak & Consistency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="text-6xl mb-4">🔥</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{streakData.current} Days</h3>
          <p className="text-gray-600 mb-4">Current Learning Streak</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Best Streak:</span>
              <span className="font-semibold">{streakData.best} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Consistency:</span>
              <span className="font-semibold">{streakData.consistency}%</span>
            </div>
          </div>
          {streakData.milestones.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                🎉 Milestone reached: {streakData.milestones.join(', ')} day streak!
              </p>
            </div>
          )}
        </div>

        {renderCalendarHeatmap()}
      </div>

      {/* Mood & Stress Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderMoodTrend()}
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Mood Insights</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">{moodEmojis[moodData.average - 1] || '😐'}</div>
              <p className="text-2xl font-bold text-gray-800">{moodData.average}/5</p>
              <p className="text-gray-600">Average Mood</p>
            </div>
            
            {moodData.correlation && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">{moodData.correlation}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">Mood Distribution</h4>
              {Object.entries(moodData.distribution).map(([mood, count]) => (
                <div key={mood} className="flex items-center gap-2">
                  <span className="text-lg">{moodEmojis[parseInt(mood) - 1]}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / filteredEntries.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subject Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSubjectChart()}
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Subject Insights</h3>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Most Studied:</span> {subjectData.mostStudied}
              </p>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Happiest Subject:</span> {
                  Object.entries(subjectData.moodCorrelations)
                    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
                }
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">Subject Mood Averages</h4>
              {Object.entries(subjectData.moodCorrelations)
                .sort(([,a], [,b]) => b - a)
                .map(([subject, mood]) => (
                  <div key={subject} className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSubjectColor(subject)}`}>
                      {subject}
                    </span>
                    <span className="text-sm text-gray-600">
                      {moodEmojis[mood - 1]} {mood}/5
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl mb-2">📝</div>
          <div className="text-2xl font-bold text-blue-600">{activityData.totalEntries}</div>
          <div className="text-sm text-gray-600">Total Entries</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl mb-2">📅</div>
          <div className="text-2xl font-bold text-green-600">{activityData.averagePerWeek}</div>
          <div className="text-sm text-gray-600">Per Week</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl mb-2">⭐</div>
          <div className="text-lg font-bold text-purple-600">{activityData.mostProductiveDay}</div>
          <div className="text-sm text-gray-600">Best Day</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl mb-2">✍️</div>
          <div className="text-2xl font-bold text-orange-600">{activityData.averageEntryLength}</div>
          <div className="text-sm text-gray-600">Avg Length</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{achievement.title}</h3>
              <p className="text-sm text-gray-600">{achievement.description}</p>
              {achievement.unlocked && (
                <div className="mt-2 text-xs text-green-600 font-medium">✓ Unlocked</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
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
      </div>
    </ProtectedRoute>
  );
} 