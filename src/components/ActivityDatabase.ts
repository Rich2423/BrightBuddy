export interface LearningActivity {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: number; // in minutes
  moodRange: number[]; // 1-5 mood levels this activity is good for
  stressLevel: 'high' | 'low' | 'any'; // stress level this activity is good for
  type: 'interactive' | 'creative' | 'problem-solving' | 'reflective' | 'physical';
  difficulty: 'easy' | 'medium' | 'hard';
  materials?: string[];
  instructions?: string;
  whyThis?: string; // explanation of why this activity is suggested
  tags: string[];
}

export const activities: LearningActivity[] = [
  // Low Energy, High Stress Activities (Calming)
  {
    id: '1',
    title: 'Mindful Math Coloring',
    description: 'Color by numbers while practicing basic math facts',
    subject: 'Math',
    duration: 10,
    moodRange: [1, 2],
    stressLevel: 'high',
    type: 'creative',
    difficulty: 'easy',
    materials: ['Coloring page', 'Crayons or markers'],
    whyThis: 'Gentle math practice that helps you relax and focus',
    tags: ['calming', 'visual', 'basic-math']
  },
  {
    id: '2',
    title: 'Nature Observation Journal',
    description: 'Sit quietly and observe nature, then write or draw what you see',
    subject: 'Science',
    duration: 15,
    moodRange: [1, 2],
    stressLevel: 'high',
    type: 'reflective',
    difficulty: 'easy',
    materials: ['Paper', 'Pencil', 'Window or outdoor space'],
    whyThis: 'Peaceful observation helps calm your mind and teaches patience',
    tags: ['nature', 'observation', 'writing']
  },
  {
    id: '3',
    title: 'Gentle Reading Time',
    description: 'Read a favorite book in a cozy spot for 15 minutes',
    subject: 'Reading',
    duration: 15,
    moodRange: [1, 2],
    stressLevel: 'high',
    type: 'reflective',
    difficulty: 'easy',
    materials: ['Favorite book', 'Comfortable spot'],
    whyThis: 'Reading familiar stories can be very comforting when you\'re feeling down',
    tags: ['reading', 'comfort', 'familiar']
  },

  // Neutral Mood Activities (Balanced)
  {
    id: '4',
    title: '5-Minute Math Puzzles',
    description: 'Solve fun number puzzles at your own pace',
    subject: 'Math',
    duration: 5,
    moodRange: [2, 3, 4],
    stressLevel: 'any',
    type: 'problem-solving',
    difficulty: 'easy',
    materials: ['Puzzle app or worksheet'],
    whyThis: 'Quick brain teasers that are fun and build confidence',
    tags: ['puzzles', 'quick', 'brain-teasers']
  },
  {
    id: '5',
    title: 'Word Association Game',
    description: 'Start with a word and connect it to related words',
    subject: 'Reading',
    duration: 10,
    moodRange: [2, 3, 4],
    stressLevel: 'any',
    type: 'interactive',
    difficulty: 'easy',
    materials: ['Paper', 'Pencil'],
    whyThis: 'Creative word play that builds vocabulary without pressure',
    tags: ['vocabulary', 'creative', 'word-games']
  },
  {
    id: '6',
    title: 'Simple Science Questions',
    description: 'Answer "Why do you think..." questions about everyday things',
    subject: 'Science',
    duration: 10,
    moodRange: [2, 3, 4],
    stressLevel: 'any',
    type: 'reflective',
    difficulty: 'easy',
    materials: ['Curiosity and imagination'],
    whyThis: 'Encourages curiosity and critical thinking in a relaxed way',
    tags: ['curiosity', 'thinking', 'everyday-science']
  },

  // High Energy, Low Stress Activities (Engaging)
  {
    id: '7',
    title: 'Rainbow Milk Experiment',
    description: 'Create colorful patterns with milk, food coloring, and dish soap',
    subject: 'Science',
    duration: 20,
    moodRange: [4, 5],
    stressLevel: 'low',
    type: 'interactive',
    difficulty: 'medium',
    materials: ['Milk', 'Food coloring', 'Dish soap', 'Shallow dish', 'Cotton swab'],
    whyThis: 'Exciting hands-on experiment that\'s perfect for your high energy!',
    tags: ['experiment', 'colorful', 'hands-on']
  },
  {
    id: '8',
    title: 'Math Dance Challenge',
    description: 'Dance to music while solving math problems between moves',
    subject: 'Math',
    duration: 15,
    moodRange: [4, 5],
    stressLevel: 'low',
    type: 'physical',
    difficulty: 'medium',
    materials: ['Music', 'Space to dance', 'Math problems'],
    whyThis: 'Combines your energy with learning - perfect for active minds!',
    tags: ['dance', 'active', 'fun-math']
  },
  {
    id: '9',
    title: 'Creative Story Writing',
    description: 'Write a short story about your favorite superhero or character',
    subject: 'Writing',
    duration: 20,
    moodRange: [4, 5],
    stressLevel: 'low',
    type: 'creative',
    difficulty: 'medium',
    materials: ['Paper', 'Pencil', 'Imagination'],
    whyThis: 'Your creative energy is perfect for storytelling adventures!',
    tags: ['creative', 'storytelling', 'imagination']
  },

  // Subject-Specific Activities
  {
    id: '10',
    title: 'Fraction Pizza Making',
    description: 'Use play dough to create pizzas and practice fractions',
    subject: 'Math',
    duration: 25,
    moodRange: [3, 4, 5],
    stressLevel: 'any',
    type: 'interactive',
    difficulty: 'medium',
    materials: ['Play dough', 'Pizza cutter', 'Paper plates'],
    whyThis: 'Hands-on fraction practice that makes math delicious!',
    tags: ['fractions', 'hands-on', 'food-math']
  },
  {
    id: '11',
    title: 'Historical Time Travel',
    description: 'Imagine you\'re visiting a historical period and write about it',
    subject: 'History',
    duration: 15,
    moodRange: [3, 4, 5],
    stressLevel: 'any',
    type: 'creative',
    difficulty: 'medium',
    materials: ['Paper', 'Pencil', 'History book or internet'],
    whyThis: 'Creative way to explore history through imagination',
    tags: ['history', 'imagination', 'creative-writing']
  },
  {
    id: '12',
    title: 'Art Color Mixing',
    description: 'Experiment with mixing primary colors to create new ones',
    subject: 'Art',
    duration: 20,
    moodRange: [2, 3, 4, 5],
    stressLevel: 'any',
    type: 'creative',
    difficulty: 'easy',
    materials: ['Paint (red, blue, yellow)', 'Paper', 'Brushes'],
    whyThis: 'Colorful exploration that\'s both calming and creative',
    tags: ['colors', 'painting', 'experimentation']
  },

  // Quick Activities (5-10 minutes)
  {
    id: '13',
    title: 'Speed Reading Challenge',
    description: 'Read as much as you can in 5 minutes, then summarize',
    subject: 'Reading',
    duration: 5,
    moodRange: [3, 4, 5],
    stressLevel: 'any',
    type: 'interactive',
    difficulty: 'medium',
    materials: ['Book or article', 'Timer'],
    whyThis: 'Quick challenge that builds reading speed and comprehension',
    tags: ['speed', 'reading', 'challenge']
  },
  {
    id: '14',
    title: 'Math Fact Race',
    description: 'Solve as many math facts as you can in 5 minutes',
    subject: 'Math',
    duration: 5,
    moodRange: [3, 4, 5],
    stressLevel: 'any',
    type: 'problem-solving',
    difficulty: 'easy',
    materials: ['Math facts worksheet', 'Timer'],
    whyThis: 'Quick practice that builds speed and confidence',
    tags: ['speed', 'math-facts', 'practice']
  },
  {
    id: '15',
    title: 'Quick Science Quiz',
    description: 'Answer 10 fun science questions about animals, plants, or space',
    subject: 'Science',
    duration: 8,
    moodRange: [2, 3, 4, 5],
    stressLevel: 'any',
    type: 'problem-solving',
    difficulty: 'easy',
    materials: ['Science quiz questions'],
    whyThis: 'Fun way to test and expand your science knowledge',
    tags: ['quiz', 'science', 'knowledge']
  },

  // Reflective Activities
  {
    id: '16',
    title: 'Learning Reflection',
    description: 'Think about what you learned today and draw a picture of it',
    subject: 'Other',
    duration: 15,
    moodRange: [1, 2, 3],
    stressLevel: 'high',
    type: 'reflective',
    difficulty: 'easy',
    materials: ['Paper', 'Drawing supplies'],
    whyThis: 'Reflecting on learning helps it stick and feels peaceful',
    tags: ['reflection', 'drawing', 'learning-review']
  },
  {
    id: '17',
    title: 'Gratitude Journal',
    description: 'Write down 3 things you\'re grateful for learning today',
    subject: 'Other',
    duration: 10,
    moodRange: [1, 2, 3],
    stressLevel: 'high',
    type: 'reflective',
    difficulty: 'easy',
    materials: ['Paper', 'Pencil'],
    whyThis: 'Focusing on gratitude can lift your mood and build positivity',
    tags: ['gratitude', 'positive-thinking', 'writing']
  },

  // Interactive Activities
  {
    id: '18',
    title: 'Spelling Bee Practice',
    description: 'Practice spelling words with a family member or friend',
    subject: 'Reading',
    duration: 15,
    moodRange: [3, 4, 5],
    stressLevel: 'any',
    type: 'interactive',
    difficulty: 'medium',
    materials: ['Spelling words', 'Partner'],
    whyThis: 'Social learning that makes spelling fun and interactive',
    tags: ['spelling', 'social', 'practice']
  },
  {
    id: '19',
    title: 'Math Board Game',
    description: 'Play a math-themed board game with family or friends',
    subject: 'Math',
    duration: 30,
    moodRange: [3, 4, 5],
    stressLevel: 'any',
    type: 'interactive',
    difficulty: 'medium',
    materials: ['Math board game', 'Players'],
    whyThis: 'Learning through play makes math enjoyable and social',
    tags: ['games', 'social', 'fun-math']
  },

  // Creative Activities
  {
    id: '20',
    title: 'Comic Strip Creation',
    description: 'Create a comic strip about something you learned today',
    subject: 'Art',
    duration: 25,
    moodRange: [3, 4, 5],
    stressLevel: 'any',
    type: 'creative',
    difficulty: 'medium',
    materials: ['Paper', 'Markers', 'Ruler'],
    whyThis: 'Creative way to show what you learned through art',
    tags: ['comics', 'art', 'storytelling']
  },
  {
    id: '21',
    title: 'Science Song Writing',
    description: 'Write a short song about a science concept you learned',
    subject: 'Science',
    duration: 20,
    moodRange: [4, 5],
    stressLevel: 'low',
    type: 'creative',
    difficulty: 'medium',
    materials: ['Paper', 'Pencil', 'Imagination'],
    whyThis: 'Music and science together - perfect for creative minds!',
    tags: ['music', 'science', 'creative']
  },

  // Physical Activities
  {
    id: '22',
    title: 'Math Movement',
    description: 'Do jumping jacks while counting by 2s, 5s, or 10s',
    subject: 'Math',
    duration: 10,
    moodRange: [4, 5],
    stressLevel: 'low',
    type: 'physical',
    difficulty: 'easy',
    materials: ['Space to move', 'Energy'],
    whyThis: 'Get your body moving while practicing math patterns',
    tags: ['movement', 'counting', 'active']
  },
  {
    id: '23',
    title: 'Spelling Hopscotch',
    description: 'Create hopscotch with letters and spell words as you hop',
    subject: 'Reading',
    duration: 15,
    moodRange: [4, 5],
    stressLevel: 'low',
    type: 'physical',
    difficulty: 'easy',
    materials: ['Chalk', 'Sidewalk or floor space'],
    whyThis: 'Active spelling practice that\'s fun and energetic',
    tags: ['hopscotch', 'spelling', 'active']
  },

  // Problem-Solving Activities
  {
    id: '24',
    title: 'Logic Puzzle Time',
    description: 'Solve age-appropriate logic puzzles and brain teasers',
    subject: 'Other',
    duration: 15,
    moodRange: [3, 4, 5],
    stressLevel: 'any',
    type: 'problem-solving',
    difficulty: 'medium',
    materials: ['Logic puzzle book or app'],
    whyThis: 'Builds critical thinking skills in a fun way',
    tags: ['logic', 'puzzles', 'thinking']
  },
  {
    id: '25',
    title: 'Science Problem Solving',
    description: 'Solve real-world science problems (like "How would you design a bridge?")',
    subject: 'Science',
    duration: 20,
    moodRange: [3, 4, 5],
    stressLevel: 'any',
    type: 'problem-solving',
    difficulty: 'hard',
    materials: ['Paper', 'Pencil', 'Imagination'],
    whyThis: 'Real-world problem solving that builds engineering thinking',
    tags: ['engineering', 'problem-solving', 'real-world']
  }
];

// Helper functions for activity filtering
export const filterActivitiesByMood = (activities: LearningActivity[], mood: number): LearningActivity[] => {
  return activities.filter(activity => activity.moodRange.includes(mood));
};

export const filterActivitiesByStress = (activities: LearningActivity[], stress: number): LearningActivity[] => {
  return activities.filter(activity => {
    if (activity.stressLevel === 'any') return true;
    if (activity.stressLevel === 'high' && stress >= 4) return true;
    if (activity.stressLevel === 'low' && stress <= 2) return true;
    return false;
  });
};

export const filterActivitiesBySubject = (activities: LearningActivity[], preferredSubjects: string[]): LearningActivity[] => {
  if (preferredSubjects.length === 0) return activities;
  return activities.filter(activity => preferredSubjects.includes(activity.subject));
};

export const filterActivitiesByDuration = (activities: LearningActivity[], maxDuration: number): LearningActivity[] => {
  return activities.filter(activity => activity.duration <= maxDuration);
};

export const getRecommendedActivities = (
  mood: number,
  stress: number,
  preferredSubjects: string[],
  maxDuration: number = 30,
  excludeIds: string[] = []
): LearningActivity[] => {
  let filtered = activities.filter(activity => !excludeIds.includes(activity.id));
  
  // Apply filters in order of importance
  filtered = filterActivitiesByMood(filtered, mood);
  filtered = filterActivitiesByStress(filtered, stress);
  filtered = filterActivitiesByDuration(filtered, maxDuration);
  
  // Boost activities that match preferred subjects
  const subjectMatches = filterActivitiesBySubject(filtered, preferredSubjects);
  const otherActivities = filtered.filter(activity => !preferredSubjects.includes(activity.subject));
  
  // Return subject matches first, then others
  return [...subjectMatches, ...otherActivities].slice(0, 5);
}; 