// Analytics System for BrightBuddy
export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  eventData: any;
  timestamp: Date;
  sessionId: string;
}

export interface UserAnalytics {
  userId: string;
  totalSessions: number;
  totalTimeSpent: number; // in minutes
  activitiesCompleted: number;
  subjectsCovered: string[];
  averageScore: number;
  streakDays: number;
  lastActive: Date;
  favoriteSubject: string;
  learningPattern: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  deviceUsage: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  sessionDuration: {
    short: number; // < 5 min
    medium: number; // 5-15 min
    long: number; // > 15 min
  };
}

export interface SubjectAnalytics {
  subject: string;
  activitiesCompleted: number;
  averageScore: number;
  totalTimeSpent: number;
  lastActivity: Date;
  difficultyBreakdown: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
}

export interface AppAnalytics {
  totalUsers: number;
  activeUsers: number; // users active in last 7 days
  totalActivities: number;
  averageSessionDuration: number;
  mostPopularSubject: string;
  conversionRate: number; // free to premium
  retentionRate: number; // users returning after 7 days
}

// Analytics System Class
export class AnalyticsSystem {
  private static instance: AnalyticsSystem;
  
  private constructor() {}
  
  static getInstance(): AnalyticsSystem {
    if (!AnalyticsSystem.instance) {
      AnalyticsSystem.instance = new AnalyticsSystem();
    }
    return AnalyticsSystem.instance;
  }

  // Track an analytics event
  async trackEvent(userId: string, eventType: string, eventData: any = {}): Promise<void> {
    try {
      const sessionId = this.getSessionId();
      const event: AnalyticsEvent = {
        id: Date.now().toString(),
        userId,
        eventType,
        eventData,
        timestamp: new Date(),
        sessionId,
      };

      // Store event in localStorage
      const events = this.getStoredEvents();
      events.push(event);
      this.saveEvents(events);

      // Update user analytics
      await this.updateUserAnalytics(userId, event);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Get user analytics
  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    try {
      const stored = localStorage.getItem(`analytics_user_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }

      // Initialize new user analytics
      const analytics: UserAnalytics = {
        userId,
        totalSessions: 0,
        totalTimeSpent: 0,
        activitiesCompleted: 0,
        subjectsCovered: [],
        averageScore: 0,
        streakDays: 0,
        lastActive: new Date(),
        favoriteSubject: '',
        learningPattern: {
          morning: 0,
          afternoon: 0,
          evening: 0,
          night: 0,
        },
        deviceUsage: {
          desktop: 0,
          mobile: 0,
          tablet: 0,
        },
        sessionDuration: {
          short: 0,
          medium: 0,
          long: 0,
        },
      };

      await this.saveUserAnalytics(analytics);
      return analytics;
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw error;
    }
  }

  // Get subject analytics for a user
  async getSubjectAnalytics(userId: string): Promise<SubjectAnalytics[]> {
    try {
      const stored = localStorage.getItem(`analytics_subjects_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error('Error getting subject analytics:', error);
      return [];
    }
  }

  // Get app-wide analytics
  async getAppAnalytics(): Promise<AppAnalytics> {
    try {
      const stored = localStorage.getItem('analytics_app');
      if (stored) {
        return JSON.parse(stored);
      }

      // Initialize app analytics
      const analytics: AppAnalytics = {
        totalUsers: 0,
        activeUsers: 0,
        totalActivities: 0,
        averageSessionDuration: 0,
        mostPopularSubject: '',
        conversionRate: 0,
        retentionRate: 0,
      };

      await this.saveAppAnalytics(analytics);
      return analytics;
    } catch (error) {
      console.error('Error getting app analytics:', error);
      throw error;
    }
  }

  // Update user analytics based on an event
  private async updateUserAnalytics(userId: string, event: AnalyticsEvent): Promise<void> {
    try {
      const analytics = await this.getUserAnalytics(userId);
      
      // Update last active
      analytics.lastActive = new Date();

      // Update based on event type
      switch (event.eventType) {
        case 'session_start':
          analytics.totalSessions += 1;
          break;

        case 'activity_completed':
          analytics.activitiesCompleted += 1;
          if (event.eventData.subject && !analytics.subjectsCovered.includes(event.eventData.subject)) {
            analytics.subjectsCovered.push(event.eventData.subject);
          }
          if (event.eventData.score) {
            analytics.averageScore = this.calculateNewAverage(analytics.averageScore, analytics.activitiesCompleted, event.eventData.score);
          }
          if (event.eventData.timeSpent) {
            analytics.totalTimeSpent += event.eventData.timeSpent;
          }
          break;

        case 'session_end':
          const sessionDuration = event.eventData.duration || 0;
          if (sessionDuration < 5) {
            analytics.sessionDuration.short += 1;
          } else if (sessionDuration < 15) {
            analytics.sessionDuration.medium += 1;
          } else {
            analytics.sessionDuration.long += 1;
          }
          break;

        case 'page_view':
          // Update learning pattern based on time of day
          const hour = new Date(event.timestamp).getHours();
          if (hour >= 6 && hour < 12) {
            analytics.learningPattern.morning += 1;
          } else if (hour >= 12 && hour < 17) {
            analytics.learningPattern.afternoon += 1;
          } else if (hour >= 17 && hour < 22) {
            analytics.learningPattern.evening += 1;
          } else {
            analytics.learningPattern.night += 1;
          }

          // Update device usage
          const userAgent = navigator.userAgent;
          if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
            if (/iPad/.test(userAgent)) {
              analytics.deviceUsage.tablet += 1;
            } else {
              analytics.deviceUsage.mobile += 1;
            }
          } else {
            analytics.deviceUsage.desktop += 1;
          }
          break;
      }

      // Update favorite subject
      analytics.favoriteSubject = await this.calculateFavoriteSubject(userId);

      await this.saveUserAnalytics(analytics);
    } catch (error) {
      console.error('Error updating user analytics:', error);
    }
  }

  // Calculate new average
  private calculateNewAverage(currentAvg: number, totalCount: number, newValue: number): number {
    return ((currentAvg * (totalCount - 1)) + newValue) / totalCount;
  }

  // Calculate favorite subject
  private async calculateFavoriteSubject(userId: string): Promise<string> {
    try {
      const subjectAnalytics = await this.getSubjectAnalytics(userId);
      if (subjectAnalytics.length === 0) return '';

      return subjectAnalytics.reduce((prev, current) => 
        current.activitiesCompleted > prev.activitiesCompleted ? current : prev
      ).subject;
    } catch (error) {
      console.error('Error calculating favorite subject:', error);
      return '';
    }
  }

  // Get session ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = Date.now().toString();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Get stored events
  private getStoredEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem('analytics_events');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting stored events:', error);
      return [];
    }
  }

  // Save events
  private saveEvents(events: AnalyticsEvent[]): void {
    try {
      // Keep only last 1000 events to prevent localStorage overflow
      const trimmedEvents = events.slice(-1000);
      localStorage.setItem('analytics_events', JSON.stringify(trimmedEvents));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  }

  // Save user analytics
  private async saveUserAnalytics(analytics: UserAnalytics): Promise<void> {
    localStorage.setItem(`analytics_user_${analytics.userId}`, JSON.stringify(analytics));
  }

  // Save app analytics
  private async saveAppAnalytics(analytics: AppAnalytics): Promise<void> {
    localStorage.setItem('analytics_app', JSON.stringify(analytics));
  }

  // Get learning insights for a user
  async getLearningInsights(userId: string): Promise<{
    bestTimeToLearn: string;
    recommendedSubject: string;
    improvementAreas: string[];
    achievements: string[];
  }> {
    try {
      const analytics = await this.getUserAnalytics(userId);
      
      // Find best time to learn
      const learningPattern = analytics.learningPattern;
      const bestTime = Object.entries(learningPattern).reduce((a, b) => 
        learningPattern[a[0] as keyof typeof learningPattern] > learningPattern[b[0] as keyof typeof learningPattern] ? a : b
      )[0];

      // Find recommended subject (least completed)
      const subjectAnalytics = await this.getSubjectAnalytics(userId);
      const recommendedSubject = subjectAnalytics.length > 0 
        ? subjectAnalytics.reduce((prev, current) => 
            current.activitiesCompleted < prev.activitiesCompleted ? current : prev
          ).subject
        : 'Math';

      // Identify improvement areas
      const improvementAreas: string[] = [];
      if (analytics.averageScore < 70) {
        improvementAreas.push('Focus on accuracy and understanding');
      }
      if (analytics.totalTimeSpent < 30) {
        improvementAreas.push('Spend more time on activities');
      }
      if (analytics.subjectsCovered.length < 3) {
        improvementAreas.push('Explore more subjects');
      }

      // Generate achievements
      const achievements: string[] = [];
      if (analytics.activitiesCompleted >= 10) {
        achievements.push('Consistent Learner');
      }
      if (analytics.streakDays >= 7) {
        achievements.push('Week Warrior');
      }
      if (analytics.averageScore >= 90) {
        achievements.push('High Performer');
      }

      return {
        bestTimeToLearn: bestTime,
        recommendedSubject,
        improvementAreas,
        achievements,
      };
    } catch (error) {
      console.error('Error getting learning insights:', error);
      return {
        bestTimeToLearn: 'morning',
        recommendedSubject: 'Math',
        improvementAreas: [],
        achievements: [],
      };
    }
  }

  // Export analytics data (for admin purposes)
  async exportAnalytics(userId?: string): Promise<any> {
    try {
      if (userId) {
        const userAnalytics = await this.getUserAnalytics(userId);
        const subjectAnalytics = await this.getSubjectAnalytics(userId);
        const insights = await this.getLearningInsights(userId);
        
        return {
          userAnalytics,
          subjectAnalytics,
          insights,
          exportDate: new Date().toISOString(),
        };
      } else {
        const appAnalytics = await this.getAppAnalytics();
        const events = this.getStoredEvents();
        
        return {
          appAnalytics,
          events: events.slice(-100), // Last 100 events
          exportDate: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error('Error exporting analytics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const analyticsSystem = AnalyticsSystem.getInstance(); 