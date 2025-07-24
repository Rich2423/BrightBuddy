'use client'

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { achievementSystem, Achievement, UserAchievements } from '../../utils/AchievementSystem';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function AchievementsPage() {
  const { user } = useAuth();
  const [userAchievements, setUserAchievements] = useState<UserAchievements | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (user) {
        const achievements = await achievementSystem.getUserAchievements(user.id);
        setUserAchievements(achievements);
        setLoading(false);
      }
    };
    fetchAchievements();
  }, [user]);

  if (loading || !userAchievements) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-purple-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Achievements & Badges</h1>

          {/* User Level and Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col items-center">
            <div className="text-5xl mb-2">🏅</div>
            <div className="text-xl font-bold text-blue-700 mb-1">Level {userAchievements.level} - {achievementSystem.getLevelTitle(userAchievements.level)}</div>
            <div className="text-sm text-gray-600 mb-2">XP: {userAchievements.experience} / {userAchievements.experienceToNextLevel}</div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((userAchievements.experience / userAchievements.experienceToNextLevel) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {userAchievements.achievements.map((ach) => (
              <div
                key={ach.id}
                className={`rounded-xl p-5 shadow-md border-2 transition-all duration-200 ${ach.unlocked ? 'border-green-400 bg-white' : 'border-gray-200 bg-gray-50 opacity-70'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{ach.icon}</span>
                  <span className={`font-bold text-lg ${ach.unlocked ? 'text-green-700' : 'text-gray-500'}`}>{ach.title}</span>
                </div>
                <div className="text-sm text-gray-700 mb-2">{ach.description}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">{ach.category}</span>
                  {ach.unlocked && ach.unlockedAt && (
                    <span className="text-xs text-green-600">Unlocked: {new Date(ach.unlockedAt).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${ach.unlocked ? 'bg-green-400' : 'bg-blue-300'}`}
                    style={{ width: `${Math.min((ach.progress / ach.maxProgress) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {ach.unlocked
                    ? ach.reward ? `Reward: ${ach.reward.value}` : 'Unlocked'
                    : `Progress: ${ach.progress} / ${ach.maxProgress}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 