'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../utils/AuthContext'
import { freemiumSystem, FREEMIUM_CONFIG } from '../../utils/FreemiumSystem'
import { LearningActivity, UserProgress } from '../../utils/FreemiumSystem'
import { activityManager } from '../../utils/ActivityDatabase'
import ActivityPlayer from '../../components/ActivityPlayer'
import ProtectedRoute from '../../components/ProtectedRoute'

export default function ActivitiesPage() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<LearningActivity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<LearningActivity[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedActivity, setSelectedActivity] = useState<LearningActivity | null>(null)
  const [dailyUsage, setDailyUsage] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const subjects = ['all', 'Math', 'Science', 'Reading', 'Writing', 'History', 'Art', 'Music', 'Physical Education', 'Critical Thinking', 'Technology']
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']

  useEffect(() => {
    const initializePage = async () => {
      if (user) {
        // Load activities
        const allActivities = activityManager.getAllActivities()
        setActivities(allActivities)
        setFilteredActivities(allActivities)

        // Load user data
        const userSubscription = await freemiumSystem.getUserSubscription(user.id)
        const todayUsage = await freemiumSystem.getTodayUsage(user.id)
        
        setSubscription(userSubscription)
        setDailyUsage(todayUsage)
        setLoading(false)
      }
    }

    initializePage()
  }, [user])

  useEffect(() => {
    let filtered = activities

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(activity => activity.subject === selectedSubject)
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(activity => activity.difficulty === selectedDifficulty)
    }

    setFilteredActivities(filtered)
  }, [selectedSubject, selectedDifficulty, activities])

  const handleActivityClick = async (activity: LearningActivity) => {
    if (!user) return

    // Check if user can perform activity
    const permission = await freemiumSystem.canPerformActivity(user.id)
    
    if (!permission.canPerform) {
      setShowUpgradeModal(true)
      return
    }

    setSelectedActivity(activity)
  }

  const handleActivityComplete = async (progress: UserProgress) => {
    // Refresh daily usage
    if (user) {
      const updatedUsage = await freemiumSystem.getTodayUsage(user.id)
      setDailyUsage(updatedUsage)
    }
    
    setSelectedActivity(null)
  }

  const handleCloseActivity = () => {
    setSelectedActivity(null)
  }

  const getSubjectIcon = (subject: string) => {
    const icons: { [key: string]: string } = {
      'Math': '🔢',
      'Science': '🔬',
      'Reading': '📚',
      'Writing': '✍️',
      'History': '🏛️',
      'Art': '🎨',
      'Music': '🎵',
      'Physical Education': '🏃',
      'Critical Thinking': '🧠',
      'Technology': '💻'
    }
    return icons[subject] || '📖'
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800'
  }

  const getActivityTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'quiz': '❓',
      'exercise': '📝',
      'challenge': '🏆',
      'game': '🎮',
      'reflection': '🤔'
    }
    return icons[type] || '📋'
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Learning Activities</h1>
                <p className="text-gray-600">Choose from hundreds of educational activities</p>
              </div>
              
              {/* Daily Usage Display */}
              {dailyUsage && (
                <div className="text-right">
                  <div className="text-sm text-gray-600">Today's Progress</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {dailyUsage.activitiesCompleted}/{FREEMIUM_CONFIG.FREE_TIER.dailyActivityLimit}
                  </div>
                  <div className="text-xs text-gray-500">Activities Completed</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map(activity => (
              <div
                key={activity.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                onClick={() => handleActivityClick(activity)}
              >
                <div className="p-6">
                  {/* Activity Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getSubjectIcon(activity.subject)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                        <p className="text-sm text-gray-600">{activity.subject}</p>
                      </div>
                    </div>
                    
                    {/* Premium Badge */}
                    {activity.isPremium && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        ⭐ Premium
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {activity.description}
                  </p>

                  {/* Activity Details */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <span>{getActivityTypeIcon(activity.type)}</span>
                      <span className="capitalize">{activity.type}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(activity.difficulty)}`}>
                      {activity.difficulty}
                    </span>
                  </div>

                  {/* Time Estimate */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      ⏱️ ~{activity.estimatedTime} min
                    </span>
                    
                    {/* Start Button */}
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Start
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No activities found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more activities.</p>
            </div>
          )}
        </div>

        {/* Activity Player Modal */}
        {selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <ActivityPlayer
                activity={selectedActivity}
                onComplete={handleActivityComplete}
                onClose={handleCloseActivity}
              />
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Daily Limit Reached</h2>
                <p className="text-gray-600 mb-6">
                  You've completed your {FREEMIUM_CONFIG.FREE_TIER.dailyActivityLimit} free activities for today.
                  Upgrade to Premium for unlimited learning!
                </p>
                
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 mb-6 text-white">
                  <h3 className="font-semibold mb-2">Premium Features:</h3>
                  <ul className="text-sm space-y-1">
                    <li>✨ Unlimited daily activities</li>
                    <li>📊 Advanced analytics</li>
                    <li>🎯 Premium content</li>
                    <li>🚀 Priority support</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={() => {
                      setShowUpgradeModal(false)
                      // TODO: Navigate to upgrade page
                      console.log('Navigate to upgrade page')
                    }}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
                  >
                    Upgrade to Premium - ${FREEMIUM_CONFIG.PREMIUM_TIER.price}/month
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
} 