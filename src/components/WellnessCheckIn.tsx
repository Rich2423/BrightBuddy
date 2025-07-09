'use client';

import React, { useState } from 'react';
import { getRandomAffirmation } from './WellnessTools';

interface WellnessCheckInProps {
  onComplete: (data: { mood: number; stress: number; energy: number; notes: string }) => void;
  onClose: () => void;
  initialMood?: number;
  initialStress?: number;
}

export default function WellnessCheckIn({ 
  onComplete, 
  onClose, 
  initialMood, 
  initialStress 
}: WellnessCheckInProps) {
  const [mood, setMood] = useState(initialMood || 3);
  const [stress, setStress] = useState(initialStress || 3);
  const [energy, setEnergy] = useState(3);
  const [notes, setNotes] = useState('');
  const [currentStep, setCurrentStep] = useState<'mood' | 'stress' | 'energy' | 'notes' | 'suggestions'>('mood');

  const moodEmojis = ['😢', '😕', '😐', '🙂', '😊'];
  const stressEmojis = ['😰', '😟', '😐', '😌', '😴'];
  const energyEmojis = ['😴', '😪', '😐', '😊', '⚡'];

  const getMoodDescription = (level: number) => {
    switch (level) {
      case 1: return 'Very Low';
      case 2: return 'Low';
      case 3: return 'Okay';
      case 4: return 'Good';
      case 5: return 'Great!';
      default: return 'Okay';
    }
  };

  const getStressDescription = (level: number) => {
    switch (level) {
      case 1: return 'Very Stressed';
      case 2: return 'Stressed';
      case 3: return 'Moderate';
      case 4: return 'Calm';
      case 5: return 'Very Calm';
      default: return 'Moderate';
    }
  };

  const getEnergyDescription = (level: number) => {
    switch (level) {
      case 1: return 'Very Tired';
      case 2: return 'Tired';
      case 3: return 'Okay';
      case 4: return 'Energetic';
      case 5: return 'Very Energetic';
      default: return 'Okay';
    }
  };

  const getCopingSuggestions = () => {
    const suggestions = [];

    if (mood <= 2) {
      suggestions.push({
        icon: '🎨',
        title: 'Creative Activity',
        description: 'Try drawing, coloring, or listening to music'
      });
      suggestions.push({
        icon: '🏃‍♂️',
        title: 'Light Exercise',
        description: 'Take a short walk or do some stretching'
      });
    }

    if (stress >= 4) {
      suggestions.push({
        icon: '🧘',
        title: 'Breathing Exercise',
        description: 'Try a 3-minute breathing session'
      });
      suggestions.push({
        icon: '📖',
        title: 'Reading Break',
        description: 'Read something enjoyable for 10 minutes'
      });
    }

    if (energy <= 2) {
      suggestions.push({
        icon: '💧',
        title: 'Stay Hydrated',
        description: 'Drink some water and take a short break'
      });
      suggestions.push({
        icon: '🍎',
        title: 'Healthy Snack',
        description: 'Have a nutritious snack to boost energy'
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        icon: '✨',
        title: 'Keep Going!',
        description: 'You\'re doing great! Continue with your learning'
      });
    }

    return suggestions;
  };

  const handleNext = () => {
    if (currentStep === 'mood') setCurrentStep('stress');
    else if (currentStep === 'stress') setCurrentStep('energy');
    else if (currentStep === 'energy') setCurrentStep('notes');
    else if (currentStep === 'notes') setCurrentStep('suggestions');
  };

  const handleBack = () => {
    if (currentStep === 'stress') setCurrentStep('mood');
    else if (currentStep === 'energy') setCurrentStep('stress');
    else if (currentStep === 'notes') setCurrentStep('energy');
    else if (currentStep === 'suggestions') setCurrentStep('notes');
  };

  const handleComplete = () => {
    onComplete({ mood, stress, energy, notes });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'mood':
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">How are you feeling today?</h3>
            <div className="flex justify-center gap-4 mb-6">
              {moodEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setMood(index + 1)}
                  className={`text-4xl p-2 rounded-full transition-all duration-200 ${
                    mood === index + 1 
                      ? 'bg-blue-100 ring-4 ring-blue-300 scale-110' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <p className="text-lg font-medium text-gray-700">{getMoodDescription(mood)}</p>
          </div>
        );

      case 'stress':
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">How stressed do you feel?</h3>
            <div className="flex justify-center gap-4 mb-6">
              {stressEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setStress(index + 1)}
                  className={`text-4xl p-2 rounded-full transition-all duration-200 ${
                    stress === index + 1 
                      ? 'bg-purple-100 ring-4 ring-purple-300 scale-110' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <p className="text-lg font-medium text-gray-700">{getStressDescription(stress)}</p>
          </div>
        );

      case 'energy':
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">How's your energy level?</h3>
            <div className="flex justify-center gap-4 mb-6">
              {energyEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setEnergy(index + 1)}
                  className={`text-4xl p-2 rounded-full transition-all duration-200 ${
                    energy === index + 1 
                      ? 'bg-green-100 ring-4 ring-green-300 scale-110' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <p className="text-lg font-medium text-gray-700">{getEnergyDescription(energy)}</p>
          </div>
        );

      case 'notes':
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Any thoughts or feelings?</h3>
            <p className="text-gray-600 mb-4">(Optional - this helps us understand you better)</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling about learning today? What's on your mind?"
              className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>
        );

      case 'suggestions':
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Here are some suggestions for you</h3>
            <div className="space-y-4 mb-6">
              {getCopingSuggestions().map((suggestion, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{suggestion.icon}</div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-800">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Affirmation */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 mb-6">
              <p className="text-lg font-medium text-gray-800 italic">
                "{getRandomAffirmation(undefined, mood, stress).text}"
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Wellness Check-in</h2>
          <p className="text-gray-600">Let's see how you're doing today</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {['mood', 'stress', 'energy', 'notes', 'suggestions'].indexOf(currentStep) + 1} of 5</span>
            <span>{Math.round((['mood', 'stress', 'energy', 'notes', 'suggestions'].indexOf(currentStep) + 1) / 5 * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(['mood', 'stress', 'energy', 'notes', 'suggestions'].indexOf(currentStep) + 1) / 5 * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-center">
          {currentStep !== 'mood' && (
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-all duration-200"
            >
              Back
            </button>
          )}
          
          {currentStep !== 'suggestions' ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
            >
              Complete Check-in
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-6 py-3 bg-red-100 text-red-600 rounded-full font-medium hover:bg-red-200 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 