'use client'

import React, { useState, useEffect } from 'react';
import { Achievement } from '../utils/AchievementSystem';

interface Notification {
  id: string;
  type: 'achievement' | 'level-up';
  title: string;
  message: string;
  icon: string;
  color: string;
  timestamp: Date;
}

interface NotificationSystemProps {
  children: React.ReactNode;
}

export const NotificationContext = React.createContext<{
  showAchievementNotification: (achievement: Achievement) => void;
  showLevelUpNotification: (level: number, title: string) => void;
}>({
  showAchievementNotification: () => {},
  showLevelUpNotification: () => {},
});

export function NotificationProvider({ children }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showAchievementNotification = (achievement: Achievement) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: `${achievement.title} - ${achievement.description}`,
      icon: achievement.icon,
      color: 'bg-green-500',
      timestamp: new Date(),
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const showLevelUpNotification = (level: number, title: string) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'level-up',
      title: 'Level Up!',
      message: `Congratulations! You've reached Level ${level} - ${title}`,
      icon: '⭐',
      color: 'bg-purple-500',
      timestamp: new Date(),
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after 6 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 6000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{
      showAchievementNotification,
      showLevelUpNotification,
    }}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onRemove={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

interface NotificationToastProps {
  notification: Notification;
  onRemove: () => void;
}

function NotificationToast({ notification, onRemove }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Animate in
    setIsVisible(true);
    setIsAnimating(true);
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onRemove, 300);
    }, 100);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isAnimating ? 'translate-x-0 scale-100' : 'translate-x-full scale-95'}
        ${notification.color} text-white rounded-lg shadow-lg p-4 max-w-sm
        border-l-4 border-white/20
      `}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl animate-bounce">
          {notification.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm mb-1">
            {notification.title}
          </h3>
          <p className="text-xs opacity-90 leading-relaxed">
            {notification.message}
          </p>
          <div className="text-xs opacity-75 mt-1">
            {notification.timestamp.toLocaleTimeString()}
          </div>
        </div>
        
        <button
          onClick={handleRemove}
          className="text-white/70 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-white/20 rounded-full h-1">
        <div
          className="bg-white h-1 rounded-full transition-all duration-5000 ease-linear"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

// Hook to use notifications
export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 