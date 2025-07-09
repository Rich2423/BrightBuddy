export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  type: 'streak' | 'diversity' | 'wellness' | 'emotional' | 'consistency' | 'exploration' | 'custom';
  category: 'consistency' | 'exploration' | 'emotional' | 'wellness' | 'achievement';
  target: number;
  current: number;
  difficulty: 'easy' | 'medium' | 'challenging';
  timeframe: 'daily' | 'weekly' | 'monthly' | 'ongoing';
  startDate: number;
  endDate?: number;
  completed: boolean;
  completedDate?: number;
  progress: number; // 0-100
  streakProtection?: boolean;
  autoSuggest?: boolean;
  userId: string;
}

export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  type: 'streak' | 'diversity' | 'wellness' | 'emotional' | 'consistency' | 'exploration';
  category: 'consistency' | 'exploration' | 'emotional' | 'wellness' | 'achievement';
  target: number;
  difficulty: 'easy' | 'medium' | 'challenging';
  timeframe: 'daily' | 'weekly' | 'monthly' | 'ongoing';
  autoSuggest: boolean;
  icon: string;
  color: string;
}

// Goal Templates Database
export const goalTemplates: GoalTemplate[] = [
  // Consistency Goals
  {
    id: 'streak-7',
    title: '7-Day Learning Streak',
    description: 'Make a journal entry every day for a week',
    type: 'streak',
    category: 'consistency',
    target: 7,
    difficulty: 'easy',
    timeframe: 'weekly',
    autoSuggest: true,
    icon: '🔥',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day learning streak',
    type: 'streak',
    category: 'consistency',
    target: 30,
    difficulty: 'challenging',
    timeframe: 'monthly',
    autoSuggest: true,
    icon: '🔥🔥🔥',
    color: 'from-red-500 to-purple-500'
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Log an entry every day for a week',
    type: 'consistency',
    category: 'consistency',
    target: 7,
    difficulty: 'medium',
    timeframe: 'weekly',
    autoSuggest: true,
    icon: '⭐',
    color: 'from-yellow-500 to-orange-500'
  },

  // Exploration Goals
  {
    id: 'subject-explorer',
    title: 'Subject Explorer',
    description: 'Try learning activities in 5 different subjects',
    type: 'diversity',
    category: 'exploration',
    target: 5,
    difficulty: 'medium',
    timeframe: 'ongoing',
    autoSuggest: true,
    icon: '📚',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'all-subjects',
    title: 'Complete Explorer',
    description: 'Try all available subjects at least once',
    type: 'diversity',
    category: 'exploration',
    target: 8,
    difficulty: 'challenging',
    timeframe: 'ongoing',
    autoSuggest: true,
    icon: '🌍',
    color: 'from-green-500 to-emerald-500'
  },

  // Emotional Goals
  {
    id: 'mood-booster',
    title: 'Mood Booster',
    description: 'Maintain positive mood (4-5) for 5 days',
    type: 'emotional',
    category: 'emotional',
    target: 5,
    difficulty: 'challenging',
    timeframe: 'weekly',
    autoSuggest: true,
    icon: '😊',
    color: 'from-pink-500 to-purple-500'
  },
  {
    id: 'stress-manager',
    title: 'Stress Manager',
    description: 'Keep stress levels low (1-2) for 7 days',
    type: 'emotional',
    category: 'emotional',
    target: 7,
    difficulty: 'challenging',
    timeframe: 'weekly',
    autoSuggest: true,
    icon: '😌',
    color: 'from-indigo-500 to-purple-500'
  },

  // Wellness Goals
  {
    id: 'breathing-habit',
    title: 'Breathing Habit',
    description: 'Use breathing exercises 10 times',
    type: 'wellness',
    category: 'wellness',
    target: 10,
    difficulty: 'medium',
    timeframe: 'ongoing',
    autoSuggest: true,
    icon: '🫁',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'mindful-week',
    title: 'Mindful Week',
    description: 'Complete wellness check-ins 5 days in a row',
    type: 'wellness',
    category: 'wellness',
    target: 5,
    difficulty: 'medium',
    timeframe: 'weekly',
    autoSuggest: true,
    icon: '🧘',
    color: 'from-emerald-500 to-green-500'
  },

  // Achievement Goals
  {
    id: 'first-10',
    title: 'Getting Started',
    description: 'Complete your first 10 journal entries',
    type: 'consistency',
    category: 'achievement',
    target: 10,
    difficulty: 'easy',
    timeframe: 'ongoing',
    autoSuggest: true,
    icon: '🌟',
    color: 'from-yellow-400 to-orange-400'
  },
  {
    id: 'century-club',
    title: 'Century Club',
    description: 'Complete 100 journal entries',
    type: 'consistency',
    category: 'achievement',
    target: 100,
    difficulty: 'challenging',
    timeframe: 'ongoing',
    autoSuggest: true,
    icon: '💯',
    color: 'from-purple-500 to-pink-500'
  }
];

// Helper functions
export const createGoalFromTemplate = (
  template: GoalTemplate, 
  userId: string
): LearningGoal => {
  const now = Date.now();
  const endDate = template.timeframe === 'weekly' 
    ? now + (7 * 24 * 60 * 60 * 1000)
    : template.timeframe === 'monthly'
    ? now + (30 * 24 * 60 * 60 * 1000)
    : undefined;

  return {
    id: `${template.id}-${Date.now()}`,
    title: template.title,
    description: template.description,
    type: template.type,
    category: template.category,
    target: template.target,
    current: 0,
    difficulty: template.difficulty,
    timeframe: template.timeframe,
    startDate: now,
    endDate,
    completed: false,
    progress: 0,
    autoSuggest: template.autoSuggest,
    userId
  };
};

export const calculateGoalProgress = (
  goal: LearningGoal,
  userData: {
    entries: any[];
    breathingSessions: any[];
    currentStreak: number;
  }
): number => {
  let currentValue = 0;

  switch (goal.type) {
    case 'streak':
      currentValue = userData.currentStreak;
      break;
    case 'consistency':
      if (goal.timeframe === 'weekly') {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);
        currentValue = userData.entries.filter(entry => 
          new Date(entry.date) >= cutoff
        ).length;
      } else {
        currentValue = userData.entries.length;
      }
      break;
    case 'diversity':
      const uniqueSubjects = new Set(userData.entries.map(entry => entry.subject));
      currentValue = uniqueSubjects.size;
      break;
    case 'wellness':
      if (goal.title.includes('breathing')) {
        currentValue = userData.breathingSessions.length;
      } else {
        // Wellness check-ins (approximated by entries with detailed notes)
        currentValue = userData.entries.filter(entry => 
          entry.learningNote && entry.learningNote.length > 100
        ).length;
      }
      break;
    case 'emotional':
      if (goal.title.includes('mood')) {
        const recentEntries = userData.entries.slice(-goal.target);
        currentValue = recentEntries.filter(entry => entry.mood >= 4).length;
      } else if (goal.title.includes('stress')) {
        const recentEntries = userData.entries.slice(-goal.target);
        currentValue = recentEntries.filter(entry => entry.stress <= 2).length;
      }
      break;
  }

  return Math.min(100, Math.round((currentValue / goal.target) * 100));
};

export const getSuggestedGoals = (
  userData: {
    entries: any[];
    breathingSessions: any[];
    currentStreak: number;
  },
  existingGoals: LearningGoal[]
): GoalTemplate[] => {
  const existingGoalIds = existingGoals.map(g => g.id.split('-')[0]);
  
  return goalTemplates
    .filter(template => 
      template.autoSuggest && 
      !existingGoalIds.includes(template.id)
    )
    .filter(template => {
      // Filter based on user's current state
      if (template.id === 'streak-7' && userData.currentStreak >= 3) return true;
      if (template.id === 'streak-30' && userData.currentStreak >= 15) return true;
      if (template.id === 'breathing-habit' && userData.breathingSessions.length >= 3) return true;
      if (template.id === 'first-10' && userData.entries.length >= 5) return true;
      if (template.id === 'century-club' && userData.entries.length >= 50) return true;
      
      // Default suggestions for new users
      if (userData.entries.length < 5) {
        return ['streak-7', 'first-10', 'subject-explorer'].includes(template.id);
      }
      
      return true;
    })
    .slice(0, 5); // Limit to 5 suggestions
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'from-green-500 to-emerald-500';
    case 'medium': return 'from-yellow-500 to-orange-500';
    case 'challenging': return 'from-red-500 to-pink-500';
    default: return 'from-gray-500 to-gray-600';
  }
};

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'consistency': return '🔥';
    case 'exploration': return '🌍';
    case 'emotional': return '💝';
    case 'wellness': return '🧘';
    case 'achievement': return '🏆';
    default: return '✨';
  }
}; 