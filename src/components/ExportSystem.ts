export interface ProgressReport {
  id: string;
  title: string;
  date: number;
  period: 'week' | 'month' | 'custom';
  data: {
    entries: any[];
    breathingSessions: any[];
    reflections: any[];
    goals: any[];
    badges: any[];
    insights: any[];
  };
  summary: {
    totalEntries: number;
    averageMood: number;
    averageStress: number;
    currentStreak: number;
    subjectsExplored: string[];
    wellnessActivities: number;
    goalsCompleted: number;
    badgesEarned: number;
  };
  highlights: string[];
  recommendations: string[];
  privacyLevel: 'personal' | 'parent' | 'teacher' | 'public';
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf';
  includeData: {
    entries: boolean;
    breathingSessions: boolean;
    reflections: boolean;
    goals: boolean;
    badges: boolean;
    insights: boolean;
  };
  dateRange: {
    start: Date;
    end: Date;
  };
  privacyLevel: 'personal' | 'parent' | 'teacher' | 'public';
}

// Export Functions
export const generateProgressReport = (
  userData: {
    entries: any[];
    breathingSessions: any[];
    reflections: any[];
    goals: any[];
    badges: any[];
    insights: any[];
    currentStreak: number;
  },
  period: 'week' | 'month' | 'custom' = 'week',
  privacyLevel: 'personal' | 'parent' | 'teacher' | 'public' = 'personal'
): ProgressReport => {
  const now = new Date();
  const periodDays = period === 'week' ? 7 : 30;
  const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
  
  // Filter data by date range
  const periodEntries = userData.entries.filter(entry => 
    new Date(entry.date) >= startDate
  );
  
  const periodBreathing = userData.breathingSessions.filter(session => 
    new Date(session.date) >= startDate
  );
  
  const periodReflections = userData.reflections.filter(reflection => 
    reflection.date >= startDate.getTime()
  );
  
  const periodGoals = userData.goals.filter(goal => 
    goal.startDate >= startDate.getTime()
  );
  
  const periodBadges = userData.badges.filter(badge => 
    badge.unlockedDate && badge.unlockedDate >= startDate.getTime()
  );
  
  const periodInsights = userData.insights.filter(insight => 
    insight.timestamp >= startDate.getTime()
  );

  // Calculate summary
  const totalEntries = periodEntries.length;
  const averageMood = periodEntries.length > 0 
    ? Math.round(periodEntries.reduce((sum, e) => sum + e.mood, 0) / periodEntries.length * 10) / 10
    : 0;
  const averageStress = periodEntries.length > 0
    ? Math.round(periodEntries.reduce((sum, e) => sum + e.stress, 0) / periodEntries.length * 10) / 10
    : 0;
  const subjectsExplored = [...new Set(periodEntries.map(e => e.subject))];
  const wellnessActivities = periodBreathing.length;
  const goalsCompleted = periodGoals.filter(g => g.completed).length;
  const badgesEarned = periodBadges.length;

  // Generate highlights
  const highlights: string[] = [];
  
  if (totalEntries > 0) {
    highlights.push(`Completed ${totalEntries} learning journal entries`);
  }
  
  if (averageMood >= 4) {
    highlights.push(`Maintained positive mood (${averageMood}/5 average)`);
  }
  
  if (userData.currentStreak >= 7) {
    highlights.push(`Maintained ${userData.currentStreak}-day learning streak`);
  }
  
  if (subjectsExplored.length >= 3) {
    highlights.push(`Explored ${subjectsExplored.length} different subjects`);
  }
  
  if (wellnessActivities > 0) {
    highlights.push(`Used breathing exercises ${wellnessActivities} times`);
  }
  
  if (goalsCompleted > 0) {
    highlights.push(`Completed ${goalsCompleted} learning goals`);
  }
  
  if (badgesEarned > 0) {
    highlights.push(`Earned ${badgesEarned} achievement badges`);
  }

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (averageMood < 3) {
    recommendations.push('Consider using more wellness tools to improve mood');
  }
  
  if (averageStress > 3) {
    recommendations.push('Try more stress management techniques like breathing exercises');
  }
  
  if (subjectsExplored.length < 3) {
    recommendations.push('Explore more diverse subjects to broaden learning');
  }
  
  if (wellnessActivities === 0) {
    recommendations.push('Try incorporating wellness activities into your routine');
  }
  
  if (goalsCompleted === 0 && periodGoals.length > 0) {
    recommendations.push('Focus on completing one goal at a time');
  }

  return {
    id: `report-${Date.now()}`,
    title: `${period.charAt(0).toUpperCase() + period.slice(1)}ly Progress Report`,
    date: Date.now(),
    period,
    data: {
      entries: privacyLevel === 'personal' ? periodEntries : [],
      breathingSessions: privacyLevel === 'personal' ? periodBreathing : [],
      reflections: privacyLevel === 'personal' ? periodReflections : [],
      goals: periodGoals,
      badges: periodBadges,
      insights: periodInsights
    },
    summary: {
      totalEntries,
      averageMood,
      averageStress,
      currentStreak: userData.currentStreak,
      subjectsExplored,
      wellnessActivities,
      goalsCompleted,
      badgesEarned
    },
    highlights,
    recommendations,
    privacyLevel
  };
};

export const exportDataAsJSON = (
  userData: any,
  options: ExportOptions
): string => {
  const exportData: any = {};
  
  if (options.includeData.entries) {
    exportData.entries = userData.entries.filter((entry: any) => 
      new Date(entry.date) >= options.dateRange.start && 
      new Date(entry.date) <= options.dateRange.end
    );
  }
  
  if (options.includeData.breathingSessions) {
    exportData.breathingSessions = userData.breathingSessions.filter((session: any) => 
      new Date(session.date) >= options.dateRange.start && 
      new Date(session.date) <= options.dateRange.end
    );
  }
  
  if (options.includeData.reflections) {
    exportData.reflections = userData.reflections.filter((reflection: any) => 
      reflection.date >= options.dateRange.start.getTime() && 
      reflection.date <= options.dateRange.end.getTime()
    );
  }
  
  if (options.includeData.goals) {
    exportData.goals = userData.goals;
  }
  
  if (options.includeData.badges) {
    exportData.badges = userData.badges;
  }
  
  if (options.includeData.insights) {
    exportData.insights = userData.insights.filter((insight: any) => 
      insight.timestamp >= options.dateRange.start.getTime() && 
      insight.timestamp <= options.dateRange.end.getTime()
    );
  }
  
  exportData.metadata = {
    exportDate: new Date().toISOString(),
    dateRange: {
      start: options.dateRange.start.toISOString(),
      end: options.dateRange.end.toISOString()
    },
    privacyLevel: options.privacyLevel,
    totalRecords: Object.values(exportData).reduce((sum: number, arr: any) => 
      Array.isArray(arr) ? sum + arr.length : sum, 0
    )
  };
  
  return JSON.stringify(exportData, null, 2);
};

export const exportDataAsCSV = (
  userData: any,
  options: ExportOptions
): string => {
  const csvRows: string[] = [];
  
  if (options.includeData.entries) {
    csvRows.push('Journal Entries');
    csvRows.push('Date,Subject,Mood,Stress,Learning Note');
    
    const entries = userData.entries.filter((entry: any) => 
      new Date(entry.date) >= options.dateRange.start && 
      new Date(entry.date) <= options.dateRange.end
    );
    
    entries.forEach((entry: any) => {
      csvRows.push(`${entry.date},${entry.subject},${entry.mood},${entry.stress},"${entry.learningNote.replace(/"/g, '""')}"`);
    });
    
    csvRows.push(''); // Empty row for separation
  }
  
  if (options.includeData.breathingSessions) {
    csvRows.push('Breathing Sessions');
    csvRows.push('Date,Duration,Exercise Type');
    
    const sessions = userData.breathingSessions.filter((session: any) => 
      new Date(session.date) >= options.dateRange.start && 
      new Date(session.date) <= options.dateRange.end
    );
    
    sessions.forEach((session: any) => {
      csvRows.push(`${session.date},${session.duration},${session.exercise}`);
    });
    
    csvRows.push('');
  }
  
  if (options.includeData.goals) {
    csvRows.push('Learning Goals');
    csvRows.push('Title,Type,Target,Current,Progress,Completed');
    
    userData.goals.forEach((goal: any) => {
      csvRows.push(`${goal.title},${goal.type},${goal.target},${goal.current},${goal.progress}%,${goal.completed}`);
    });
    
    csvRows.push('');
  }
  
  if (options.includeData.badges) {
    csvRows.push('Achievement Badges');
    csvRows.push('Title,Category,Unlocked Date');
    
    userData.badges.filter((badge: any) => badge.unlocked).forEach((badge: any) => {
      csvRows.push(`${badge.title},${badge.category},${badge.unlockedDate ? new Date(badge.unlockedDate).toISOString() : ''}`);
    });
  }
  
  return csvRows.join('\n');
};

export const generateShareableBadge = (badge: any): string => {
  const shareText = `🎉 I just earned the "${badge.title}" badge in my learning journal! ${badge.description} #LearningJourney #Achievement`;
  return shareText;
};

export const generateShareableProgress = (report: ProgressReport): string => {
  const shareText = `📚 Learning Progress Update: ${report.summary.totalEntries} entries, ${report.summary.subjectsExplored.length} subjects explored, ${report.summary.currentStreak}-day streak! #LearningJourney #Progress`;
  return shareText;
};

export const createParentReport = (report: ProgressReport): ProgressReport => {
  // Filter sensitive data for parent view
  return {
    ...report,
    data: {
      entries: [], // Don't include detailed entries
      breathingSessions: [], // Don't include wellness details
      reflections: [], // Don't include personal reflections
      goals: report.data.goals.map(goal => ({
        title: goal.title,
        type: goal.type,
        progress: goal.progress,
        completed: goal.completed
      })),
      badges: report.data.badges,
      insights: report.data.insights.filter(insight => 
        insight.category === 'learning' || insight.category === 'general'
      )
    },
    privacyLevel: 'parent'
  };
};

export const createTeacherReport = (report: ProgressReport): ProgressReport => {
  // Filter for teacher view - focus on learning progress
  return {
    ...report,
    data: {
      entries: report.data.entries.map(entry => ({
        date: entry.date,
        subject: entry.subject,
        mood: entry.mood,
        stress: entry.stress
        // Don't include personal learning notes
      })),
      breathingSessions: [],
      reflections: [],
      goals: report.data.goals,
      badges: report.data.badges,
      insights: report.data.insights.filter(insight => 
        insight.category === 'learning'
      )
    },
    privacyLevel: 'teacher'
  };
};

export const validatePrivacySettings = (
  data: any,
  privacyLevel: 'personal' | 'parent' | 'teacher' | 'public'
): boolean => {
  // Validate that data meets privacy requirements
  switch (privacyLevel) {
    case 'personal':
      return true; // All data allowed
    case 'parent':
      // Check that no personal notes are included
      return !data.entries?.some((entry: any) => entry.learningNote?.length > 0);
    case 'teacher':
      // Check that no personal wellness data is included
      return !data.breathingSessions?.length && !data.reflections?.length;
    case 'public':
      // Check that only general achievements are included
      return !data.entries?.length && !data.breathingSessions?.length && 
             !data.reflections?.length && !data.goals?.length;
    default:
      return false;
  }
}; 