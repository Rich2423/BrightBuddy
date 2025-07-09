export interface JournalEntry {
  id: string;
  date: string;
  mood: number;
  stress: number;
  learningNote: string;
  subject: string;
  voiceNote?: string;
  photo?: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  age?: number;
  grade?: string;
}

export const subjects = [
  'Math', 'Science', 'Reading', 'Writing', 'History', 
  'Art', 'Music', 'Physical Education', 'Social Studies', 'Technology'
];

export const moodEmojis = ['😢', '😕', '😐', '🙂', '😄'];
export const stressLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];

export const subjectColors = [
  'bg-purple-100 text-purple-800',
  'bg-green-100 text-green-800', 
  'bg-blue-100 text-blue-800',
  'bg-yellow-100 text-yellow-800',
  'bg-red-100 text-red-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-orange-100 text-orange-800',
  'bg-teal-100 text-teal-800',
  'bg-gray-100 text-gray-800'
];

export const stressColors = [
  'bg-green-100 text-green-800', 
  'bg-blue-100 text-blue-800', 
  'bg-yellow-100 text-yellow-800', 
  'bg-orange-100 text-orange-800', 
  'bg-red-100 text-red-800'
];

// Sample data for testing
export const sampleEntries: JournalEntry[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    mood: 5,
    stress: 2,
    learningNote: 'Today I learned about fractions in math class! It was really fun when we used pizza slices to understand how fractions work. I feel like I really understand it now. The teacher made it so easy to understand by showing us real examples.',
    subject: 'Math',
    timestamp: Date.now()
  },
  {
    id: '2',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mood: 4,
    stress: 3,
    learningNote: 'We did a science experiment with plants today. We put one plant in the sun and one in the dark to see how they grow differently. It was so cool to watch! I learned that plants need sunlight to make their own food.',
    subject: 'Science',
    timestamp: Date.now() - 24 * 60 * 60 * 1000
  },
  {
    id: '3',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mood: 3,
    stress: 4,
    learningNote: 'Reading class was a bit challenging today. We read a story about a brave knight, but some of the words were hard to understand. I asked for help though! The story was about courage and helping others.',
    subject: 'Reading',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000
  },
  {
    id: '4',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mood: 5,
    stress: 1,
    learningNote: 'Art class was amazing! We learned how to mix colors and I made a beautiful rainbow painting. I love when we get to be creative! The teacher showed us how red and blue make purple.',
    subject: 'Art',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000
  },
  {
    id: '5',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mood: 4,
    stress: 2,
    learningNote: 'Today we learned about ancient Egypt in history! The pyramids are so fascinating. I want to learn more about how they built them. The pharaohs were like kings and queens.',
    subject: 'History',
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000
  },
  {
    id: '6',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mood: 5,
    stress: 1,
    learningNote: 'Math class was super fun today! We learned about multiplication tables. I practiced the 5 times table and got them all right! My teacher gave me a sticker for doing so well.',
    subject: 'Math',
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000
  },
  {
    id: '7',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mood: 4,
    stress: 2,
    learningNote: 'We learned about the water cycle in science today. It was like a big circle - water goes up as vapor, makes clouds, then comes back down as rain! I drew a picture of it.',
    subject: 'Science',
    timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000
  },
  {
    id: '8',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mood: 5,
    stress: 1,
    learningNote: 'Writing class was great! We learned how to write a story with a beginning, middle, and end. I wrote a story about a magical cat that could fly. My friends liked it!',
    subject: 'Writing',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000
  },
  {
    id: '9',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mood: 3,
    stress: 3,
    learningNote: 'Today we learned about computers in technology class. We learned how to type faster and use different programs. It was a bit hard at first but I got better with practice.',
    subject: 'Technology',
    timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000
  },
  {
    id: '10',
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mood: 5,
    stress: 1,
    learningNote: 'Music class was so much fun! We learned a new song and played different instruments. I played the xylophone and it sounded beautiful. Music makes me happy!',
    subject: 'Music',
    timestamp: Date.now() - 9 * 24 * 60 * 60 * 1000
  }
];

export const sampleProfile: UserProfile = {
  name: 'Alex',
  age: 10,
  grade: '5th Grade'
};

// Utility functions
export const getSubjectColor = (subject: string) => {
  const index = subjects.indexOf(subject);
  return index >= 0 ? subjectColors[index] : 'bg-gray-100 text-gray-800';
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getStreak = (entries: JournalEntry[]) => {
  if (entries.length === 0) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let streak = 0;
  let currentDate = new Date();
  
  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].date);
    const diffTime = currentDate.getTime() - entryDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getWeeklyStats = (entries: JournalEntry[]) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const weeklyEntries = entries.filter(entry => 
    new Date(entry.date) >= oneWeekAgo
  );
  
  const subjectCounts: { [key: string]: number } = {};
  let totalMood = 0;
  
  weeklyEntries.forEach(entry => {
    subjectCounts[entry.subject] = (subjectCounts[entry.subject] || 0) + 1;
    totalMood += entry.mood;
  });
  
  const mostFrequentSubject = Object.keys(subjectCounts).length > 0 
    ? Object.keys(subjectCounts).reduce((a, b) => subjectCounts[a] > subjectCounts[b] ? a : b)
    : 'None';
  
  const averageMood = weeklyEntries.length > 0 ? Math.round(totalMood / weeklyEntries.length) : 0;
  
  return {
    count: weeklyEntries.length,
    mostFrequentSubject,
    averageMood
  };
};

// Initialize sample data (for development/testing)
export const initializeSampleData = () => {
  if (typeof window === 'undefined') return;
  
  const existingEntries = localStorage.getItem('journalEntries');
  const existingProfile = localStorage.getItem('userProfile');
  
  if (!existingEntries) {
    localStorage.setItem('journalEntries', JSON.stringify(sampleEntries));
  }
  
  if (!existingProfile) {
    localStorage.setItem('userProfile', JSON.stringify(sampleProfile));
  }
}; 