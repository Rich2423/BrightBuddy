'use client';

import React, { useState, useEffect } from 'react';
import { Badge, badgeDefinitions, calculateBadgeProgress } from './WellnessTools';

interface BadgeSystemProps {
  userData: {
    entries: any[];
    breathingSessions: any[];
    currentStreak: number;
  };
  onBadgeUnlocked?: (badge: Badge) => void;
}

export default function BadgeSystem({ userData, onBadgeUnlocked }: BadgeSystemProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    // Initialize badges with progress
    const initializedBadges = badgeDefinitions.map(badgeDef => {
      const progress = calculateBadgeProgress(badgeDef, userData);
      const unlocked = progress >= 100;
      
      return {
        ...badgeDef,
        unlocked,
        unlockedDate: unlocked ? Date.now() : undefined,
        progress
      };
    });

    setBadges(initializedBadges);

    // Check for newly unlocked badges
    const newlyUnlocked = initializedBadges.filter(badge => 
      badge.unlocked && !badges.find(existing => existing.id === badge.id && existing.unlocked)
    );

    if (newlyUnlocked.length > 0) {
      setUnlockedBadge(newlyUnlocked[0]);
      setShowUnlockAnimation(true);
      onBadgeUnlocked?.(newlyUnlocked[0]);
    }
  }, [userData, onBadgeUnlocked]);

  const categories = [
    { id: 'all', name: 'All Badges', icon: '🏆' },
    { id: 'learning', name: 'Learning', icon: '📚' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' },
    { id: 'achievement', name: 'Achievement', icon: '⭐' }
  ];

  const filteredBadges = badges.filter(badge => 
    selectedCategory === 'all' || badge.category === selectedCategory
  );

  const unlockedCount = badges.filter(badge => badge.unlocked).length;
  const totalCount = badges.length;

  const handleCloseUnlockAnimation = () => {
    setShowUnlockAnimation(false);
    setUnlockedBadge(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Achievement Badges</h2>
        <p className="text-gray-600 mb-4">
          Track your learning and wellness progress
        </p>
        
        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold">{unlockedCount}/{totalCount}</div>
              <div className="text-blue-100">Badges Unlocked</div>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 justify-center">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map(badge => (
          <BadgeCard 
            key={badge.id} 
            badge={badge} 
            userData={userData}
            isNewlyUnlocked={unlockedBadge?.id === badge.id}
          />
        ))}
      </div>

      {/* Unlock Animation */}
      {showUnlockAnimation && unlockedBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center animate-bounce">
            <div className="text-6xl mb-4 animate-pulse">🎉</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Badge Unlocked!
            </h3>
            <div className="text-4xl mb-4">{unlockedBadge.icon}</div>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">
              {unlockedBadge.title}
            </h4>
            <p className="text-gray-600 mb-6">
              {unlockedBadge.description}
            </p>
            <button
              onClick={handleCloseUnlockAnimation}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
            >
              Awesome! 🎊
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Individual Badge Card Component
function BadgeCard({ badge, userData, isNewlyUnlocked }: { 
  badge: Badge; 
  userData: { entries: any[]; breathingSessions: any[]; currentStreak: number; };
  isNewlyUnlocked?: boolean; 
}) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning':
        return 'from-blue-500 to-cyan-500';
      case 'wellness':
        return 'from-green-500 to-emerald-500';
      case 'achievement':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'from-green-500 to-emerald-500';
    if (progress >= 75) return 'from-blue-500 to-cyan-500';
    if (progress >= 50) return 'from-yellow-500 to-orange-500';
    if (progress >= 25) return 'from-red-500 to-pink-500';
    return 'from-gray-400 to-gray-500';
  };

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl ${
        badge.unlocked 
          ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' 
          : 'border-gray-100'
      } ${isNewlyUnlocked ? 'animate-pulse ring-4 ring-yellow-400' : ''}`}
    >
      {/* Badge Icon */}
      <div className="text-center mb-4">
        <div className={`text-5xl mb-2 ${badge.unlocked ? 'animate-bounce' : 'opacity-50'}`}>
          {badge.icon}
        </div>
        
        {/* Unlock Status */}
        {badge.unlocked && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
        )}
      </div>

      {/* Badge Info */}
      <div className="text-center mb-4">
        <h3 className={`text-lg font-bold mb-2 ${
          badge.unlocked ? 'text-gray-800' : 'text-gray-600'
        }`}>
          {badge.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {badge.description}
        </p>
        
        {/* Category */}
        <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(badge.category)} text-white text-xs font-medium`}>
          {badge.category.toUpperCase()}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{badge.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(badge.progress)} transition-all duration-1000`}
            style={{ width: `${badge.progress}%` }}
          ></div>
        </div>
        
        {/* Progress Details */}
        <div className="text-xs text-gray-500 text-center">
          {badge.unlocked ? (
            <div className="text-green-600 font-medium">
              ✓ Unlocked {badge.unlockedDate && new Date(badge.unlockedDate).toLocaleDateString()}
            </div>
          ) : (
            <div>
              {badge.criteria.type === 'streak' && `${userData?.currentStreak || 0}/${badge.criteria.value} days`}
              {badge.criteria.type === 'count' && `${userData?.entries?.length || 0}/${badge.criteria.value} entries`}
              {badge.criteria.type === 'breathing' && `${userData?.breathingSessions?.length || 0}/${badge.criteria.value} sessions`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact Badge Display for Dashboard
export function BadgeSummary({ userData }: { userData: any }) {
  const [recentBadges, setRecentBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const badges = badgeDefinitions.map(badgeDef => {
      const progress = calculateBadgeProgress(badgeDef, userData);
      return {
        ...badgeDef,
        unlocked: progress >= 100,
        progress
      };
    });

    const unlocked = badges.filter(badge => badge.unlocked);
    setRecentBadges(unlocked.slice(-3)); // Show last 3 unlocked badges
  }, [userData]);

  if (recentBadges.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Achievements</h3>
        <p className="text-gray-500 text-sm">Complete activities to earn your first badges!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Achievements</h3>
      <div className="space-y-3">
        {recentBadges.map(badge => (
          <div key={badge.id} className="flex items-center gap-3">
            <div className="text-2xl">{badge.icon}</div>
            <div className="flex-1">
              <div className="font-medium text-gray-800 text-sm">{badge.title}</div>
              <div className="text-xs text-gray-500">{badge.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 