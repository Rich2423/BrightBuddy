'use client';

import React, { useState, useEffect } from 'react';
import { Affirmation, getRandomAffirmation } from './WellnessTools';

interface AffirmationsDisplayProps {
  category?: string;
  mood?: number;
  stress?: number;
  onClose?: () => void;
  autoRotate?: boolean;
}

export default function AffirmationsDisplay({ 
  category, 
  mood, 
  stress, 
  onClose, 
  autoRotate = true 
}: AffirmationsDisplayProps) {
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [rotationInterval, setRotationInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Get initial affirmation
    const affirmation = getRandomAffirmation(category, mood, stress);
    setCurrentAffirmation(affirmation);
    setIsVisible(true);

    // Set up auto-rotation if enabled
    if (autoRotate) {
      const interval = setInterval(() => {
        const newAffirmation = getRandomAffirmation(category, mood, stress);
        setCurrentAffirmation(newAffirmation);
      }, 8000); // Change every 8 seconds

      setRotationInterval(interval);
    }

    return () => {
      if (rotationInterval) {
        clearInterval(rotationInterval);
      }
    };
  }, [category, mood, stress, autoRotate]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning':
        return 'from-blue-500 to-cyan-500';
      case 'stress':
        return 'from-purple-500 to-pink-500';
      case 'confidence':
        return 'from-green-500 to-emerald-500';
      case 'growth':
        return 'from-orange-500 to-red-500';
      case 'self-compassion':
        return 'from-indigo-500 to-purple-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning':
        return '📚';
      case 'stress':
        return '😌';
      case 'confidence':
        return '💪';
      case 'growth':
        return '🌱';
      case 'self-compassion':
        return '💝';
      default:
        return '✨';
    }
  };

  const handleNextAffirmation = () => {
    const newAffirmation = getRandomAffirmation(category, mood, stress);
    setCurrentAffirmation(newAffirmation);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  if (!currentAffirmation) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className={`bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">
            {getCategoryIcon(currentAffirmation.category)}
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Daily Affirmation
          </h2>
          <div className="flex justify-center gap-2">
            {currentAffirmation.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Affirmation Text */}
        <div className="text-center mb-8">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20"></div>
            
            {/* Main affirmation */}
            <div className="relative z-10">
              <p className="text-2xl font-medium text-gray-800 leading-relaxed mb-4">
                "{currentAffirmation.text}"
              </p>
              
              {/* Category indicator */}
              <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${getCategoryColor(currentAffirmation.category)} text-white text-sm font-medium`}>
                {currentAffirmation.category.replace('-', ' ').toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleNextAffirmation}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span>✨</span>
            Another One
          </button>
          
          {onClose && (
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-all duration-200"
            >
              Close
            </button>
          )}
        </div>

        {/* Auto-rotation indicator */}
        {autoRotate && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>New affirmation every 8 seconds</span>
            </div>
          </div>
        )}

        {/* Mood/Stress context */}
        {(mood || stress) && (
          <div className="mt-4 text-center text-xs text-gray-400">
            {mood && <span>Mood: {mood}/5 • </span>}
            {stress && <span>Stress: {stress}/5</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// Standalone affirmation card for embedding in other components
export function AffirmationCard({ 
  affirmation, 
  compact = false 
}: { 
  affirmation: Affirmation; 
  compact?: boolean;
}) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning':
        return 'from-blue-500 to-cyan-500';
      case 'stress':
        return 'from-purple-500 to-pink-500';
      case 'confidence':
        return 'from-green-500 to-emerald-500';
      case 'growth':
        return 'from-orange-500 to-red-500';
      case 'self-compassion':
        return 'from-indigo-500 to-purple-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning':
        return '📚';
      case 'stress':
        return '😌';
      case 'confidence':
        return '💪';
      case 'growth':
        return '🌱';
      case 'self-compassion':
        return '💝';
      default:
        return '✨';
    }
  };

  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gradient-to-b from-blue-500 to-purple-500">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{getCategoryIcon(affirmation.category)}</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800 mb-1">
              {affirmation.text}
            </p>
            <div className="flex gap-1">
              {affirmation.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="text-center">
        <div className="text-3xl mb-3">{getCategoryIcon(affirmation.category)}</div>
        <p className="text-lg font-medium text-gray-800 mb-3">
          "{affirmation.text}"
        </p>
        <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(affirmation.category)} text-white text-xs font-medium`}>
          {affirmation.category.replace('-', ' ').toUpperCase()}
        </div>
      </div>
    </div>
  );
} 