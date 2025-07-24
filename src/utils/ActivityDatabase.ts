import { LearningActivity } from './FreemiumSystem';

// Sample learning activities for BrightBuddy
export const ACTIVITIES: LearningActivity[] = [
  // Math Activities
  {
    id: 'math_001',
    title: 'Fraction Fun',
    description: 'Learn about fractions through interactive visual exercises',
    subject: 'Math',
    difficulty: 'beginner',
    type: 'game',
    content: {
      type: 'fraction_matching',
      questions: [
        { question: 'Match 1/2 to the correct visual', options: ['A', 'B', 'C', 'D'], correct: 'A' },
        { question: 'What is 1/4 + 1/4?', options: ['1/2', '1/8', '2/4', '1/4'], correct: '1/2' },
        { question: 'Which fraction is larger: 3/4 or 2/3?', options: ['3/4', '2/3', 'Equal', 'Cannot compare'], correct: '3/4' }
      ]
    },
    isPremium: false,
    estimatedTime: 5,
    tags: ['fractions', 'visual', 'beginner'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'math_002',
    title: 'Multiplication Master',
    description: 'Practice multiplication tables with timed challenges',
    subject: 'Math',
    difficulty: 'intermediate',
    type: 'challenge',
    content: {
      type: 'multiplication_timed',
      timeLimit: 60,
      questions: [
        { question: '7 × 8 = ?', answer: 56 },
        { question: '9 × 6 = ?', answer: 54 },
        { question: '12 × 4 = ?', answer: 48 },
        { question: '5 × 11 = ?', answer: 55 }
      ]
    },
    isPremium: false,
    estimatedTime: 3,
    tags: ['multiplication', 'timed', 'tables'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'math_003',
    title: 'Algebra Adventure',
    description: 'Solve simple algebraic equations step by step',
    subject: 'Math',
    difficulty: 'advanced',
    type: 'exercise',
    content: {
      type: 'algebra_solving',
      equations: [
        { equation: '2x + 5 = 13', steps: ['Subtract 5 from both sides', 'Divide by 2'], answer: 4 },
        { equation: '3y - 7 = 8', steps: ['Add 7 to both sides', 'Divide by 3'], answer: 5 },
        { equation: '4z + 2 = 18', steps: ['Subtract 2 from both sides', 'Divide by 4'], answer: 4 }
      ]
    },
    isPremium: true,
    estimatedTime: 8,
    tags: ['algebra', 'equations', 'problem-solving'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Science Activities
  {
    id: 'science_001',
    title: 'Plant Life Cycle',
    description: 'Learn about how plants grow from seed to flower',
    subject: 'Science',
    difficulty: 'beginner',
    type: 'quiz',
    content: {
      type: 'multiple_choice',
      questions: [
        { question: 'What comes first in a plant life cycle?', options: ['Flower', 'Seed', 'Roots', 'Leaves'], correct: 'Seed' },
        { question: 'What do plants need to grow?', options: ['Water only', 'Sunlight only', 'Water and sunlight', 'None of the above'], correct: 'Water and sunlight' },
        { question: 'What part of the plant makes food?', options: ['Roots', 'Stem', 'Leaves', 'Flowers'], correct: 'Leaves' }
      ]
    },
    isPremium: false,
    estimatedTime: 4,
    tags: ['biology', 'plants', 'life-cycle'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'science_002',
    title: 'Chemical Reactions',
    description: 'Explore different types of chemical reactions',
    subject: 'Science',
    difficulty: 'intermediate',
    type: 'exercise',
    content: {
      type: 'chemical_balancing',
      reactions: [
        { equation: 'H2 + O2 → H2O', balanced: '2H2 + O2 → 2H2O' },
        { equation: 'Na + Cl2 → NaCl', balanced: '2Na + Cl2 → 2NaCl' },
        { equation: 'Fe + O2 → Fe2O3', balanced: '4Fe + 3O2 → 2Fe2O3' }
      ]
    },
    isPremium: true,
    estimatedTime: 10,
    tags: ['chemistry', 'reactions', 'balancing'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Reading Activities
  {
    id: 'reading_001',
    title: 'Reading Comprehension',
    description: 'Read a short story and answer questions about it',
    subject: 'Reading',
    difficulty: 'beginner',
    type: 'exercise',
    content: {
      type: 'reading_comprehension',
      story: 'The little mouse was hungry. She looked around her house but found no food. Then she saw a big piece of cheese on the table. The mouse was very happy!',
      questions: [
        { question: 'What was the mouse looking for?', options: ['A toy', 'Food', 'A friend', 'A house'], correct: 'Food' },
        { question: 'Where did the mouse find the cheese?', options: ['On the floor', 'On the table', 'In the cupboard', 'Outside'], correct: 'On the table' },
        { question: 'How did the mouse feel when she found the cheese?', options: ['Sad', 'Angry', 'Happy', 'Scared'], correct: 'Happy' }
      ]
    },
    isPremium: false,
    estimatedTime: 6,
    tags: ['comprehension', 'story', 'vocabulary'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'reading_002',
    title: 'Vocabulary Builder',
    description: 'Learn new words and their meanings through context',
    subject: 'Reading',
    difficulty: 'intermediate',
    type: 'game',
    content: {
      type: 'vocabulary_matching',
      words: [
        { word: 'Magnificent', definition: 'Very beautiful or impressive', context: 'The magnificent castle stood on the hill.' },
        { word: 'Curious', definition: 'Wanting to know or learn something', context: 'The curious child asked many questions.' },
        { word: 'Brave', definition: 'Willing to face danger or difficulty', context: 'The brave knight fought the dragon.' }
      ]
    },
    isPremium: false,
    estimatedTime: 5,
    tags: ['vocabulary', 'context', 'definitions'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Writing Activities
  {
    id: 'writing_001',
    title: 'Creative Writing Prompt',
    description: 'Write a short story based on a given prompt',
    subject: 'Writing',
    difficulty: 'beginner',
    type: 'exercise',
    content: {
      type: 'writing_prompt',
      prompt: 'Write a story about a magical door that appears in your bedroom one night. What happens when you open it?',
      wordLimit: 100,
      tips: ['Start with a strong opening', 'Include descriptive details', 'End with a satisfying conclusion']
    },
    isPremium: false,
    estimatedTime: 15,
    tags: ['creative-writing', 'storytelling', 'imagination'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'writing_002',
    title: 'Grammar Check',
    description: 'Identify and correct grammar mistakes in sentences',
    subject: 'Writing',
    difficulty: 'intermediate',
    type: 'quiz',
    content: {
      type: 'grammar_correction',
      sentences: [
        { sentence: 'Me and him went to the store.', corrected: 'He and I went to the store.' },
        { sentence: 'The dog wagged it\'s tail.', corrected: 'The dog wagged its tail.' },
        { sentence: 'She don\'t like vegetables.', corrected: 'She doesn\'t like vegetables.' }
      ]
    },
    isPremium: true,
    estimatedTime: 7,
    tags: ['grammar', 'correction', 'language'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // History Activities
  {
    id: 'history_001',
    title: 'Ancient Civilizations',
    description: 'Learn about ancient Egypt, Greece, and Rome',
    subject: 'History',
    difficulty: 'beginner',
    type: 'quiz',
    content: {
      type: 'history_timeline',
      questions: [
        { question: 'Which ancient civilization built the pyramids?', options: ['Greece', 'Egypt', 'Rome', 'China'], correct: 'Egypt' },
        { question: 'What was the main purpose of the Great Wall of China?', options: ['Decoration', 'Defense', 'Trade', 'Religion'], correct: 'Defense' },
        { question: 'Who was the first emperor of Rome?', options: ['Julius Caesar', 'Augustus', 'Nero', 'Constantine'], correct: 'Augustus' }
      ]
    },
    isPremium: false,
    estimatedTime: 5,
    tags: ['ancient-history', 'civilizations', 'timeline'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Art Activities
  {
    id: 'art_001',
    title: 'Color Theory',
    description: 'Learn about primary, secondary, and complementary colors',
    subject: 'Art',
    difficulty: 'beginner',
    type: 'game',
    content: {
      type: 'color_mixing',
      exercises: [
        { primary: 'Red', secondary: 'Blue', result: 'Purple' },
        { primary: 'Yellow', secondary: 'Blue', result: 'Green' },
        { primary: 'Red', secondary: 'Yellow', result: 'Orange' }
      ]
    },
    isPremium: false,
    estimatedTime: 4,
    tags: ['colors', 'theory', 'mixing'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Music Activities
  {
    id: 'music_001',
    title: 'Musical Notes',
    description: 'Learn to read basic musical notation',
    subject: 'Music',
    difficulty: 'beginner',
    type: 'exercise',
    content: {
      type: 'note_reading',
      notes: [
        { note: 'C', position: 'first-line', sound: 'audio/c-note.mp3' },
        { note: 'D', position: 'first-space', sound: 'audio/d-note.mp3' },
        { note: 'E', position: 'second-line', sound: 'audio/e-note.mp3' }
      ]
    },
    isPremium: true,
    estimatedTime: 8,
    tags: ['music-theory', 'notation', 'reading'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Physical Education Activities
  {
    id: 'pe_001',
    title: 'Fitness Challenge',
    description: 'Complete a series of physical exercises',
    subject: 'Physical Education',
    difficulty: 'beginner',
    type: 'challenge',
    content: {
      type: 'fitness_circuit',
      exercises: [
        { name: 'Jumping Jacks', duration: 30, reps: 10 },
        { name: 'Push-ups', duration: 20, reps: 5 },
        { name: 'Squats', duration: 25, reps: 8 },
        { name: 'Plank', duration: 15, reps: 1 }
      ]
    },
    isPremium: false,
    estimatedTime: 10,
    tags: ['fitness', 'exercise', 'health'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Additional Math Activities
  {
    id: 'math_004',
    title: 'Geometry Explorer',
    description: 'Learn about shapes, angles, and geometric properties',
    subject: 'Math',
    difficulty: 'intermediate',
    type: 'game',
    content: {
      type: 'geometry_quiz',
      questions: [
        { question: 'How many sides does a hexagon have?', options: ['4', '5', '6', '7'], correct: '6' },
        { question: 'What is the sum of angles in a triangle?', options: ['90°', '180°', '270°', '360°'], correct: '180°' },
        { question: 'Which shape has all sides equal and all angles 90°?', options: ['Rhombus', 'Square', 'Rectangle', 'Parallelogram'], correct: 'Square' },
        { question: 'What is the area of a circle with radius 3?', options: ['6π', '9π', '12π', '15π'], correct: '9π' }
      ]
    },
    isPremium: false,
    estimatedTime: 6,
    tags: ['geometry', 'shapes', 'angles'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'math_005',
    title: 'Probability Puzzle',
    description: 'Solve probability problems and understand chance',
    subject: 'Math',
    difficulty: 'advanced',
    type: 'exercise',
    content: {
      type: 'probability_calculation',
      problems: [
        { question: 'What is the probability of rolling a 6 on a fair die?', answer: '1/6', explanation: 'One favorable outcome out of six possible outcomes' },
        { question: 'If you flip a coin twice, what is the probability of getting heads both times?', answer: '1/4', explanation: '1/2 × 1/2 = 1/4' },
        { question: 'In a deck of 52 cards, what is the probability of drawing a heart?', answer: '13/52', explanation: '13 hearts out of 52 total cards' }
      ]
    },
    isPremium: true,
    estimatedTime: 8,
    tags: ['probability', 'statistics', 'chance'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Additional Science Activities
  {
    id: 'science_003',
    title: 'Solar System Explorer',
    description: 'Learn about planets, stars, and space exploration',
    subject: 'Science',
    difficulty: 'beginner',
    type: 'quiz',
    content: {
      type: 'space_quiz',
      questions: [
        { question: 'Which planet is closest to the Sun?', options: ['Earth', 'Venus', 'Mercury', 'Mars'], correct: 'Mercury' },
        { question: 'What is the largest planet in our solar system?', options: ['Earth', 'Jupiter', 'Saturn', 'Neptune'], correct: 'Jupiter' },
        { question: 'What is the name of our galaxy?', options: ['Andromeda', 'Milky Way', 'Orion', 'Pegasus'], correct: 'Milky Way' },
        { question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 'Mars' }
      ]
    },
    isPremium: false,
    estimatedTime: 5,
    tags: ['astronomy', 'planets', 'space'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'science_004',
    title: 'Human Body Systems',
    description: 'Explore the different systems that keep us alive',
    subject: 'Science',
    difficulty: 'intermediate',
    type: 'exercise',
    content: {
      type: 'body_systems_matching',
      systems: [
        { system: 'Circulatory', organs: ['Heart', 'Blood vessels', 'Blood'], function: 'Transports oxygen and nutrients' },
        { system: 'Respiratory', organs: ['Lungs', 'Trachea', 'Diaphragm'], function: 'Brings oxygen into the body' },
        { system: 'Digestive', organs: ['Stomach', 'Intestines', 'Liver'], function: 'Breaks down food for energy' },
        { system: 'Nervous', organs: ['Brain', 'Spinal cord', 'Nerves'], function: 'Controls body functions and thoughts' }
      ]
    },
    isPremium: true,
    estimatedTime: 10,
    tags: ['biology', 'anatomy', 'human-body'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Additional Reading Activities
  {
    id: 'reading_003',
    title: 'Speed Reading Challenge',
    description: 'Improve your reading speed and comprehension',
    subject: 'Reading',
    difficulty: 'intermediate',
    type: 'challenge',
    content: {
      type: 'speed_reading',
      passages: [
        {
          text: 'The ancient pyramids of Egypt stand as magnificent monuments to human ingenuity and determination. Built over 4,500 years ago, these massive structures were constructed without modern machinery, using only simple tools and the strength of thousands of workers.',
          questions: [
            { question: 'How old are the pyramids?', answer: 'Over 4,500 years old' },
            { question: 'What were the pyramids built without?', answer: 'Modern machinery' },
            { question: 'Who built the pyramids?', answer: 'Thousands of workers' }
          ]
        }
      ],
      timeLimit: 60
    },
    isPremium: true,
    estimatedTime: 7,
    tags: ['speed-reading', 'comprehension', 'focus'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Additional Writing Activities
  {
    id: 'writing_003',
    title: 'Poetry Workshop',
    description: 'Learn to write different types of poetry',
    subject: 'Writing',
    difficulty: 'intermediate',
    type: 'exercise',
    content: {
      type: 'poetry_writing',
      forms: [
        {
          type: 'Haiku',
          description: 'A 3-line poem with 5-7-5 syllables',
          example: 'Old pond, a frog jumps in, the sound of water',
          prompt: 'Write a haiku about nature'
        },
        {
          type: 'Limerick',
          description: 'A 5-line poem with AABBA rhyme scheme',
          example: 'There once was a cat from Peru, Who dreamed of eating a shoe, He ate it with glee, Then climbed up a tree, And now he has nothing to do.',
          prompt: 'Write a limerick about an animal'
        }
      ]
    },
    isPremium: false,
    estimatedTime: 12,
    tags: ['poetry', 'creative-writing', 'rhyme'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Additional History Activities
  {
    id: 'history_002',
    title: 'World War II Timeline',
    description: 'Learn about key events and figures of WWII',
    subject: 'History',
    difficulty: 'intermediate',
    type: 'exercise',
    content: {
      type: 'timeline_ordering',
      events: [
        { year: 1939, event: 'Germany invades Poland', description: 'Start of World War II in Europe' },
        { year: 1941, event: 'Pearl Harbor attack', description: 'United States enters the war' },
        { year: 1944, event: 'D-Day invasion', description: 'Allied forces land in Normandy' },
        { year: 1945, event: 'Atomic bombs dropped', description: 'Japan surrenders, war ends' }
      ]
    },
    isPremium: true,
    estimatedTime: 8,
    tags: ['world-war-ii', 'timeline', '20th-century'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Additional Art Activities
  {
    id: 'art_002',
    title: 'Perspective Drawing',
    description: 'Learn the basics of 3D drawing and perspective',
    subject: 'Art',
    difficulty: 'intermediate',
    type: 'exercise',
    content: {
      type: 'drawing_tutorial',
      steps: [
        { step: 1, instruction: 'Draw a horizon line across your paper', tip: 'This represents eye level' },
        { step: 2, instruction: 'Place a vanishing point on the horizon', tip: 'All lines will converge here' },
        { step: 3, instruction: 'Draw a square or rectangle', tip: 'This will become your 3D object' },
        { step: 4, instruction: 'Connect corners to the vanishing point', tip: 'These are your perspective lines' }
      ]
    },
    isPremium: true,
    estimatedTime: 15,
    tags: ['drawing', 'perspective', '3d-art'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Additional Music Activities
  {
    id: 'music_002',
    title: 'Rhythm Master',
    description: 'Learn to read and play different rhythms',
    subject: 'Music',
    difficulty: 'intermediate',
    type: 'game',
    content: {
      type: 'rhythm_tapping',
      patterns: [
        { name: 'Basic Beat', pattern: '1-2-3-4', description: 'Four equal beats' },
        { name: 'Waltz', pattern: '1-2-3', description: 'Three beats per measure' },
        { name: 'Syncopation', pattern: '1-and-2-and-3-and-4-and', description: 'Off-beat emphasis' }
      ]
    },
    isPremium: false,
    estimatedTime: 6,
    tags: ['rhythm', 'music-theory', 'timing'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Additional Physical Education Activities
  {
    id: 'pe_002',
    title: 'Yoga Flow',
    description: 'Learn basic yoga poses and breathing techniques',
    subject: 'Physical Education',
    difficulty: 'beginner',
    type: 'exercise',
    content: {
      type: 'yoga_sequence',
      poses: [
        { name: 'Mountain Pose', duration: 30, benefits: 'Improves posture and balance' },
        { name: 'Downward Dog', duration: 45, benefits: 'Strengthens arms and legs' },
        { name: 'Child\'s Pose', duration: 60, benefits: 'Relaxes back and shoulders' },
        { name: 'Warrior I', duration: 30, benefits: 'Builds leg strength and focus' }
      ]
    },
    isPremium: false,
    estimatedTime: 12,
    tags: ['yoga', 'flexibility', 'mindfulness'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Critical Thinking Activities
  {
    id: 'thinking_001',
    title: 'Logic Puzzles',
    description: 'Solve brain teasers and improve logical reasoning',
    subject: 'Critical Thinking',
    difficulty: 'intermediate',
    type: 'challenge',
    content: {
      type: 'logic_puzzle',
      puzzles: [
        {
          scenario: 'Three people are in a room: Alice, Bob, and Charlie. Alice always tells the truth, Bob always lies, and Charlie sometimes tells the truth and sometimes lies. Alice says "Bob is lying." Bob says "Charlie is lying." Charlie says "Alice is telling the truth." Who is telling the truth?',
          answer: 'Alice and Charlie',
          explanation: 'Alice tells the truth about Bob lying, Bob lies about Charlie lying, and Charlie tells the truth about Alice telling the truth.'
        }
      ]
    },
    isPremium: true,
    estimatedTime: 10,
    tags: ['logic', 'reasoning', 'puzzle'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Technology Activities
  {
    id: 'tech_001',
    title: 'Coding Basics',
    description: 'Learn fundamental programming concepts',
    subject: 'Technology',
    difficulty: 'beginner',
    type: 'exercise',
    content: {
      type: 'coding_concepts',
      concepts: [
        {
          concept: 'Variables',
          description: 'Containers that store data',
          example: 'name = "John"',
          practice: 'Create a variable for your age'
        },
        {
          concept: 'Loops',
          description: 'Repeat actions multiple times',
          example: 'for i in range(5): print(i)',
          practice: 'Write a loop that counts from 1 to 10'
        }
      ]
    },
    isPremium: true,
    estimatedTime: 12,
    tags: ['programming', 'coding', 'computer-science'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Activity management functions
export class ActivityManager {
  private static instance: ActivityManager;
  
  private constructor() {
    this.initializeActivities();
  }
  
  static getInstance(): ActivityManager {
    if (!ActivityManager.instance) {
      ActivityManager.instance = new ActivityManager();
    }
    return ActivityManager.instance;
  }

  // Initialize activities in localStorage
  private initializeActivities(): void {
    ACTIVITIES.forEach(activity => {
      const key = `activity_${activity.id}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(activity));
      }
    });
  }

  // Get all activities
  getAllActivities(): LearningActivity[] {
    return ACTIVITIES;
  }

  // Get activities by subject
  getActivitiesBySubject(subject: string): LearningActivity[] {
    return ACTIVITIES.filter(activity => activity.subject === subject);
  }

  // Get activities by difficulty
  getActivitiesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): LearningActivity[] {
    return ACTIVITIES.filter(activity => activity.difficulty === difficulty);
  }

  // Get free activities only
  getFreeActivities(): LearningActivity[] {
    return ACTIVITIES.filter(activity => !activity.isPremium);
  }

  // Get premium activities only
  getPremiumActivities(): LearningActivity[] {
    return ACTIVITIES.filter(activity => activity.isPremium);
  }

  // Get random activity
  getRandomActivity(subject?: string, difficulty?: string): LearningActivity {
    let filtered = ACTIVITIES;
    
    if (subject) {
      filtered = filtered.filter(activity => activity.subject === subject);
    }
    
    if (difficulty) {
      filtered = filtered.filter(activity => activity.difficulty === difficulty);
    }
    
    if (filtered.length === 0) {
      return ACTIVITIES[0]; // Fallback to first activity
    }
    
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  }

  // Get activity by ID
  getActivityById(id: string): LearningActivity | undefined {
    return ACTIVITIES.find(activity => activity.id === id);
  }

  // Get recommended activities based on user history
  getRecommendedActivities(userId: string, limit: number = 3): LearningActivity[] {
    // This would typically analyze user history and preferences
    // For now, return random activities
    const recommendations: LearningActivity[] = [];
    const usedIds = new Set<string>();
    
    while (recommendations.length < limit && recommendations.length < ACTIVITIES.length) {
      const activity = this.getRandomActivity();
      if (!usedIds.has(activity.id)) {
        recommendations.push(activity);
        usedIds.add(activity.id);
      }
    }
    
    return recommendations;
  }

  // Get activities for daily challenge
  getDailyChallenge(): LearningActivity[] {
    // Return one activity from each subject for variety
    const subjects = ['Math', 'Science', 'Reading', 'Writing', 'History', 'Art', 'Music', 'Physical Education'];
    const challenge: LearningActivity[] = [];
    
    subjects.forEach(subject => {
      const subjectActivities = this.getActivitiesBySubject(subject);
      if (subjectActivities.length > 0) {
        const randomActivity = subjectActivities[Math.floor(Math.random() * subjectActivities.length)];
        challenge.push(randomActivity);
      }
    });
    
    return challenge.slice(0, 3); // Return 3 activities for daily limit
  }
}

// Export singleton instance
export const activityManager = ActivityManager.getInstance(); 