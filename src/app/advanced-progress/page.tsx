'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LearningGoal, 
  GoalTemplate, 
  goalTemplates, 
  createGoalFromTemplate, 
  calculateGoalProgress,
  getSuggestedGoals,
  getDifficultyColor,
  getCategoryIcon
} from '../../components/GoalSystem';
import { 
  LearningInsight, 
  LearningPattern,
  analyzeLearningPatterns, 
  generateInsights, 
  getComparativeData,
  generateHeatmapData
} from '../../components/AdvancedAnalytics';
import { 
  ReflectionEntry, 
  createReflectionEntry, 
  generateReflectionInsights,
  getReflectionStats
} from '../../components/ReflectionSystem';
import { 
  ProgressReport, 
  generateProgressReport, 
  exportDataAsJSON, 
  exportDataAsCSV,
  generateShareableProgress
} from '../../components/ExportSystem';

// Sample user data - in a real app, this would come from a database
const sampleUserData = {
  entries: [
    { date: new Date(Date.now() - 86400000), mood: 4, stress: 2, subject: 'Math', learningNote: 'Learned about fractions today. It was challenging but I kept trying!' },
    { date: new Date(Date.now() - 172800000), mood: 3, stress: 3, subject: 'Science', learningNote: 'Science experiment was fun. Made a volcano!' },
    { date: new Date(Date.now() - 259200000), mood: 5, stress: 1, subject: 'Reading', learningNote: 'Reading time was amazing. Finished my book!' },
    { date: new Date(Date.now() - 345600000), mood: 4, stress: 2, subject: 'Math', learningNote: 'Practiced multiplication tables. Getting faster!' },
    { date: new Date(Date.now() - 432000000), mood: 2, stress: 4, subject: 'Writing', learningNote: 'Writing essay was hard. Need more practice.' },
  ],
  breathingSessions: [
    { date: new Date(Date.now() - 3600000), duration: 60, exercise: 'simple-333' },
    { date: new Date(Date.now() - 86400000), duration: 120, exercise: 'box-breathing' },
    { date: new Date(Date.now() - 172800000), duration: 90, exercise: 'calm-breath' },
  ],
  reflections: [],
  goals: [],
  badges: [],
  insights: [],
  currentStreak: 5
};

export default function AdvancedProgressPage() {
  const [userData, setUserData] = useState(sampleUserData);
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [patterns, setPatterns] = useState<LearningPattern | null>(null);
  const [comparativeData, setComparativeData] = useState<any>(null);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'analytics' | 'reflections' | 'export'>('overview');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [selectedGoalTemplate, setSelectedGoalTemplate] = useState<GoalTemplate | null>(null);

  useEffect(() => {
    // Generate insights and patterns
    const newInsights = generateInsights(userData.entries, userData.breathingSessions, userData.currentStreak);
    const newPatterns = analyzeLearningPatterns(userData.entries);
    const newComparativeData = getComparativeData(userData.entries, 'week');
    const newHeatmapData = generateHeatmapData(userData.entries);
    
    setInsights(newInsights);
    setPatterns(newPatterns);
    setComparativeData(newComparativeData);
    setHeatmapData(newHeatmapData);
  }, [userData]);

  const handleCreateGoal = (template: GoalTemplate) => {
    const newGoal = createGoalFromTemplate(template, 'user-1');
    const progress = calculateGoalProgress(newGoal, userData);
    newGoal.progress = progress;
    newGoal.current = Math.round((progress / 100) * newGoal.target);
    
    setGoals(prev => [...prev, newGoal]);
    setShowGoalModal(false);
    setSelectedGoalTemplate(null);
  };

  const handleCompleteReflection = (reflection: ReflectionEntry) => {
    const insights = generateReflectionInsights(reflection, userData);
    reflection.insights = insights;
    reflection.completed = true;
    
    setReflections(prev => [...prev, reflection]);
    setShowReflectionModal(false);
  };

  const handleExportData = (format: 'json' | 'csv') => {
    const options = {
      format,
      includeData: {
        entries: true,
        breathingSessions: true,
        reflections: true,
        goals: true,
        badges: true,
        insights: true
      },
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      },
      privacyLevel: 'personal' as const
    };

    const exportData = format === 'json' 
      ? exportDataAsJSON(userData, options)
      : exportDataAsCSV(userData, options);

    // Create and download file
    const blob = new Blob([exportData], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learning-data-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const suggestedGoals = getSuggestedGoals(userData, goals);
  const reflectionStats = getReflectionStats(reflections);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                ← Back to BrightBuddy
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">BrightBuddy Analytics</h1>
            </div>
            <div className="text-sm text-gray-500">
              Deep insights & personal growth tracking
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'goals', name: 'Goals', icon: '🎯' },
            { id: 'analytics', name: 'Analytics', icon: '📈' },
            { id: 'reflections', name: 'Reflections', icon: '🤔' },
            { id: 'export', name: 'Export', icon: '📤' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📝</div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{userData.entries.length}</div>
                    <div className="text-sm text-gray-600">Total Entries</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{goals.length}</div>
                    <div className="text-sm text-gray-600">Active Goals</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🤔</div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{reflectionStats.total}</div>
                    <div className="text-sm text-gray-600">Reflections</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{insights.length}</div>
                    <div className="text-sm text-gray-600">Insights</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insights.slice(0, 4).map(insight => (
                  <div key={insight.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{insight.type === 'pattern' ? '📊' : insight.type === 'achievement' ? '🏆' : '💡'}</div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{insight.title}</h3>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          Confidence: {insight.confidence}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Patterns */}
            {patterns && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Patterns</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">⏰</div>
                    <h3 className="font-semibold text-gray-800">Best Time</h3>
                    <p className="text-gray-600">{patterns.bestTimeOfDay}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">📅</div>
                    <h3 className="font-semibold text-gray-800">Best Day</h3>
                    <p className="text-gray-600">{patterns.bestDayOfWeek}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">📚</div>
                    <h3 className="font-semibold text-gray-800">Top Subject</h3>
                    <p className="text-gray-600">{patterns.mostProductiveSubject}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            {/* Goals Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Learning Goals</h2>
              <button
                onClick={() => setShowGoalModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              >
                + Add Goal
              </button>
            </div>

            {/* Active Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map(goal => (
                <div key={goal.id} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">{getCategoryIcon(goal.category)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getDifficultyColor(goal.difficulty)} transition-all duration-1000`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(goal.difficulty)} text-white`}>
                      {goal.difficulty}
                    </span>
                    <span className="text-gray-500">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Goals */}
            {suggestedGoals.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Suggested Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suggestedGoals.map(template => (
                    <div 
                      key={template.id}
                      className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                      onClick={() => handleCreateGoal(template)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">{template.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{template.title}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(template.difficulty)} text-white`}>
                          {template.difficulty}
                        </span>
                        <span className="text-sm text-gray-500">
                          Target: {template.target}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Advanced Analytics</h2>
            
            {/* Comparative Analysis */}
            {comparativeData && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">This Week vs Last Week</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      {comparativeData.currentPeriod.entries}
                    </div>
                    <div className="text-sm text-gray-600">Entries</div>
                    <div className={`text-xs ${comparativeData.improvements.entries >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {comparativeData.improvements.entries >= 0 ? '+' : ''}{comparativeData.improvements.entries}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      {comparativeData.currentPeriod.averageMood}/5
                    </div>
                    <div className="text-sm text-gray-600">Avg Mood</div>
                    <div className={`text-xs ${comparativeData.improvements.mood >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {comparativeData.improvements.mood >= 0 ? '+' : ''}{comparativeData.improvements.mood}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      {comparativeData.currentPeriod.averageStress}/5
                    </div>
                    <div className="text-sm text-gray-600">Avg Stress</div>
                    <div className={`text-xs ${comparativeData.improvements.stress >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {comparativeData.improvements.stress >= 0 ? '+' : ''}{comparativeData.improvements.stress}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mood by Subject */}
            {patterns && Object.keys(patterns.moodSubjectCorrelation).length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Mood by Subject</h3>
                <div className="space-y-4">
                  {Object.entries(patterns.moodSubjectCorrelation)
                    .sort(([,a], [,b]) => b - a)
                    .map(([subject, mood]) => (
                      <div key={subject} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">📚</div>
                          <span className="font-medium text-gray-800">{subject}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-800">{mood}/5</div>
                          <div className="text-sm text-gray-600">Average Mood</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Learning Heatmap */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Learning Activity Heatmap</h3>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                {['Morning', 'Afternoon', 'Evening'].map(timeSlot => (
                  <React.Fragment key={timeSlot}>
                    <div className="text-sm font-medium text-gray-600 py-2">{timeSlot}</div>
                    {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                      const data = heatmapData.find(d => d.day === dayIndex && d.time === (timeSlot === 'Morning' ? 0 : timeSlot === 'Afternoon' ? 1 : 2));
                      const intensity = data ? Math.min(data.value * 20, 100) : 0;
                      return (
                        <div
                          key={`${dayIndex}-${timeSlot}`}
                          className="h-8 rounded border border-gray-200 flex items-center justify-center text-xs"
                          style={{
                            backgroundColor: intensity > 0 ? `rgba(59, 130, 246, ${intensity / 100})` : 'transparent',
                            color: intensity > 50 ? 'white' : 'inherit'
                          }}
                        >
                          {data?.value || 0}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reflections' && (
          <div className="space-y-6">
            {/* Reflections Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Reflections</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const reflection = createReflectionEntry('weekly', 'user-1');
                    setShowReflectionModal(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  Weekly Reflection
                </button>
                <button
                  onClick={() => {
                    const reflection = createReflectionEntry('monthly', 'user-1');
                    setShowReflectionModal(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                >
                  Monthly Reflection
                </button>
              </div>
            </div>

            {/* Reflection Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Reflection Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{reflectionStats.total}</div>
                  <div className="text-sm text-gray-600">Total Reflections</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{reflectionStats.weekly}</div>
                  <div className="text-sm text-gray-600">Weekly</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{reflectionStats.monthly}</div>
                  <div className="text-sm text-gray-600">Monthly</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{reflectionStats.averageMood}/5</div>
                  <div className="text-sm text-gray-600">Avg Mood</div>
                </div>
              </div>
            </div>

            {/* Reflection History */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Reflections</h3>
              {reflections.length > 0 ? (
                <div className="space-y-4">
                  {reflections.slice(0, 5).map(reflection => (
                    <div key={reflection.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-800">{reflection.title}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(reflection.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Key Insights:</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {reflection.insights.slice(0, 3).map((insight, index) => (
                              <li key={index}>• {insight}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Mood:</h5>
                          <div className="text-2xl">{'😊😐😕😢😭'.charAt(reflection.mood - 1)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤔</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No reflections yet</h3>
                  <p className="text-gray-600 mb-4">Start your first reflection to track your learning journey!</p>
                  <button
                    onClick={() => {
                      const reflection = createReflectionEntry('weekly', 'user-1');
                      setShowReflectionModal(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                  >
                    Start Reflection
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Export & Share</h2>
            
            {/* Export Options */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Export Your Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="text-3xl mb-4">📄</div>
                  <h4 className="font-semibold text-gray-800 mb-2">JSON Export</h4>
                  <p className="text-sm text-gray-600 mb-4">Export all your data in JSON format for backup or analysis</p>
                  <button
                    onClick={() => handleExportData('json')}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Export JSON
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="text-3xl mb-4">📊</div>
                  <h4 className="font-semibold text-gray-800 mb-2">CSV Export</h4>
                  <p className="text-sm text-gray-600 mb-4">Export data in CSV format for spreadsheet analysis</p>
                  <button
                    onClick={() => handleExportData('csv')}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Report */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Progress Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{userData.entries.length}</div>
                  <div className="text-sm text-gray-600">Total Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{userData.currentStreak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{goals.filter(g => g.completed).length}</div>
                  <div className="text-sm text-gray-600">Goals Completed</div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    const report = generateProgressReport(userData, 'week', 'personal');
                    const shareText = generateShareableProgress(report);
                    navigator.clipboard.writeText(shareText);
                    alert('Progress summary copied to clipboard!');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Share Progress Summary
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Goal Creation Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create New Goal</h2>
              <button
                onClick={() => setShowGoalModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goalTemplates.map(template => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                  onClick={() => handleCreateGoal(template)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">{template.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{template.title}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(template.difficulty)} text-white`}>
                      {template.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">
                      Target: {template.target}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reflection Modal */}
      {showReflectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Weekly Reflection</h2>
              <button
                onClick={() => setShowReflectionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Take a moment to reflect on your learning journey this week
                </p>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => {
                    const reflection = createReflectionEntry('weekly', 'user-1');
                    handleCompleteReflection(reflection);
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  Start Weekly Reflection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 