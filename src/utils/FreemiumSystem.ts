// Freemium System - Core Architecture
export interface UserSubscription {
  id: string;
  userId: string;
  tier: 'free' | 'premium';
  status: 'active' | 'inactive' | 'cancelled' | 'trial';
  startDate: Date;
  endDate?: Date;
  trialEndDate?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface DailyActivityUsage {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  activitiesCompleted: number;
  subjectsCovered: string[];
  totalTimeSpent: number; // in minutes
  lastActivityAt: Date;
}

export interface LearningActivity {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'quiz' | 'exercise' | 'challenge' | 'game' | 'reflection';
  content: any; // Activity-specific content
  isPremium: boolean;
  estimatedTime: number; // in minutes
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  activityId: string;
  completedAt: Date;
  score?: number; // 0-100
  timeSpent: number; // in minutes
  answers?: any; // User's answers/performance data
  feedback?: string;
}

// Freemium Configuration
export const FREEMIUM_CONFIG = {
  FREE_TIER: {
    dailyActivityLimit: 3,
    maxSubjects: 8, // All subjects available
    analyticsLevel: 'basic',
    supportLevel: 'community',
  },
  PREMIUM_TIER: {
    dailyActivityLimit: -1, // Unlimited
    maxSubjects: -1, // All subjects
    analyticsLevel: 'advanced',
    supportLevel: 'priority',
    price: 9.99,
    currency: 'USD',
  },
  TRIAL: {
    durationDays: 7,
    activitiesPerDay: 5,
  },
} as const;

// Core Freemium System Class
export class FreemiumSystem {
  private static instance: FreemiumSystem;
  
  private constructor() {}
  
  static getInstance(): FreemiumSystem {
    if (!FreemiumSystem.instance) {
      FreemiumSystem.instance = new FreemiumSystem();
    }
    return FreemiumSystem.instance;
  }

  // Check if user can perform an activity
  async canPerformActivity(userId: string): Promise<{
    canPerform: boolean;
    reason?: string;
    remainingActivities?: number;
    subscription?: UserSubscription;
  }> {
    try {
      const subscription = await this.getUserSubscription(userId);
      const todayUsage = await this.getTodayUsage(userId);
      
      if (subscription.tier === 'premium' && subscription.status === 'active') {
        return {
          canPerform: true,
          subscription,
        };
      }
      
      if (subscription.tier === 'free') {
        const remaining = FREEMIUM_CONFIG.FREE_TIER.dailyActivityLimit - todayUsage.activitiesCompleted;
        
        if (remaining > 0) {
          return {
            canPerform: true,
            remainingActivities: remaining,
            subscription,
          };
        } else {
          return {
            canPerform: false,
            reason: 'daily_limit_reached',
            remainingActivities: 0,
            subscription,
          };
        }
      }
      
      return {
        canPerform: false,
        reason: 'subscription_inactive',
        subscription,
      };
    } catch (error) {
      console.error('Error checking activity permission:', error);
      return {
        canPerform: false,
        reason: 'error',
      };
    }
  }

  // Record activity completion
  async recordActivityCompletion(
    userId: string,
    activityId: string,
    score?: number,
    timeSpent?: number,
    answers?: any
  ): Promise<boolean> {
    try {
      const canPerform = await this.canPerformActivity(userId);
      
      if (!canPerform.canPerform) {
        throw new Error(`Cannot perform activity: ${canPerform.reason}`);
      }
      
      // Record progress
      const progress: UserProgress = {
        id: Date.now().toString(),
        userId,
        activityId,
        completedAt: new Date(),
        score,
        timeSpent: timeSpent || 0,
        answers,
      };
      
      await this.saveUserProgress(progress);
      
      // Update daily usage
      await this.updateDailyUsage(userId, activityId);
      
      // Check achievements (import dynamically to avoid circular dependency)
      try {
        const { achievementSystem } = await import('./AchievementSystem');
        const activity = await this.getActivity(activityId);
        
        const result = await achievementSystem.checkAchievements(userId, {
          type: 'activity_completed',
          subject: activity?.subject,
          score: score
        });
        
        // Trigger notifications for newly unlocked achievements
        if (result.newlyUnlocked.length > 0) {
          // Import notification system dynamically
          const { useNotifications } = await import('../components/NotificationSystem');
          
          // Note: In a real implementation, you'd need to pass the notification functions
          // through the component tree or use a global event system
          // For now, we'll store the achievements to be shown on the next page load
          localStorage.setItem(`pending_notifications_${userId}`, JSON.stringify({
            achievements: result.newlyUnlocked,
            timestamp: new Date().toISOString()
          }));
        }
      } catch (error) {
        console.error('Error checking achievements:', error);
      }
      
      // Track analytics event
      try {
        const { analyticsSystem } = await import('./AnalyticsSystem');
        const activityData = await this.getActivity(activityId);
        await analyticsSystem.trackEvent(userId, 'activity_completed', {
          activityId,
          subject: activityData?.subject,
          score,
          timeSpent,
          difficulty: activityData?.difficulty,
          type: activityData?.type
        });
      } catch (error) {
        console.error('Error tracking analytics:', error);
      }
      
      return true;
    } catch (error) {
      console.error('Error recording activity completion:', error);
      return false;
    }
  }

  // Get user's subscription status
  async getUserSubscription(userId: string): Promise<UserSubscription> {
    try {
      const stored = localStorage.getItem(`subscription_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Default to free tier
      const defaultSubscription: UserSubscription = {
        id: Date.now().toString(),
        userId,
        tier: 'free',
        status: 'active',
        startDate: new Date(),
      };
      
      await this.saveUserSubscription(defaultSubscription);
      return defaultSubscription;
    } catch (error) {
      console.error('Error getting user subscription:', error);
      throw error;
    }
  }

  // Get today's usage
  async getTodayUsage(userId: string): Promise<DailyActivityUsage> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const stored = localStorage.getItem(`daily_usage_${userId}_${today}`);
      
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Default empty usage for today
      const defaultUsage: DailyActivityUsage = {
        id: Date.now().toString(),
        userId,
        date: today,
        activitiesCompleted: 0,
        subjectsCovered: [],
        totalTimeSpent: 0,
        lastActivityAt: new Date(),
      };
      
      await this.saveDailyUsage(defaultUsage);
      return defaultUsage;
    } catch (error) {
      console.error('Error getting today usage:', error);
      throw error;
    }
  }

  // Update daily usage
  private async updateDailyUsage(userId: string, activityId: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const usage = await this.getTodayUsage(userId);
      
      usage.activitiesCompleted += 1;
      usage.lastActivityAt = new Date();
      
      // Get activity details to update subjects covered
      const activity = await this.getActivity(activityId);
      if (activity && !usage.subjectsCovered.includes(activity.subject)) {
        usage.subjectsCovered.push(activity.subject);
      }
      
      await this.saveDailyUsage(usage);
    } catch (error) {
      console.error('Error updating daily usage:', error);
    }
  }

  // Save user subscription
  private async saveUserSubscription(subscription: UserSubscription): Promise<void> {
    localStorage.setItem(`subscription_${subscription.userId}`, JSON.stringify(subscription));
  }

  // Save daily usage
  private async saveDailyUsage(usage: DailyActivityUsage): Promise<void> {
    localStorage.setItem(`daily_usage_${usage.userId}_${usage.date}`, JSON.stringify(usage));
  }

  // Save user progress
  private async saveUserProgress(progress: UserProgress): Promise<void> {
    const key = `progress_${progress.userId}_${progress.activityId}`;
    localStorage.setItem(key, JSON.stringify(progress));
  }

  // Get activity details
  private async getActivity(activityId: string): Promise<LearningActivity | null> {
    try {
      const stored = localStorage.getItem(`activity_${activityId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting activity:', error);
      return null;
    }
  }

  // Upgrade user to premium
  async upgradeToPremium(userId: string, stripeCustomerId?: string, stripeSubscriptionId?: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      subscription.tier = 'premium';
      subscription.status = 'active';
      subscription.stripeCustomerId = stripeCustomerId;
      subscription.stripeSubscriptionId = stripeSubscriptionId;
      
      await this.saveUserSubscription(subscription);
      return true;
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      return false;
    }
  }

  // Downgrade user to free
  async downgradeToFree(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      subscription.tier = 'free';
      subscription.status = 'active';
      subscription.endDate = new Date();
      
      await this.saveUserSubscription(subscription);
      return true;
    } catch (error) {
      console.error('Error downgrading to free:', error);
      return false;
    }
  }

  // Get user's activity history
  async getUserActivityHistory(userId: string, limit: number = 50): Promise<UserProgress[]> {
    try {
      const keys = Object.keys(localStorage);
      const progressKeys = keys.filter(key => key.startsWith(`progress_${userId}_`));
      
      const progress: UserProgress[] = [];
      for (const key of progressKeys.slice(0, limit)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          progress.push(JSON.parse(stored));
        }
      }
      
      return progress.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    } catch (error) {
      console.error('Error getting user activity history:', error);
      return [];
    }
  }

  // Get user's weekly/monthly stats
  async getUserStats(userId: string, period: 'week' | 'month' = 'week'): Promise<{
    totalActivities: number;
    totalTimeSpent: number;
    subjectsCovered: string[];
    averageScore: number;
    streakDays: number;
  }> {
    try {
      const history = await this.getUserActivityHistory(userId, 1000);
      const now = new Date();
      const periodStart = new Date();
      
      if (period === 'week') {
        periodStart.setDate(now.getDate() - 7);
      } else {
        periodStart.setMonth(now.getMonth() - 1);
      }
      
      const periodActivities = history.filter(activity => 
        new Date(activity.completedAt) >= periodStart
      );
      
      const totalActivities = periodActivities.length;
      const totalTimeSpent = periodActivities.reduce((sum, activity) => sum + activity.timeSpent, 0);
      const subjectsCovered = [...new Set(periodActivities.map(activity => activity.activityId))]; // Simplified
      const averageScore = periodActivities.length > 0 
        ? periodActivities.reduce((sum, activity) => sum + (activity.score || 0), 0) / periodActivities.length 
        : 0;
      
      // Calculate streak (simplified)
      const streakDays = this.calculateStreakDays(periodActivities);
      
      return {
        totalActivities,
        totalTimeSpent,
        subjectsCovered,
        averageScore: Math.round(averageScore),
        streakDays,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalActivities: 0,
        totalTimeSpent: 0,
        subjectsCovered: [],
        averageScore: 0,
        streakDays: 0,
      };
    }
  }

  // Calculate streak days
  private calculateStreakDays(activities: UserProgress[]): number {
    if (activities.length === 0) return 0;
    
    const sortedActivities = activities.sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 30; i++) { // Check last 30 days max
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasActivity = sortedActivities.some(activity => 
        new Date(activity.completedAt).toISOString().split('T')[0] === dateStr
      );
      
      if (hasActivity) {
        streak++;
      } else {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }
}

// Export singleton instance
export const freemiumSystem = FreemiumSystem.getInstance(); 