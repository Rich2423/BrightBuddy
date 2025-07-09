'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  breathingExercises, 
  getBreathingExercise, 
  getRandomAffirmation,
  badgeDefinitions,
  calculateBadgeProgress 
} from '../../components/WellnessTools';
import BreathingTimer from '../../components/BreathingTimer';
import AffirmationsDisplay from '../../components/AffirmationsDisplay';
import WellnessCheckIn from '../../components/WellnessCheckIn';
import BadgeSystem, { BadgeSummary } from '../../components/BadgeSystem';

// Sample user data - in a real app, this would come from a database
const sampleUserData = {
  entries: [
    { date: new Date(Date.now() - 86400000), mood: 4, stress: 2, learningNote: 'Learned about fractions today. It was challenging but I kept trying!' },
    { date: new Date(Date.now() - 172800000), mood: 3, stress: 3, learningNote: 'Science experiment was fun. Made a volcano!' },
    { date: new Date(Date.now() - 259200000), mood: 5, stress: 1, learningNote: 'Reading time was amazing. Finished my book!' },
  ],
  breathingSessions: [
    { date: new Date(Date.now() - 3600000), duration: 60, exercise: 'simple-333' },
    { date: new Date(Date.now() - 86400000), duration: 120, exercise: 'box-breathing' },
  ],
  currentStreak: 3
};

export default function WellnessPage() {
  const [userData, setUserData] = useState(sampleUserData);
  const [showBreathingTimer, setShowBreathingTimer] = useState(false);
  const [showAffirmations, setShowAffirmations] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(breathingExercises[0]);
  const [currentAffirmation, setCurrentAffirmation] = useState(getRandomAffirmation());
  const [wellnessStats, setWellnessStats] = useState({
    totalBreathingSessions: 0,
    averageMood: 0,
    averageStress: 0,
    checkInsThisWeek: 0
  });

  useEffect(() => {
    // Calculate wellness stats
    const totalBreathingSessions = userData.breathingSessions.length;
    const averageMood = userData.entries.length > 0 
      ? userData.entries.reduce((sum, entry) => sum + entry.mood, 0) / userData.entries.length 
      : 0;
    const averageStress = userData.entries.length > 0 
      ? userData.entries.reduce((sum, entry) => sum + entry.stress, 0) / userData.entries.length 
      : 0;
    
    setWellnessStats({
      totalBreathingSessions,
      averageMood: Math.round(averageMood * 10) / 10,
      averageStress: Math.round(averageStress * 10) / 10,
      checkInsThisWeek: userData.entries.filter(entry => 
        new Date(entry.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
    });
  }, [userData]);

  const handleBreathingComplete = () => {
    setShowBreathingTimer(false);
    // Add breathing session to user data
    setUserData(prev => ({
      ...prev,
      breathingSessions: [...prev.breathingSessions, {
        date: new Date(),
        duration: selectedExercise.duration,
        exercise: selectedExercise.id
      }]
    }));
    
    // Show affirmation after breathing
    setTimeout(() => {
      setCurrentAffirmation(getRandomAffirmation('stress'));
      setShowAffirmations(true);
    }, 1000);
  };

  const handleCheckInComplete = (data: any) => {
    setShowCheckIn(false);
    // Add check-in to user data
    setUserData(prev => ({
      ...prev,
      entries: [...prev.entries, {
        date: new Date(),
        mood: data.mood,
        stress: data.stress,
        energy: data.energy,
        learningNote: data.notes
      }]
    }));
  };

  const handleBadgeUnlocked = (badge: any) => {
    console.log('Badge unlocked:', badge.title);
    // Could show a celebration animation here
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 4) return '😊';
    if (mood >= 3) return '🙂';
    if (mood >= 2) return '😐';
    return '😕';
  };

  const getStressEmoji = (stress: number) => {
    if (stress <= 2) return '😌';
    if (stress <= 3) return '😐';
    if (stress <= 4) return '😟';
    return '😰';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Wellness Center</h1>
            </div>
            <div className="text-sm text-gray-500">
              Your mindful learning companion
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wellness Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🧘</div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{wellnessStats.totalBreathingSessions}</div>
                <div className="text-sm text-gray-600">Breathing Sessions</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getMoodEmoji(wellnessStats.averageMood)}</div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{wellnessStats.averageMood}</div>
                <div className="text-sm text-gray-600">Average Mood</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getStressEmoji(wellnessStats.averageStress)}</div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{wellnessStats.averageStress}</div>
                <div className="text-sm text-gray-600">Average Stress</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📊</div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{wellnessStats.checkInsThisWeek}</div>
                <div className="text-sm text-gray-600">Check-ins This Week</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Wellness Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Breathing Exercises */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🫁</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Breathing Exercises</h2>
              <p className="text-gray-600">Take a moment to breathe and find your calm</p>
            </div>
            
            <div className="space-y-4 mb-6">
              {breathingExercises.map(exercise => (
                <div 
                  key={exercise.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    setSelectedExercise(exercise);
                    setShowBreathingTimer(true);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: exercise.color }}
                    >
                      {exercise.pattern.inhale}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{exercise.name}</h3>
                      <p className="text-sm text-gray-600">{exercise.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">
                      {Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{exercise.difficulty}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => {
                setSelectedExercise(getBreathingExercise());
                setShowBreathingTimer(true);
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
            >
              Start Random Exercise
            </button>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Daily Affirmation */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">✨</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Affirmation</h2>
                <p className="text-gray-600">A positive thought for your learning journey</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
                <p className="text-lg font-medium text-gray-800 italic text-center">
                  "{currentAffirmation.text}"
                </p>
              </div>
              
              <button
                onClick={() => setShowAffirmations(true)}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
              >
                Get More Affirmations
              </button>
            </div>

            {/* Wellness Check-in */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Wellness Check-in</h2>
                <p className="text-gray-600">How are you feeling today?</p>
              </div>
              
              <button
                onClick={() => setShowCheckIn(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Start Check-in
              </button>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Achievements</h2>
            <p className="text-gray-600">Track your wellness and learning progress</p>
          </div>
          
          <BadgeSummary userData={userData} />
          
          <div className="text-center mt-6">
            <button
              onClick={() => setShowBadges(true)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
            >
              View All Badges
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBreathingTimer && (
        <BreathingTimer
          exercise={selectedExercise}
          onComplete={handleBreathingComplete}
          onCancel={() => setShowBreathingTimer(false)}
        />
      )}

      {showAffirmations && (
        <AffirmationsDisplay
          onClose={() => setShowAffirmations(false)}
          autoRotate={true}
        />
      )}

      {showCheckIn && (
        <WellnessCheckIn
          onComplete={handleCheckInComplete}
          onClose={() => setShowCheckIn(false)}
        />
      )}

      {showBadges && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Achievement Badges</h2>
              <button
                onClick={() => setShowBadges(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <BadgeSystem 
              userData={userData} 
              onBadgeUnlocked={handleBadgeUnlocked}
            />
          </div>
        </div>
      )}
    </div>
  );
} 