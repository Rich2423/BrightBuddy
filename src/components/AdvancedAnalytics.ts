export interface LearningInsight {
  id: string;
  type: 'pattern' | 'correlation' | 'prediction' | 'achievement' | 'suggestion';
  title: string;
  description: string;
  confidence: number; // 0-100
  data: any;
  timestamp: number;
  category: 'learning' | 'mood' | 'stress' | 'wellness' | 'general';
}

export interface LearningPattern {
  bestTimeOfDay: string;
  bestDayOfWeek: string;
  mostProductiveSubject: string;
  moodSubjectCorrelation: { [subject: string]: number };
  stressTriggers: string[];
  learningVelocity: number; // entries per week
  moodStability: number; // standard deviation of mood
  stressPattern: 'increasing' | 'decreasing' | 'stable';
}

export interface ComparativeData {
  currentPeriod: {
    entries: number;
    averageMood: number;
    averageStress: number;
    streak: number;
    subjects: string[];
  };
  previousPeriod: {
    entries: number;
    averageMood: number;
    averageStress: number;
    streak: number;
    subjects: string[];
  };
  improvements: {
    entries: number; // percentage change
    mood: number;
    stress: number;
    streak: number;
  };
}

// Advanced Analytics Functions
export const analyzeLearningPatterns = (entries: any[]): LearningPattern => {
  if (entries.length === 0) {
    return {
      bestTimeOfDay: 'Unknown',
      bestDayOfWeek: 'Unknown',
      mostProductiveSubject: 'Unknown',
      moodSubjectCorrelation: {},
      stressTriggers: [],
      learningVelocity: 0,
      moodStability: 0,
      stressPattern: 'stable'
    };
  }

  // Analyze time patterns
  const timeOfDayCounts: { [hour: string]: number } = {};
  const dayOfWeekCounts: { [day: string]: number } = {};
  const subjectCounts: { [subject: string]: number } = {};
  const moodBySubject: { [subject: string]: number[] } = {};
  const stressBySubject: { [subject: string]: number[] } = {};

  entries.forEach(entry => {
    const date = new Date(entry.date);
    const hour = date.getHours();
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Time of day analysis
    const timeSlot = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
    timeOfDayCounts[timeSlot] = (timeOfDayCounts[timeSlot] || 0) + 1;
    
    // Day of week analysis
    dayOfWeekCounts[day] = (dayOfWeekCounts[day] || 0) + 1;
    
    // Subject analysis
    subjectCounts[entry.subject] = (subjectCounts[entry.subject] || 0) + 1;
    
    // Mood and stress by subject
    if (!moodBySubject[entry.subject]) moodBySubject[entry.subject] = [];
    if (!stressBySubject[entry.subject]) stressBySubject[entry.subject] = [];
    moodBySubject[entry.subject].push(entry.mood);
    stressBySubject[entry.subject].push(entry.stress);
  });

  // Find best times
  const bestTimeOfDay = Object.entries(timeOfDayCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';
  
  const bestDayOfWeek = Object.entries(dayOfWeekCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';
  
  const mostProductiveSubject = Object.entries(subjectCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';

  // Calculate mood correlation by subject
  const moodSubjectCorrelation: { [subject: string]: number } = {};
  Object.entries(moodBySubject).forEach(([subject, moods]) => {
    if (moods.length >= 3) {
      const avgMood = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
      moodSubjectCorrelation[subject] = Math.round(avgMood * 10) / 10;
    }
  });

  // Calculate learning velocity (entries per week)
  const firstEntry = new Date(entries[entries.length - 1].date);
  const lastEntry = new Date(entries[0].date);
  const weeksDiff = (lastEntry.getTime() - firstEntry.getTime()) / (1000 * 60 * 60 * 24 * 7);
  const learningVelocity = Math.round((entries.length / Math.max(weeksDiff, 1)) * 10) / 10;

  // Calculate mood stability
  const moods = entries.map(e => e.mood);
  const avgMood = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
  const moodVariance = moods.reduce((sum, mood) => sum + Math.pow(mood - avgMood, 2), 0) / moods.length;
  const moodStability = Math.round((5 - Math.sqrt(moodVariance)) * 10) / 10;

  // Analyze stress pattern
  const recentEntries = entries.slice(0, Math.min(10, entries.length));
  const olderEntries = entries.slice(-Math.min(10, entries.length));
  const recentAvgStress = recentEntries.reduce((sum, e) => sum + e.stress, 0) / recentEntries.length;
  const olderAvgStress = olderEntries.reduce((sum, e) => sum + e.stress, 0) / olderEntries.length;
  
  let stressPattern: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (recentAvgStress > olderAvgStress + 0.5) stressPattern = 'increasing';
  else if (recentAvgStress < olderAvgStress - 0.5) stressPattern = 'decreasing';

  // Identify stress triggers
  const stressTriggers: string[] = [];
  const highStressEntries = entries.filter(e => e.stress >= 4);
  const highStressSubjects = highStressEntries.map(e => e.subject);
  const subjectStressCounts: { [subject: string]: number } = {};
  highStressSubjects.forEach(subject => {
    subjectStressCounts[subject] = (subjectStressCounts[subject] || 0) + 1;
  });
  
  Object.entries(subjectStressCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .forEach(([subject]) => stressTriggers.push(subject));

  return {
    bestTimeOfDay,
    bestDayOfWeek,
    mostProductiveSubject,
    moodSubjectCorrelation,
    stressTriggers,
    learningVelocity,
    moodStability,
    stressPattern
  };
};

export const generateInsights = (
  entries: any[],
  breathingSessions: any[],
  currentStreak: number
): LearningInsight[] => {
  const insights: LearningInsight[] = [];
  const patterns = analyzeLearningPatterns(entries);

  // Pattern insights
  if (patterns.bestTimeOfDay !== 'Unknown') {
    insights.push({
      id: `pattern-${Date.now()}-1`,
      type: 'pattern',
      title: 'Best Learning Time',
      description: `You're most active with learning during ${patterns.bestTimeOfDay.toLowerCase()} hours. Try to schedule important learning activities during this time!`,
      confidence: 85,
      data: { timeOfDay: patterns.bestTimeOfDay },
      timestamp: Date.now(),
      category: 'learning'
    });
  }

  if (patterns.bestDayOfWeek !== 'Unknown') {
    insights.push({
      id: `pattern-${Date.now()}-2`,
      type: 'pattern',
      title: 'Productive Day',
      description: `${patterns.bestDayOfWeek}s are your most productive learning days. Consider this when planning your week!`,
      confidence: 80,
      data: { dayOfWeek: patterns.bestDayOfWeek },
      timestamp: Date.now(),
      category: 'learning'
    });
  }

  // Mood insights
  const moodCorrelations = Object.entries(patterns.moodSubjectCorrelation)
    .sort(([,a], [,b]) => b - a);
  
  if (moodCorrelations.length > 0) {
    const [bestSubject, bestMood] = moodCorrelations[0];
    insights.push({
      id: `correlation-${Date.now()}-1`,
      type: 'correlation',
      title: 'Happiest Learning',
      description: `${bestSubject} makes you happiest! Your average mood during ${bestSubject} activities is ${bestMood}/5.`,
      confidence: 90,
      data: { subject: bestSubject, mood: bestMood },
      timestamp: Date.now(),
      category: 'mood'
    });
  }

  // Stress insights
  if (patterns.stressTriggers.length > 0) {
    insights.push({
      id: `pattern-${Date.now()}-3`,
      type: 'pattern',
      title: 'Stress Triggers',
      description: `You tend to feel more stressed during ${patterns.stressTriggers.join(', ')} activities. Consider taking breaks or using breathing exercises before these subjects.`,
      confidence: 75,
      data: { triggers: patterns.stressTriggers },
      timestamp: Date.now(),
      category: 'stress'
    });
  }

  // Achievement insights
  if (currentStreak >= 7) {
    insights.push({
      id: `achievement-${Date.now()}-1`,
      type: 'achievement',
      title: 'Consistency Champion',
      description: `Amazing! You've maintained a ${currentStreak}-day learning streak. Your dedication is inspiring!`,
      confidence: 100,
      data: { streak: currentStreak },
      timestamp: Date.now(),
      category: 'general'
    });
  }

  if (entries.length >= 50) {
    insights.push({
      id: `achievement-${Date.now()}-2`,
      type: 'achievement',
      title: 'Learning Veteran',
      description: `You've completed ${entries.length} journal entries! That's a lot of learning and reflection.`,
      confidence: 100,
      data: { totalEntries: entries.length },
      timestamp: Date.now(),
      category: 'learning'
    });
  }

  // Wellness insights
  if (breathingSessions.length >= 5) {
    insights.push({
      id: `wellness-${Date.now()}-1`,
      type: 'achievement',
      title: 'Mindful Learner',
      description: `You've used breathing exercises ${breathingSessions.length} times! You're great at managing stress.`,
      confidence: 100,
      data: { breathingSessions: breathingSessions.length },
      timestamp: Date.now(),
      category: 'wellness'
    });
  }

  // Predictive insights
  if (patterns.learningVelocity > 5) {
    insights.push({
      id: `prediction-${Date.now()}-1`,
      type: 'prediction',
      title: 'Learning Momentum',
      description: `At your current pace, you'll complete 100 entries in about ${Math.round(100 / patterns.learningVelocity)} weeks!`,
      confidence: 70,
      data: { velocity: patterns.learningVelocity, prediction: Math.round(100 / patterns.learningVelocity) },
      timestamp: Date.now(),
      category: 'learning'
    });
  }

  if (patterns.stressPattern === 'increasing') {
    insights.push({
      id: `prediction-${Date.now()}-2`,
      type: 'prediction',
      title: 'Stress Trend',
      description: 'Your stress levels have been increasing lately. Consider using more wellness tools or talking to someone about it.',
      confidence: 65,
      data: { pattern: patterns.stressPattern },
      timestamp: Date.now(),
      category: 'stress'
    });
  }

  // Suggestion insights
  if (patterns.moodStability < 3) {
    insights.push({
      id: `suggestion-${Date.now()}-1`,
      type: 'suggestion',
      title: 'Mood Stability',
      description: 'Your mood varies quite a bit. Try using the wellness check-in feature to track patterns and find what helps you feel better.',
      confidence: 60,
      data: { stability: patterns.moodStability },
      timestamp: Date.now(),
      category: 'mood'
    });
  }

  return insights.sort((a, b) => b.confidence - a.confidence);
};

export const getComparativeData = (
  entries: any[],
  period: 'week' | 'month' = 'week'
): ComparativeData => {
  const now = new Date();
  const periodDays = period === 'week' ? 7 : 30;
  
  const currentPeriodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
  const previousPeriodStart = new Date(currentPeriodStart.getTime() - periodDays * 24 * 60 * 60 * 1000);
  
  const currentEntries = entries.filter(entry => 
    new Date(entry.date) >= currentPeriodStart
  );
  
  const previousEntries = entries.filter(entry => 
    new Date(entry.date) >= previousPeriodStart && new Date(entry.date) < currentPeriodStart
  );

  const currentData = {
    entries: currentEntries.length,
    averageMood: currentEntries.length > 0 
      ? Math.round(currentEntries.reduce((sum, e) => sum + e.mood, 0) / currentEntries.length * 10) / 10
      : 0,
    averageStress: currentEntries.length > 0
      ? Math.round(currentEntries.reduce((sum, e) => sum + e.stress, 0) / currentEntries.length * 10) / 10
      : 0,
    streak: 0, // This would need to be calculated separately
    subjects: [...new Set(currentEntries.map(e => e.subject))]
  };

  const previousData = {
    entries: previousEntries.length,
    averageMood: previousEntries.length > 0
      ? Math.round(previousEntries.reduce((sum, e) => sum + e.mood, 0) / previousEntries.length * 10) / 10
      : 0,
    averageStress: previousEntries.length > 0
      ? Math.round(previousEntries.reduce((sum, e) => sum + e.stress, 0) / previousEntries.length * 10) / 10
      : 0,
    streak: 0,
    subjects: [...new Set(previousEntries.map(e => e.subject))]
  };

  const improvements = {
    entries: previousData.entries > 0 
      ? Math.round(((currentData.entries - previousData.entries) / previousData.entries) * 100)
      : currentData.entries > 0 ? 100 : 0,
    mood: previousData.averageMood > 0
      ? Math.round(((currentData.averageMood - previousData.averageMood) / previousData.averageMood) * 100)
      : currentData.averageMood > 0 ? 100 : 0,
    stress: previousData.averageStress > 0
      ? Math.round(((previousData.averageStress - currentData.averageStress) / previousData.averageStress) * 100)
      : currentData.averageStress < previousData.averageStress ? 100 : 0,
    streak: 0 // Would need separate calculation
  };

  return {
    currentPeriod: currentData,
    previousPeriod: previousData,
    improvements
  };
};

export const generateHeatmapData = (entries: any[]): any[] => {
  const heatmapData: any[] = [];
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening'];

  daysOfWeek.forEach((day, dayIndex) => {
    timeSlots.forEach((timeSlot, timeIndex) => {
      const relevantEntries = entries.filter(entry => {
        const date = new Date(entry.date);
        const entryDay = date.toLocaleDateString('en-US', { weekday: 'long' });
        const hour = date.getHours();
        const entryTimeSlot = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
        
        return entryDay === day && entryTimeSlot === timeSlot;
      });

      heatmapData.push({
        day: dayIndex,
        time: timeIndex,
        value: relevantEntries.length,
        label: `${day} ${timeSlot}`,
        entries: relevantEntries
      });
    });
  });

  return heatmapData;
}; 