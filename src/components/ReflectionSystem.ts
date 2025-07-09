export interface ReflectionEntry {
  id: string;
  type: 'weekly' | 'monthly' | 'custom';
  title: string;
  date: number;
  responses: ReflectionResponse[];
  insights: string[];
  mood: number;
  completed: boolean;
  userId: string;
}

export interface ReflectionResponse {
  questionId: string;
  question: string;
  answer: string;
  category: 'learning' | 'wellness' | 'goals' | 'general';
}

export interface ReflectionPrompt {
  id: string;
  question: string;
  category: 'learning' | 'wellness' | 'goals' | 'general';
  type: 'weekly' | 'monthly' | 'custom';
  followUp?: string;
  icon: string;
}

// Reflection Prompts Database
export const reflectionPrompts: ReflectionPrompt[] = [
  // Weekly Learning Prompts
  {
    id: 'weekly-win',
    question: 'What was your biggest learning win this week?',
    category: 'learning',
    type: 'weekly',
    followUp: 'What made this achievement special?',
    icon: '🏆'
  },
  {
    id: 'weekly-challenge',
    question: 'What challenged you most in your learning this week?',
    category: 'learning',
    type: 'weekly',
    followUp: 'How did you handle this challenge?',
    icon: '🧩'
  },
  {
    id: 'weekly-discovery',
    question: 'What new thing did you discover or learn this week?',
    category: 'learning',
    type: 'weekly',
    followUp: 'What surprised you about this discovery?',
    icon: '🔍'
  },
  {
    id: 'weekly-favorite',
    question: 'What was your favorite learning activity this week?',
    category: 'learning',
    type: 'weekly',
    followUp: 'Why did you enjoy it so much?',
    icon: '❤️'
  },

  // Weekly Wellness Prompts
  {
    id: 'weekly-stress',
    question: 'How did you handle stress this week?',
    category: 'wellness',
    type: 'weekly',
    followUp: 'What helped you feel better when stressed?',
    icon: '😌'
  },
  {
    id: 'weekly-mood',
    question: 'How was your overall mood this week?',
    category: 'wellness',
    type: 'weekly',
    followUp: 'What influenced your mood the most?',
    icon: '😊'
  },
  {
    id: 'weekly-breaks',
    question: 'Did you take enough breaks and rest this week?',
    category: 'wellness',
    type: 'weekly',
    followUp: 'How can you improve your rest routine?',
    icon: '😴'
  },

  // Weekly Goal Prompts
  {
    id: 'weekly-goals',
    question: 'How did you progress toward your learning goals this week?',
    category: 'goals',
    type: 'weekly',
    followUp: 'What goals would you like to focus on next week?',
    icon: '🎯'
  },
  {
    id: 'weekly-obstacles',
    question: 'What obstacles got in the way of your learning this week?',
    category: 'goals',
    type: 'weekly',
    followUp: 'How can you overcome these obstacles next week?',
    icon: '🚧'
  },

  // Weekly General Prompts
  {
    id: 'weekly-gratitude',
    question: 'What are you grateful for in your learning journey this week?',
    category: 'general',
    type: 'weekly',
    followUp: 'How does gratitude help your learning?',
    icon: '🙏'
  },
  {
    id: 'weekly-support',
    question: 'Who supported your learning this week?',
    category: 'general',
    type: 'weekly',
    followUp: 'How did their support help you?',
    icon: '🤝'
  },

  // Monthly Learning Prompts
  {
    id: 'monthly-growth',
    question: 'How have you grown as a learner this month?',
    category: 'learning',
    type: 'monthly',
    followUp: 'What skills or knowledge are you most proud of?',
    icon: '🌱'
  },
  {
    id: 'monthly-patterns',
    question: 'What learning patterns have you noticed this month?',
    category: 'learning',
    type: 'monthly',
    followUp: 'How can you use these patterns to improve?',
    icon: '📊'
  },
  {
    id: 'monthly-subjects',
    question: 'Which subjects did you explore most this month?',
    category: 'learning',
    type: 'monthly',
    followUp: 'What drew you to these subjects?',
    icon: '📚'
  },

  // Monthly Wellness Prompts
  {
    id: 'monthly-wellness',
    question: 'How has your overall wellness changed this month?',
    category: 'wellness',
    type: 'monthly',
    followUp: 'What wellness practices worked best for you?',
    icon: '🧘'
  },
  {
    id: 'monthly-balance',
    question: 'How well did you balance learning and rest this month?',
    category: 'wellness',
    type: 'monthly',
    followUp: 'What can you do to improve this balance?',
    icon: '⚖️'
  },

  // Monthly Goal Prompts
  {
    id: 'monthly-achievements',
    question: 'What are your biggest learning achievements this month?',
    category: 'goals',
    type: 'monthly',
    followUp: 'How did you celebrate these achievements?',
    icon: '🎉'
  },
  {
    id: 'monthly-next',
    question: 'What would you like to focus on learning next month?',
    category: 'goals',
    type: 'monthly',
    followUp: 'What steps will you take to achieve this?',
    icon: '🚀'
  }
];

// Weekly Reflection Template
export const getWeeklyReflectionTemplate = (): ReflectionPrompt[] => {
  return reflectionPrompts.filter(prompt => prompt.type === 'weekly');
};

// Monthly Reflection Template
export const getMonthlyReflectionTemplate = (): ReflectionPrompt[] => {
  return reflectionPrompts.filter(prompt => prompt.type === 'monthly');
};

// Custom Reflection Template
export const getCustomReflectionTemplate = (categories: string[]): ReflectionPrompt[] => {
  return reflectionPrompts.filter(prompt => 
    categories.includes(prompt.category) || categories.includes('all')
  );
};

// Helper functions
export const createReflectionEntry = (
  type: 'weekly' | 'monthly' | 'custom',
  userId: string,
  title?: string
): ReflectionEntry => {
  const prompts = type === 'weekly' 
    ? getWeeklyReflectionTemplate()
    : type === 'monthly'
    ? getMonthlyReflectionTemplate()
    : getCustomReflectionTemplate(['learning', 'wellness']);

  const defaultTitle = type === 'weekly' 
    ? `Weekly Reflection - ${new Date().toLocaleDateString()}`
    : type === 'monthly'
    ? `Monthly Reflection - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    : 'Custom Reflection';

  return {
    id: `reflection-${Date.now()}`,
    type,
    title: title || defaultTitle,
    date: Date.now(),
    responses: prompts.map(prompt => ({
      questionId: prompt.id,
      question: prompt.question,
      answer: '',
      category: prompt.category
    })),
    insights: [],
    mood: 3,
    completed: false,
    userId
  };
};

export const generateReflectionInsights = (
  reflection: ReflectionEntry,
  userData: {
    entries: any[];
    breathingSessions: any[];
    currentStreak: number;
  }
): string[] => {
  const insights: string[] = [];
  
  // Analyze responses for patterns
  const learningResponses = reflection.responses.filter(r => r.category === 'learning');
  const wellnessResponses = reflection.responses.filter(r => r.category === 'wellness');
  const goalResponses = reflection.responses.filter(r => r.category === 'goals');

  // Learning insights
  if (learningResponses.length > 0) {
    const wins = learningResponses.find(r => r.questionId === 'weekly-win');
    const challenges = learningResponses.find(r => r.questionId === 'weekly-challenge');
    
    if (wins && wins.answer.length > 10) {
      insights.push(`You celebrated: ${wins.answer.substring(0, 50)}...`);
    }
    
    if (challenges && challenges.answer.length > 10) {
      insights.push(`You overcame: ${challenges.answer.substring(0, 50)}...`);
    }
  }

  // Wellness insights
  if (wellnessResponses.length > 0) {
    const stressResponse = wellnessResponses.find(r => r.questionId === 'weekly-stress');
    if (stressResponse && stressResponse.answer.length > 10) {
      insights.push(`Stress management: ${stressResponse.answer.substring(0, 50)}...`);
    }
  }

  // Goal insights
  if (goalResponses.length > 0) {
    const goalProgress = goalResponses.find(r => r.questionId === 'weekly-goals');
    if (goalProgress && goalProgress.answer.length > 10) {
      insights.push(`Goal progress: ${goalProgress.answer.substring(0, 50)}...`);
    }
  }

  // Data-driven insights
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const weekEntries = userData.entries.filter(entry => 
    new Date(entry.date) >= weekStart
  );

  if (weekEntries.length > 0) {
    const avgMood = weekEntries.reduce((sum, e) => sum + e.mood, 0) / weekEntries.length;
    insights.push(`Your average mood this week was ${Math.round(avgMood * 10) / 10}/5`);
    
    const uniqueSubjects = new Set(weekEntries.map(e => e.subject));
    insights.push(`You explored ${uniqueSubjects.size} different subjects this week`);
  }

  if (userData.breathingSessions.length > 0) {
    const weekBreathing = userData.breathingSessions.filter(session => 
      new Date(session.date) >= weekStart
    );
    if (weekBreathing.length > 0) {
      insights.push(`You used breathing exercises ${weekBreathing.length} times this week`);
    }
  }

  return insights;
};

export const getReflectionHistory = (
  reflections: ReflectionEntry[],
  limit: number = 10
): ReflectionEntry[] => {
  return reflections
    .filter(r => r.completed)
    .sort((a, b) => b.date - a.date)
    .slice(0, limit);
};

export const getReflectionStats = (reflections: ReflectionEntry[]) => {
  const completed = reflections.filter(r => r.completed);
  const weekly = completed.filter(r => r.type === 'weekly');
  const monthly = completed.filter(r => r.type === 'monthly');
  
  return {
    total: completed.length,
    weekly: weekly.length,
    monthly: monthly.length,
    averageMood: completed.length > 0 
      ? Math.round(completed.reduce((sum, r) => sum + r.mood, 0) / completed.length * 10) / 10
      : 0,
    lastReflection: completed.length > 0 ? completed[0].date : null
  };
}; 