'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { analyticsSystem, UserAnalytics, SubjectAnalytics } from '../../utils/AnalyticsSystem';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [subjectAnalytics, setSubjectAnalytics] = useState<SubjectAnalytics[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (user) {
        try {
          const [analytics, subjects, learningInsights] = await Promise.all([
            analyticsSystem.getUserAnalytics(user.id),
            analyticsSystem.getSubjectAnalytics(user.id),
            analyticsSystem.getLearningInsights(user.id),
          ]);
          
          setUserAnalytics(analytics);
          setSubjectAnalytics(subjects);
          setInsights(learningInsights);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching analytics:', error);
          setLoading(false);
        }
      }
    };
    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!userAnalytics) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Analytics Data</h2>
          <p className="text-gray-600">Complete some activities to see your learning analytics!</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Learning Analytics</h1>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold text-blue-600">{userAnalytics.activitiesCompleted}</p>
                </div>
                <div className="text-3xl">📚</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Time Spent</p>
                  <p className="text-2xl font-bold text-green-600">{userAnalytics.totalTimeSpent}m</p>
                </div>
                <div className="text-3xl">⏱️</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.round(userAnalytics.averageScore)}%</p>
                </div>
                <div className="text-3xl">🎯</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sessions</p>
                  <p className="text-2xl font-bold text-orange-600">{userAnalytics.totalSessions}</p>
                </div>
                <div className="text-3xl">🔥</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Learning Insights */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Learning Insights</h2>
              
              {insights && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Best Time to Learn</h3>
                    <p className="text-blue-700 capitalize">{insights.bestTimeToLearn}</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Recommended Subject</h3>
                    <p className="text-green-700">{insights.recommendedSubject}</p>
                  </div>

                  {insights.improvementAreas.length > 0 && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-yellow-800 mb-2">Areas for Improvement</h3>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        {insights.improvementAreas.map((area: string, index: number) => (
                          <li key={index}>• {area}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {insights.achievements.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">Recent Achievements</h3>
                      <ul className="text-purple-700 text-sm space-y-1">
                        {insights.achievements.map((achievement: string, index: number) => (
                          <li key={index}>🏆 {achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Learning Pattern */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Learning Pattern</h2>
              
              <div className="space-y-3">
                {Object.entries(userAnalytics.learningPattern).map(([time, count]) => (
                  <div key={time} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">{time}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${Math.max((count / Math.max(...Object.values(userAnalytics.learningPattern))) * 100, 5)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subject Performance */}
          {subjectAnalytics.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg mt-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Subject Performance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectAnalytics.map((subject) => (
                  <div key={subject.subject} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{subject.subject}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Activities:</span>
                        <span className="font-medium">{subject.activitiesCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Score:</span>
                        <span className="font-medium">{Math.round(subject.averageScore)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{subject.totalTimeSpent}m</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Device Usage */}
          <div className="bg-white rounded-xl p-6 shadow-lg mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Device Usage</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(userAnalytics.deviceUsage).map(([device, count]) => (
                <div key={device} className="text-center">
                  <div className="text-2xl mb-2">
                    {device === 'desktop' ? '💻' : device === 'mobile' ? '📱' : '📱'}
                  </div>
                  <p className="font-semibold text-gray-800 capitalize">{device}</p>
                  <p className="text-2xl font-bold text-blue-600">{count}</p>
                  <p className="text-sm text-gray-600">sessions</p>
                </div>
              ))}
            </div>
          </div>

          {/* Session Duration */}
          <div className="bg-white rounded-xl p-6 shadow-lg mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Session Duration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <p className="font-semibold text-gray-800">Short</p>
                <p className="text-2xl font-bold text-green-600">{userAnalytics.sessionDuration.short}</p>
                <p className="text-sm text-gray-600">&lt; 5 min</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⏱️</div>
                <p className="font-semibold text-gray-800">Medium</p>
                <p className="text-2xl font-bold text-blue-600">{userAnalytics.sessionDuration.medium}</p>
                <p className="text-sm text-gray-600">5-15 min</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🏃</div>
                <p className="font-semibold text-gray-800">Long</p>
                <p className="text-2xl font-bold text-purple-600">{userAnalytics.sessionDuration.long}</p>
                <p className="text-sm text-gray-600">&gt; 15 min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 