// Achievement System for BrightBuddy
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'subject' | 'premium' | 'special';
  requirement: {
    type: 'activities_completed' | 'streak_days' | 'subject_mastery' | 'premium_upgrade' | 'perfect_score';
    value: number;
    subject?: string;
  };
  reward?: {
    type: 'badge' | 'title' | 'unlock' | 'bonus';
    value: string;
  };
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface UserAchievements {
  userId: string;
  achievements: Achievement[];
  totalPoints: number;
  level: number;
  experience: number;
  experienceToNextLevel: number;
}

// Achievement definitions
export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress' | 'maxProgress'>[] = [
  // Learning Achievements
  {
    id: 'first_activity',
    title: 'First Steps',
    description: 'Complete your first learning activity',
    icon: '🎯',
    category: 'learning',
    requirement: { type: 'activities_completed', value: 1 },
    reward: { type: 'badge', value: 'Beginner Learner' }
  },
  {
    id: 'activity_master',
    title: 'Activity Master',
    description: 'Complete 50 learning activities',
    icon: '🏆',
    category: 'learning',
    requirement: { type: 'activities_completed', value: 50 },
    reward: { type: 'title', value: 'Learning Champion' }
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Complete 100 learning activities',
    icon: '💎',
    category: 'learning',
    requirement: { type: 'activities_completed', value: 100 },
    reward: { type: 'badge', value: 'Century Master' }
  },

  // Streak Achievements
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', value: 7 },
    reward: { type: 'badge', value: 'Consistent Learner' }
  },
  {
    id: 'month_master',
    title: 'Month Master',
    description: 'Maintain a 30-day learning streak',
    icon: '⭐',
    category: 'streak',
    requirement: { type: 'streak_days', value: 30 },
    reward: { type: 'title', value: 'Dedicated Scholar' }
  },
  {
    id: 'streak_legend',
    title: 'Streak Legend',
    description: 'Maintain a 100-day learning streak',
    icon: '👑',
    category: 'streak',
    requirement: { type: 'streak_days', value: 100 },
    reward: { type: 'badge', value: 'Legendary Learner' }
  },

  // Subject Mastery Achievements
  {
    id: 'math_whiz',
    title: 'Math Whiz',
    description: 'Complete 10 math activities',
    icon: '🔢',
    category: 'subject',
    requirement: { type: 'subject_mastery', value: 10, subject: 'Math' },
    reward: { type: 'badge', value: 'Math Expert' }
  },
  {
    id: 'science_explorer',
    title: 'Science Explorer',
    description: 'Complete 10 science activities',
    icon: '🔬',
    category: 'subject',
    requirement: { type: 'subject_mastery', value: 10, subject: 'Science' },
    reward: { type: 'badge', value: 'Science Explorer' }
  },
  {
    id: 'bookworm',
    title: 'Bookworm',
    description: 'Complete 10 reading activities',
    icon: '📚',
    category: 'subject',
    requirement: { type: 'subject_mastery', value: 10, subject: 'Reading' },
    reward: { type: 'badge', value: 'Avid Reader' }
  },
  {
    id: 'creative_writer',
    title: 'Creative Writer',
    description: 'Complete 10 writing activities',
    icon: '✍️',
    category: 'subject',
    requirement: { type: 'subject_mastery', value: 10, subject: 'Writing' },
    reward: { type: 'badge', value: 'Creative Writer' }
  },
  {
    id: 'history_buff',
    title: 'History Buff',
    description: 'Complete 10 history activities',
    icon: '🏛️',
    category: 'subject',
    requirement: { type: 'subject_mastery', value: 10, subject: 'History' },
    reward: { type: 'badge', value: 'History Enthusiast' }
  },
  {
    id: 'art_enthusiast',
    title: 'Art Enthusiast',
    description: 'Complete 10 art activities',
    icon: '🎨',
    category: 'subject',
    requirement: { type: 'subject_mastery', value: 10, subject: 'Art' },
    reward: { type: 'badge', value: 'Art Lover' }
  },
  {
    id: 'music_maestro',
    title: 'Music Maestro',
    description: 'Complete 10 music activities',
    icon: '🎵',
    category: 'subject',
    requirement: { type: 'subject_mastery', value: 10, subject: 'Music' },
    reward: { type: 'badge', value: 'Music Maestro' }
  },
  {
    id: 'fitness_fanatic',
    title: 'Fitness Fanatic',
    description: 'Complete 10 physical education activities',
    icon: '🏃',
    category: 'subject',
    requirement: { type: 'subject_mastery', value: 10, subject: 'Physical Education' },
    reward: { type: 'badge', value: 'Fitness Enthusiast' }
  },

  // Premium Achievements
  {
    id: 'premium_upgrade',
    title: 'Premium Member',
    description: 'Upgrade to premium subscription',
    icon: '⭐',
    category: 'premium',
    requirement: { type: 'premium_upgrade', value: 1 },
    reward: { type: 'badge', value: 'Premium Learner' }
  },

  // Special Achievements
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Get a perfect score on any activity',
    icon: '🎯',
    category: 'special',
    requirement: { type: 'perfect_score', value: 1 },
    reward: { type: 'badge', value: 'Perfect Performer' }
  },
  {
    id: 'speed_reader',
    title: 'Speed Reader',
    description: 'Complete a speed reading activity',
    icon: '⚡',
    category: 'special',
    requirement: { type: 'activities_completed', value: 1 },
    reward: { type: 'badge', value: 'Speed Reader' }
  },
  {
    id: 'logic_master',
    title: 'Logic Master',
    description: 'Complete a logic puzzle activity',
    icon: '🧠',
    category: 'special',
    requirement: { type: 'activities_completed', value: 1 },
    reward: { type: 'badge', value: 'Logic Master' }
  }
];

// Experience and Leveling System
export const EXPERIENCE_LEVELS = [
  { level: 1, experience: 0, title: 'Novice Learner' },
  { level: 2, experience: 100, title: 'Curious Explorer' },
  { level: 3, experience: 250, title: 'Dedicated Student' },
  { level: 4, experience: 500, title: 'Knowledge Seeker' },
  { level: 5, experience: 1000, title: 'Learning Enthusiast' },
  { level: 6, experience: 2000, title: 'Academic Achiever' },
  { level: 7, experience: 3500, title: 'Knowledge Master' },
  { level: 8, experience: 5000, title: 'Learning Legend' },
  { level: 9, experience: 7500, title: 'Educational Expert' },
  { level: 10, experience: 10000, title: 'BrightBuddy Master' }
];

// Achievement System Class
export class AchievementSystem {
  private static instance: AchievementSystem;
  
  private constructor() {}
  
  static getInstance(): AchievementSystem {
    if (!AchievementSystem.instance) {
      AchievementSystem.instance = new AchievementSystem();
    }
    return AchievementSystem.instance;
  }

  // Get user achievements
  async getUserAchievements(userId: string): Promise<UserAchievements> {
    try {
      const stored = localStorage.getItem(`achievements_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Initialize new user achievements
      const userAchievements: UserAchievements = {
        userId,
        achievements: ACHIEVEMENTS.map(achievement => ({
          ...achievement,
          unlocked: false,
          progress: 0,
          maxProgress: achievement.requirement.value
        })),
        totalPoints: 0,
        level: 1,
        experience: 0,
        experienceToNextLevel: 100
      };
      
      await this.saveUserAchievements(userAchievements);
      return userAchievements;
    } catch (error) {
      console.error('Error getting user achievements:', error);
      throw error;
    }
  }

  // Check and update achievements
  async checkAchievements(userId: string, action: {
    type: string;
    value?: number;
    subject?: string;
    score?: number;
  }): Promise<{
    newlyUnlocked: Achievement[];
    updatedAchievements: UserAchievements;
  }> {
    try {
      const userAchievements = await this.getUserAchievements(userId);
      const newlyUnlocked: Achievement[] = [];
      
      // Update progress for relevant achievements
      for (const achievement of userAchievements.achievements) {
        if (achievement.unlocked) continue;
        
        let shouldUpdate = false;
        
        switch (achievement.requirement.type) {
          case 'activities_completed':
            if (action.type === 'activity_completed') {
              achievement.progress += 1;
              shouldUpdate = true;
            }
            break;
            
          case 'streak_days':
            if (action.type === 'streak_updated' && action.value) {
              achievement.progress = Math.max(achievement.progress, action.value);
              shouldUpdate = true;
            }
            break;
            
          case 'subject_mastery':
            if (action.type === 'activity_completed' && action.subject === achievement.requirement.subject) {
              achievement.progress += 1;
              shouldUpdate = true;
            }
            break;
            
          case 'premium_upgrade':
            if (action.type === 'premium_upgrade') {
              achievement.progress = 1;
              shouldUpdate = true;
            }
            break;
            
          case 'perfect_score':
            if (action.type === 'activity_completed' && action.score === 100) {
              achievement.progress = 1;
              shouldUpdate = true;
            }
            break;
        }
        
        // Check if achievement is unlocked
        if (shouldUpdate && achievement.progress >= achievement.maxProgress) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date();
          newlyUnlocked.push(achievement);
          
          // Award experience points
          const experienceGained = this.getAchievementExperience(achievement);
          userAchievements.experience += experienceGained;
          userAchievements.totalPoints += experienceGained;
          
          // Check for level up
          const newLevel = this.calculateLevel(userAchievements.experience);
          if (newLevel > userAchievements.level) {
            userAchievements.level = newLevel;
            userAchievements.experienceToNextLevel = this.getExperienceToNextLevel(newLevel);
          }
        }
      }
      
      await this.saveUserAchievements(userAchievements);
      
      return {
        newlyUnlocked,
        updatedAchievements: userAchievements
      };
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  }

  // Get experience points for achievement
  private getAchievementExperience(achievement: Achievement): number {
    switch (achievement.category) {
      case 'learning':
        return 50;
      case 'streak':
        return 100;
      case 'subject':
        return 75;
      case 'premium':
        return 200;
      case 'special':
        return 150;
      default:
        return 50;
    }
  }

  // Calculate level from experience
  private calculateLevel(experience: number): number {
    for (let i = EXPERIENCE_LEVELS.length - 1; i >= 0; i--) {
      if (experience >= EXPERIENCE_LEVELS[i].experience) {
        return EXPERIENCE_LEVELS[i].level;
      }
    }
    return 1;
  }

  // Get experience needed for next level
  private getExperienceToNextLevel(level: number): number {
    const nextLevel = EXPERIENCE_LEVELS.find(l => l.level === level + 1);
    return nextLevel ? nextLevel.experience : 0;
  }

  // Get level title
  getLevelTitle(level: number): string {
    const levelData = EXPERIENCE_LEVELS.find(l => l.level === level);
    return levelData ? levelData.title : 'Novice Learner';
  }

  // Save user achievements
  private async saveUserAchievements(userAchievements: UserAchievements): Promise<void> {
    localStorage.setItem(`achievements_${userAchievements.userId}`, JSON.stringify(userAchievements));
  }

  // Get achievement progress percentage
  getAchievementProgress(achievement: Achievement): number {
    return Math.min((achievement.progress / achievement.maxProgress) * 100, 100);
  }

  // Get recently unlocked achievements
  async getRecentAchievements(userId: string, limit: number = 5): Promise<Achievement[]> {
    try {
      const userAchievements = await this.getUserAchievements(userId);
      return userAchievements.achievements
        .filter(a => a.unlocked && a.unlockedAt)
        .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recent achievements:', error);
      return [];
    }
  }

  // Get achievements by category
  async getAchievementsByCategory(userId: string, category: string): Promise<Achievement[]> {
    try {
      const userAchievements = await this.getUserAchievements(userId);
      return userAchievements.achievements.filter(a => a.category === category);
    } catch (error) {
      console.error('Error getting achievements by category:', error);
      return [];
    }
  }

  // Get unlocked achievements count
  async getUnlockedCount(userId: string): Promise<number> {
    try {
      const userAchievements = await this.getUserAchievements(userId);
      return userAchievements.achievements.filter(a => a.unlocked).length;
    } catch (error) {
      console.error('Error getting unlocked count:', error);
      return 0;
    }
  }

  // Get total achievements count
  getTotalAchievementsCount(): number {
    return ACHIEVEMENTS.length;
  }
}

// Export singleton instance
export const achievementSystem = AchievementSystem.getInstance(); 