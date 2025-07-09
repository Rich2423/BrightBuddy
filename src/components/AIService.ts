// AI Service for BrightBuddy - OpenAI Integration
// This service provides intelligent, personalized responses while maintaining privacy and safety

export interface AIUserContext {
  recentMood: number;
  stressLevel: number;
  favoriteSubjects: string[];
  goals: string[];
  challenges: string[];
  learningStreak: number;
  totalEntries: number;
  age?: number;
  grade?: string;
}

export interface AILearningSuggestion {
  title: string;
  description: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'challenging';
  estimatedTime: string;
  whyRecommended: string;
  moodBoost: boolean;
}

export interface AIJournalAnalysis {
  encouragingObservation: string;
  learningInsight: string;
  growthSuggestion: string;
  sentiment: 'positive' | 'neutral' | 'concerned';
  topics: string[];
  confidence: number;
}

export interface AIMotivationalContent {
  message: string;
  type: 'encouragement' | 'celebration' | 'support' | 'challenge';
  context: string;
  actionable: boolean;
}

export interface AIReflectionPrompt {
  question: string;
  followUp?: string;
  category: 'learning' | 'wellness' | 'goals' | 'growth';
  difficulty: 'easy' | 'medium' | 'deep';
}

// Safety and content filtering (for future use)
// const SAFETY_FILTERS = {
//   inappropriateWords: ['inappropriate', 'unsafe', 'harmful'],
//   ageAppropriate: true,
//   educationalFocus: true,
//   mentalHealthSensitive: true
// };

// Cache for similar requests to reduce API calls
const responseCache = new Map<string, any>();

// API Configuration
const AI_CONFIG = {
  model: 'gpt-4o-mini',
  maxTokens: 150,
  temperature: 0.7,
  maxRequestsPerMinute: 10,
  maxRequestsPerDay: 100
};

// Request tracking for rate limiting
let requestCount = 0;
let lastRequestTime = Date.now();

// Core AI Functions
export class AIService {
  private static instance: AIService;
  private apiKey: string | null = null;

  private constructor() {
    // Initialize with environment variable
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || null;
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Set API key (for client-side usage)
  public setApiKey(key: string): void {
    this.apiKey = key;
  }

  // Check if AI is available
  public isAvailable(): boolean {
    return !!this.apiKey;
  }

  // Rate limiting check
  private checkRateLimit(): boolean {
    const now = Date.now();
    const timeDiff = now - lastRequestTime;
    
    if (timeDiff < 60000) { // Within 1 minute
      if (requestCount >= AI_CONFIG.maxRequestsPerMinute) {
        return false;
      }
    } else {
      requestCount = 0;
    }
    
    requestCount++;
    lastRequestTime = now;
    return true;
  }

  // Generate cache key for requests
  private generateCacheKey(prompt: string, context: any): string {
    return btoa(JSON.stringify({ prompt, context }));
  }

  // Make API call with error handling
  private async makeAPICall(prompt: string, systemPrompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: AI_CONFIG.maxTokens,
          temperature: AI_CONFIG.temperature
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI API call failed:', error);
      throw error;
    }
  }

  // Generate personalized learning suggestions
  public async generateLearningSuggestions(context: AIUserContext): Promise<AILearningSuggestion[]> {
    const cacheKey = this.generateCacheKey('learning_suggestions', context);
    
    if (responseCache.has(cacheKey)) {
      return responseCache.get(cacheKey);
    }

    const systemPrompt = `You are a supportive learning companion for students. Generate 3 personalized learning suggestions that are:
    - Age-appropriate and encouraging
    - Based on the student's current mood and stress level
    - Focused on their favorite subjects and goals
    - Educational and safe
    - Under 100 words each
    
    Format each suggestion as: title|description|subject|difficulty|time|why|moodboost
    Separate suggestions with "|||"`;

    const userPrompt = `Student Context:
    - Recent mood: ${context.recentMood}/5
    - Stress level: ${context.stressLevel}/5
    - Favorite subjects: ${context.favoriteSubjects.join(', ')}
    - Learning goals: ${context.goals.join(', ')}
    - Recent challenges: ${context.challenges.join(', ')}
    - Learning streak: ${context.learningStreak} days
    - Total entries: ${context.totalEntries}
    
    Generate 3 personalized learning suggestions.`;

    try {
      const response = await this.makeAPICall(userPrompt, systemPrompt);
      const suggestions = this.parseLearningSuggestions(response);
      
      responseCache.set(cacheKey, suggestions);
      return suggestions;
    } catch (error) {
      console.error('Failed to generate learning suggestions:', error);
      return this.getFallbackSuggestions(context);
    }
  }

  // Analyze journal entry
  public async analyzeJournalEntry(entryText: string, userHistory: any): Promise<AIJournalAnalysis> {
    const cacheKey = this.generateCacheKey('journal_analysis', { entryText, userHistory });
    
    if (responseCache.has(cacheKey)) {
      return responseCache.get(cacheKey);
    }

    const systemPrompt = `You are a supportive learning companion analyzing a student's journal entry. Provide:
    1. One encouraging observation (positive reinforcement)
    2. One learning insight (educational value)
    3. One gentle suggestion for growth (constructive feedback)
    
    Keep each response under 50 words, age-appropriate, and educational. Be encouraging and supportive.`;

    const userPrompt = `Journal Entry: "${entryText}"
    
    Student History:
    - Total entries: ${userHistory.totalEntries}
    - Average mood: ${userHistory.averageMood}/5
    - Favorite subjects: ${userHistory.favoriteSubjects.join(', ')}
    
    Analyze this entry and provide supportive insights.`;

    try {
      const response = await this.makeAPICall(userPrompt, systemPrompt);
      const analysis = this.parseJournalAnalysis(response);
      
      responseCache.set(cacheKey, analysis);
      return analysis;
    } catch (error) {
      console.error('Failed to analyze journal entry:', error);
      return this.getFallbackJournalAnalysis();
    }
  }

  // Generate motivational content
  public async generateMotivationalContent(context: AIUserContext, type: 'encouragement' | 'celebration' | 'support'): Promise<AIMotivationalContent> {
    const cacheKey = this.generateCacheKey('motivational', { context, type });
    
    if (responseCache.has(cacheKey)) {
      return responseCache.get(cacheKey);
    }

    const systemPrompt = `You are a supportive learning companion creating motivational content for students. Generate:
    - Encouraging, age-appropriate messages
    - Educational focus
    - Positive reinforcement
    - Under 80 words
    
    Be supportive, educational, and inspiring.`;

    const userPrompt = `Create a ${type} message for a student with:
    - Mood: ${context.recentMood}/5
    - Stress: ${context.stressLevel}/5
    - Streak: ${context.learningStreak} days
    - Goals: ${context.goals.join(', ')}
    
    Make it encouraging and relevant to their current situation.`;

    try {
      const response = await this.makeAPICall(userPrompt, systemPrompt);
      const content = this.parseMotivationalContent(response, type);
      
      responseCache.set(cacheKey, content);
      return content;
    } catch (error) {
      console.error('Failed to generate motivational content:', error);
      return this.getFallbackMotivationalContent(type);
    }
  }

  // Generate personalized reflection prompts
  public async generateReflectionPrompts(context: AIUserContext, category: string): Promise<AIReflectionPrompt[]> {
    const cacheKey = this.generateCacheKey('reflection_prompts', { context, category });
    
    if (responseCache.has(cacheKey)) {
      return responseCache.get(cacheKey);
    }

    const systemPrompt = `You are a supportive learning companion creating reflection prompts for students. Generate:
    - Age-appropriate questions
    - Educational focus
    - Encouraging tone
    - Under 60 words each
    
    Format as: question|followup|category|difficulty
    Separate prompts with "|||"`;

    const userPrompt = `Create 3 ${category} reflection prompts for a student with:
    - Mood: ${context.recentMood}/5
    - Stress: ${context.stressLevel}/5
    - Subjects: ${context.favoriteSubjects.join(', ')}
    - Goals: ${context.goals.join(', ')}
    
    Make them relevant and encouraging.`;

    try {
      const response = await this.makeAPICall(userPrompt, systemPrompt);
      const prompts = this.parseReflectionPrompts(response);
      
      responseCache.set(cacheKey, prompts);
      return prompts;
    } catch (error) {
      console.error('Failed to generate reflection prompts:', error);
      return this.getFallbackReflectionPrompts(category);
    }
  }

  // Parse AI responses
  private parseLearningSuggestions(response: string): AILearningSuggestion[] {
    try {
      const suggestions = response.split('|||').map(s => {
        const [title, description, subject, difficulty, time, why, moodboost] = s.split('|');
        return {
          title: title?.trim() || 'Learning Activity',
          description: description?.trim() || 'A great learning opportunity',
          subject: subject?.trim() || 'General',
          difficulty: (difficulty?.trim() as any) || 'medium',
          estimatedTime: time?.trim() || '15-30 minutes',
          whyRecommended: why?.trim() || 'This will help you learn and grow',
          moodBoost: moodboost?.toLowerCase().includes('yes') || false
        };
      });
      return suggestions.slice(0, 3);
    } catch (error) {
      console.error('Failed to parse learning suggestions:', error);
      return [];
    }
  }

  private parseJournalAnalysis(response: string): AIJournalAnalysis {
    try {
      const lines = response.split('\n').filter(line => line.trim());
      return {
        encouragingObservation: lines[0]?.replace(/^[0-9]+\.?\s*/, '') || 'Great work on your learning journey!',
        learningInsight: lines[1]?.replace(/^[0-9]+\.?\s*/, '') || 'You\'re making excellent progress',
        growthSuggestion: lines[2]?.replace(/^[0-9]+\.?\s*/, '') || 'Keep exploring new subjects',
        sentiment: 'positive',
        topics: ['learning', 'growth'],
        confidence: 0.8
      };
    } catch (error) {
      console.error('Failed to parse journal analysis:', error);
      return this.getFallbackJournalAnalysis();
    }
  }

  private parseMotivationalContent(response: string, type: string): AIMotivationalContent {
    return {
      message: response.trim() || 'You\'re doing great! Keep up the amazing work!',
      type: type as any,
      context: 'AI-generated motivation',
      actionable: true
    };
  }

  private parseReflectionPrompts(response: string): AIReflectionPrompt[] {
    try {
      const prompts = response.split('|||').map(p => {
        const [question, followup, category, difficulty] = p.split('|');
        return {
          question: question?.trim() || 'How are you feeling about your learning today?',
          followUp: followup?.trim(),
          category: (category?.trim() as any) || 'learning',
          difficulty: (difficulty?.trim() as any) || 'easy'
        };
      });
      return prompts.slice(0, 3);
    } catch (error) {
      console.error('Failed to parse reflection prompts:', error);
      return [];
    }
  }

  // Fallback responses when AI is unavailable
  private getFallbackSuggestions(context: AIUserContext): AILearningSuggestion[] {
    return [
      {
        title: 'Explore Your Favorite Subject',
        description: 'Dive deeper into something you love learning about',
        subject: context.favoriteSubjects[0] || 'General',
        difficulty: 'easy',
        estimatedTime: '20-30 minutes',
        whyRecommended: 'Learning about what you enjoy can boost your mood and motivation',
        moodBoost: true
      },
      {
        title: 'Try Something New',
        description: 'Challenge yourself with a new learning activity',
        subject: 'Exploration',
        difficulty: 'medium',
        estimatedTime: '15-45 minutes',
        whyRecommended: 'New experiences help you grow and discover new interests',
        moodBoost: true
      },
      {
        title: 'Review and Reflect',
        description: 'Look back on what you\'ve learned recently',
        subject: 'Reflection',
        difficulty: 'easy',
        estimatedTime: '10-15 minutes',
        whyRecommended: 'Reflecting on your progress helps you see how far you\'ve come',
        moodBoost: true
      }
    ];
  }

  private getFallbackJournalAnalysis(): AIJournalAnalysis {
    return {
      encouragingObservation: 'Great job taking time to reflect on your learning!',
      learningInsight: 'Every entry helps you understand your learning journey better',
      growthSuggestion: 'Keep exploring and asking questions - that\'s how we learn best',
      sentiment: 'positive',
      topics: ['learning', 'reflection'],
      confidence: 0.7
    };
  }

  private getFallbackMotivationalContent(type: string): AIMotivationalContent {
    const messages = {
      encouragement: 'You\'re doing amazing! Every step forward is progress worth celebrating.',
      celebration: 'Congratulations on your achievements! You\'re shining bright!',
      support: 'Remember, learning is a journey. You\'re not alone, and you\'re doing great!'
    };

    return {
      message: messages[type as keyof typeof messages] || messages.encouragement,
      type: type as any,
      context: 'fallback motivation',
      actionable: true
    };
  }

  private getFallbackReflectionPrompts(category: string): AIReflectionPrompt[] {
    const prompts = {
      learning: [
        { question: 'What was the most interesting thing you learned today?', category: 'learning' as const, difficulty: 'easy' as const },
        { question: 'How did you feel about your learning progress this week?', category: 'learning' as const, difficulty: 'medium' as const },
        { question: 'What would you like to explore more deeply?', category: 'learning' as const, difficulty: 'easy' as const }
      ],
      wellness: [
        { question: 'How are you feeling about your stress levels today?', category: 'wellness' as const, difficulty: 'easy' as const },
        { question: 'What helped you feel better when you were stressed?', category: 'wellness' as const, difficulty: 'medium' as const },
        { question: 'How can you take care of yourself tomorrow?', category: 'wellness' as const, difficulty: 'easy' as const }
      ],
      goals: [
        { question: 'What learning goal are you most excited about?', category: 'goals' as const, difficulty: 'easy' as const },
        { question: 'What steps can you take toward your goals this week?', category: 'goals' as const, difficulty: 'medium' as const },
        { question: 'How have your goals changed since you started?', category: 'goals' as const, difficulty: 'deep' as const }
      ]
    };

    return prompts[category as keyof typeof prompts] || prompts.learning;
  }

  // Clear cache
  public clearCache(): void {
    responseCache.clear();
  }

  // Get usage statistics
  public getUsageStats(): { requestsToday: number; requestsThisMinute: number } {
    return {
      requestsToday: requestCount,
      requestsThisMinute: requestCount
    };
  }
}

// Export singleton instance
export const aiService = AIService.getInstance(); 