export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    holdAfterExhale?: number;
  };
  duration: number; // in seconds
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string;
  color: string;
}

export interface Affirmation {
  id: string;
  text: string;
  category: 'learning' | 'stress' | 'confidence' | 'growth' | 'self-compassion';
  moodRange?: number[]; // 1-5 mood levels this affirmation is good for
  stressLevel?: 'high' | 'low' | 'any';
  tags: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'wellness' | 'achievement';
  criteria: {
    type: 'streak' | 'count' | 'mood' | 'stress' | 'breathing' | 'reflection';
    value: number;
    timeframe?: number; // in days
    condition?: 'above' | 'below' | 'equal';
  };
  unlocked: boolean;
  unlockedDate?: number;
  progress: number; // 0-100
}

// Breathing Exercises Database
export const breathingExercises: BreathingExercise[] = [
  {
    id: 'simple-333',
    name: 'Simple 3-3-3',
    description: 'Perfect for beginners and quick stress relief',
    pattern: {
      inhale: 3,
      hold: 3,
      exhale: 3
    },
    duration: 60,
    difficulty: 'easy',
    instructions: 'Breathe in for 3 counts, hold for 3, breathe out for 3',
    color: '#4ade80' // green
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Classic technique for focus and calm',
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfterExhale: 4
    },
    duration: 120,
    difficulty: 'medium',
    instructions: 'Breathe in for 4, hold for 4, breathe out for 4, hold for 4',
    color: '#60a5fa' // blue
  },
  {
    id: 'relaxing-breath',
    name: '4-7-8 Relaxing Breath',
    description: 'Advanced technique for deep relaxation',
    pattern: {
      inhale: 4,
      hold: 7,
      exhale: 8
    },
    duration: 180,
    difficulty: 'hard',
    instructions: 'Breathe in for 4, hold for 7, breathe out for 8',
    color: '#a78bfa' // purple
  },
  {
    id: 'calm-breath',
    name: 'Calm Breathing',
    description: 'Gentle breathing for everyday stress',
    pattern: {
      inhale: 4,
      hold: 2,
      exhale: 6
    },
    duration: 90,
    difficulty: 'easy',
    instructions: 'Breathe in for 4, hold for 2, breathe out for 6',
    color: '#34d399' // emerald
  }
];

// Affirmations Database
export const affirmations: Affirmation[] = [
  // Learning Confidence
  {
    id: 'learning-1',
    text: 'I am capable of learning new things every day',
    category: 'learning',
    moodRange: [1, 2, 3, 4, 5],
    tags: ['confidence', 'growth', 'daily']
  },
  {
    id: 'learning-2',
    text: 'Every mistake teaches me something valuable',
    category: 'learning',
    moodRange: [1, 2, 3],
    stressLevel: 'high',
    tags: ['mistakes', 'growth', 'resilience']
  },
  {
    id: 'learning-3',
    text: 'I am proud of my curiosity and questions',
    category: 'learning',
    moodRange: [3, 4, 5],
    tags: ['curiosity', 'questions', 'pride']
  },
  {
    id: 'learning-4',
    text: 'Learning is a journey, not a destination',
    category: 'learning',
    moodRange: [1, 2, 3, 4, 5],
    tags: ['journey', 'process', 'patience']
  },

  // Stress Management
  {
    id: 'stress-1',
    text: 'It\'s okay to take breaks when I need them',
    category: 'stress',
    moodRange: [1, 2, 3],
    stressLevel: 'high',
    tags: ['breaks', 'self-care', 'permission']
  },
  {
    id: 'stress-2',
    text: 'I can handle challenges one step at a time',
    category: 'stress',
    moodRange: [1, 2, 3],
    stressLevel: 'high',
    tags: ['challenges', 'steps', 'strength']
  },
  {
    id: 'stress-3',
    text: 'Deep breaths help me feel calm and focused',
    category: 'stress',
    moodRange: [1, 2, 3],
    stressLevel: 'high',
    tags: ['breathing', 'calm', 'focus']
  },
  {
    id: 'stress-4',
    text: 'I am stronger than I think',
    category: 'stress',
    moodRange: [1, 2, 3],
    stressLevel: 'high',
    tags: ['strength', 'confidence', 'resilience']
  },

  // Confidence Building
  {
    id: 'confidence-1',
    text: 'I believe in my ability to grow and learn',
    category: 'confidence',
    moodRange: [2, 3, 4, 5],
    tags: ['belief', 'growth', 'ability']
  },
  {
    id: 'confidence-2',
    text: 'My effort matters more than being perfect',
    category: 'confidence',
    moodRange: [1, 2, 3, 4, 5],
    tags: ['effort', 'imperfection', 'value']
  },
  {
    id: 'confidence-3',
    text: 'I am proud of how hard I try',
    category: 'confidence',
    moodRange: [3, 4, 5],
    tags: ['pride', 'effort', 'recognition']
  },
  {
    id: 'confidence-4',
    text: 'Every small step forward counts',
    category: 'confidence',
    moodRange: [1, 2, 3, 4, 5],
    tags: ['progress', 'steps', 'small-wins']
  },

  // Growth Mindset
  {
    id: 'growth-1',
    text: 'Challenges help my brain grow stronger',
    category: 'growth',
    moodRange: [2, 3, 4, 5],
    tags: ['challenges', 'brain', 'growth']
  },
  {
    id: 'growth-2',
    text: 'I can learn anything with practice and patience',
    category: 'growth',
    moodRange: [2, 3, 4, 5],
    tags: ['practice', 'patience', 'learning']
  },
  {
    id: 'growth-3',
    text: 'Today I will learn something new',
    category: 'growth',
    moodRange: [3, 4, 5],
    tags: ['today', 'new', 'learning']
  },

  // Self-Compassion
  {
    id: 'compassion-1',
    text: 'I am kind to myself when learning is hard',
    category: 'self-compassion',
    moodRange: [1, 2, 3],
    stressLevel: 'high',
    tags: ['kindness', 'self-care', 'difficulty']
  },
  {
    id: 'compassion-2',
    text: 'It\'s okay to ask for help when I need it',
    category: 'self-compassion',
    moodRange: [1, 2, 3],
    stressLevel: 'high',
    tags: ['help', 'support', 'okay']
  },
  {
    id: 'compassion-3',
    text: 'I celebrate my progress, no matter how small',
    category: 'self-compassion',
    moodRange: [2, 3, 4, 5],
    tags: ['celebration', 'progress', 'small-wins']
  }
];

// Badge Definitions
export const badgeDefinitions: Omit<Badge, 'unlocked' | 'unlockedDate' | 'progress'>[] = [
  // Learning Consistency Badges
  {
    id: 'streak-3',
    title: 'Getting Started',
    description: 'Maintained a 3-day learning streak',
    icon: '🔥',
    category: 'learning',
    criteria: {
      type: 'streak',
      value: 3,
      condition: 'above'
    }
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintained a 7-day learning streak',
    icon: '🔥🔥',
    category: 'learning',
    criteria: {
      type: 'streak',
      value: 7,
      condition: 'above'
    }
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Maintained a 30-day learning streak',
    icon: '🔥🔥🔥',
    category: 'learning',
    criteria: {
      type: 'streak',
      value: 30,
      condition: 'above'
    }
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Logged an entry every day for a week',
    icon: '⭐',
    category: 'learning',
    criteria: {
      type: 'count',
      value: 7,
      timeframe: 7
    }
  },
  {
    id: 'subject-explorer',
    title: 'Subject Explorer',
    description: 'Tried all available subjects',
    icon: '📚',
    category: 'learning',
    criteria: {
      type: 'count',
      value: 8 // Number of subjects
    }
  },

  // Wellness Badges
  {
    id: 'mindful-learner',
    title: 'Mindful Learner',
    description: 'Used breathing exercises 10 times',
    icon: '🧘',
    category: 'wellness',
    criteria: {
      type: 'breathing',
      value: 10
    }
  },
  {
    id: 'reflection-master',
    title: 'Reflection Master',
    description: 'Wrote 10 detailed journal entries',
    icon: '✍️',
    category: 'wellness',
    criteria: {
      type: 'reflection',
      value: 10
    }
  },
  {
    id: 'stress-manager',
    title: 'Stress Manager',
    description: 'Successfully managed 5 high-stress days',
    icon: '😌',
    category: 'wellness',
    criteria: {
      type: 'stress',
      value: 5,
      condition: 'below'
    }
  },
  {
    id: 'mood-warrior',
    title: 'Mood Warrior',
    description: 'Maintained positive mood for 5 days',
    icon: '😊',
    category: 'wellness',
    criteria: {
      type: 'mood',
      value: 5,
      timeframe: 5,
      condition: 'above'
    }
  },

  // Achievement Badges
  {
    id: 'first-entry',
    title: 'First Steps',
    description: 'Created your first journal entry',
    icon: '🌟',
    category: 'achievement',
    criteria: {
      type: 'count',
      value: 1
    }
  },
  {
    id: 'tenth-entry',
    title: 'Dedicated Learner',
    description: 'Completed 10 journal entries',
    icon: '🎯',
    category: 'achievement',
    criteria: {
      type: 'count',
      value: 10
    }
  },
  {
    id: 'breathing-beginner',
    title: 'Breathing Beginner',
    description: 'Completed your first breathing exercise',
    icon: '🫁',
    category: 'achievement',
    criteria: {
      type: 'breathing',
      value: 1
    }
  }
];

// Helper functions
export const getRandomAffirmation = (
  category?: string,
  mood?: number,
  stress?: number
): Affirmation => {
  let filtered = affirmations;

  if (category) {
    filtered = filtered.filter(a => a.category === category);
  }

  if (mood) {
    filtered = filtered.filter(a => !a.moodRange || a.moodRange.includes(mood));
  }

  if (stress) {
    filtered = filtered.filter(a => {
      if (!a.stressLevel || a.stressLevel === 'any') return true;
      if (a.stressLevel === 'high' && stress >= 4) return true;
      if (a.stressLevel === 'low' && stress <= 2) return true;
      return false;
    });
  }

  if (filtered.length === 0) {
    filtered = affirmations; // Fallback to all affirmations
  }

  return filtered[Math.floor(Math.random() * filtered.length)];
};

export const getBreathingExercise = (difficulty?: string): BreathingExercise => {
  if (difficulty) {
    const filtered = breathingExercises.filter(ex => ex.difficulty === difficulty);
    return filtered[Math.floor(Math.random() * filtered.length)];
  }
  return breathingExercises[Math.floor(Math.random() * breathingExercises.length)];
};

export const calculateBadgeProgress = (
  badge: Omit<Badge, 'unlocked' | 'unlockedDate' | 'progress'>,
  userData: {
    entries: any[];
    breathingSessions: any[];
    currentStreak: number;
  }
): number => {
  const { criteria } = badge;
  let currentValue = 0;

  switch (criteria.type) {
    case 'streak':
      currentValue = userData.currentStreak;
      break;
    case 'count':
      if (criteria.timeframe) {
        // Count entries within timeframe
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - criteria.timeframe);
        currentValue = userData.entries.filter(entry => 
          new Date(entry.date) >= cutoff
        ).length;
      } else {
        currentValue = userData.entries.length;
      }
      break;
    case 'breathing':
      currentValue = userData.breathingSessions.length;
      break;
    case 'reflection':
      // Count entries with detailed notes (more than 50 characters)
      currentValue = userData.entries.filter(entry => 
        entry.learningNote && entry.learningNote.length > 50
      ).length;
      break;
    case 'mood':
      if (criteria.timeframe) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - criteria.timeframe);
        const recentEntries = userData.entries.filter(entry => 
          new Date(entry.date) >= cutoff
        );
        if (criteria.condition === 'above') {
          currentValue = recentEntries.filter(entry => entry.mood >= 4).length;
        }
      }
      break;
    case 'stress':
      if (criteria.condition === 'below') {
        currentValue = userData.entries.filter(entry => entry.stress <= 2).length;
      }
      break;
  }

  return Math.min(100, Math.round((currentValue / criteria.value) * 100));
}; 