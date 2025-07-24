import { useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNotifications } from './NotificationSystem';
import { Achievement } from '../utils/AchievementSystem';

export function usePendingNotifications() {
  const { user } = useAuth();
  const { showAchievementNotification, showLevelUpNotification } = useNotifications();

  useEffect(() => {
    if (!user) return;

    const checkPendingNotifications = () => {
      try {
        const pendingKey = `pending_notifications_${user.id}`;
        const pendingData = localStorage.getItem(pendingKey);
        
        if (pendingData) {
          const { achievements, timestamp } = JSON.parse(pendingData);
          
          // Show notifications for each unlocked achievement
          achievements.forEach((achievement: Achievement) => {
            showAchievementNotification(achievement);
          });
          
          // Clear the pending notifications
          localStorage.removeItem(pendingKey);
        }
      } catch (error) {
        console.error('Error checking pending notifications:', error);
      }
    };

    // Check immediately
    checkPendingNotifications();

    // Also check when the window gains focus (user returns to tab)
    const handleFocus = () => {
      checkPendingNotifications();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, showAchievementNotification, showLevelUpNotification]);
} 