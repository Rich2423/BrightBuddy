'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BreathingExercise } from './WellnessTools';

interface BreathingTimerProps {
  exercise: BreathingExercise;
  onComplete: () => void;
  onCancel: () => void;
}

export default function BreathingTimer({ exercise, onComplete, onCancel }: BreathingTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercise.duration);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdAfterExhale'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [breathingCycle, setBreathingCycle] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalPhaseTime = exercise.pattern[currentPhase] || 0;
  const phaseProgress = (phaseTime / totalPhaseTime) * 100;
  const sessionProgress = ((exercise.duration - timeLeft) / exercise.duration) * 100;

  const startSession = () => {
    setIsActive(true);
    setSessionStartTime(Date.now());
    setCurrentPhase('inhale');
    setPhaseTime(0);
    setBreathingCycle(0);
  };

  const pauseSession = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current);
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(exercise.duration);
    setCurrentPhase('inhale');
    setPhaseTime(0);
    setBreathingCycle(0);
    setSessionStartTime(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current);
    }
  };

  // Main timer
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, onComplete]);

  // Breathing phase timer
  useEffect(() => {
    if (isActive) {
      phaseIntervalRef.current = setInterval(() => {
        setPhaseTime(prev => {
          const newTime = prev + 1;
          if (newTime >= totalPhaseTime) {
            // Move to next phase
            const phases: Array<'inhale' | 'hold' | 'exhale' | 'holdAfterExhale'> = ['inhale', 'hold', 'exhale'];
            if (exercise.pattern.holdAfterExhale) {
              phases.push('holdAfterExhale');
            }
            
            const currentIndex = phases.indexOf(currentPhase);
            const nextIndex = (currentIndex + 1) % phases.length;
            const nextPhase = phases[nextIndex];
            
            setCurrentPhase(nextPhase);
            setPhaseTime(0);
            
            if (nextPhase === 'inhale') {
              setBreathingCycle(prev => prev + 1);
            }
            
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (phaseIntervalRef.current) {
        clearInterval(phaseIntervalRef.current);
      }
    };
  }, [isActive, currentPhase, totalPhaseTime, exercise.pattern]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'holdAfterExhale':
        return 'Hold';
      default:
        return '';
    }
  };

  const getBreathingColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return '#4ade80'; // green
      case 'hold':
        return '#fbbf24'; // amber
      case 'exhale':
        return '#60a5fa'; // blue
      case 'holdAfterExhale':
        return '#fbbf24'; // amber
      default:
        return exercise.color;
    }
  };

  const breathingSize = currentPhase === 'inhale' ? 1 + (phaseProgress / 100) * 0.5 : 1.5 - (phaseProgress / 100) * 0.5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{exercise.name}</h2>
          <p className="text-gray-600">{exercise.description}</p>
        </div>

        {/* Breathing Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Background circle */}
            <div 
              className="w-48 h-48 rounded-full border-4 border-gray-200 flex items-center justify-center"
              style={{ backgroundColor: getBreathingColor() + '20' }}
            >
              {/* Breathing circle */}
              <div 
                className="w-32 h-32 rounded-full transition-all duration-1000 ease-in-out flex items-center justify-center text-white font-bold text-xl"
                style={{
                  backgroundColor: getBreathingColor(),
                  transform: `scale(${breathingSize})`,
                }}
              >
                {getPhaseInstruction()}
              </div>
            </div>
            
            {/* Progress ring */}
            <div className="absolute inset-0">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={getBreathingColor()}
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - phaseProgress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-in-out"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-700 mb-2">
            {exercise.instructions}
          </p>
          <p className="text-sm text-gray-500">
            Cycle {breathingCycle + 1} • {getPhaseInstruction()} ({totalPhaseTime - phaseTime}s)
          </p>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {formatTime(timeLeft)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${sessionProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          {!isActive ? (
            <button
              onClick={startSession}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {sessionStartTime ? 'Resume' : 'Start'}
            </button>
          ) : (
            <button
              onClick={pauseSession}
              className="px-8 py-3 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Pause
            </button>
          )}
          
          <button
            onClick={resetSession}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-all duration-200"
          >
            Reset
          </button>
          
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-red-100 text-red-600 rounded-full font-medium hover:bg-red-200 transition-all duration-200"
          >
            Exit
          </button>
        </div>

        {/* Session Info */}
        {sessionStartTime && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Session started at {new Date(sessionStartTime).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
} 