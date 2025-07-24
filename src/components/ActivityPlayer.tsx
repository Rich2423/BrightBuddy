'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../utils/AuthContext'
import { freemiumSystem, FREEMIUM_CONFIG } from '../utils/FreemiumSystem'
import { LearningActivity, UserProgress } from '../utils/FreemiumSystem'
import { activityManager } from '../utils/ActivityDatabase'

interface ActivityPlayerProps {
  activity: LearningActivity
  onComplete: (progress: UserProgress) => void
  onClose: () => void
}

export default function ActivityPlayer({ activity, onComplete, onClose }: ActivityPlayerProps) {
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [score, setScore] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [canPerform, setCanPerform] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkPermission = async () => {
      if (user) {
        const permission = await freemiumSystem.canPerformActivity(user.id)
        setCanPerform(permission.canPerform)
        setLoading(false)
      }
    }
    
    checkPermission()
    
    // Start timer
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [user])

  const handleAnswer = (answer: any) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)
    
    // Calculate score based on activity type
    let questionScore = 0
    const question = getCurrentQuestion()
    
    if (question && 'correct' in question) {
      questionScore = answer === question.correct ? 100 : 0
    } else if (question && 'answer' in question) {
      questionScore = answer === question.answer ? 100 : 0
    }
    
    setScore(prev => prev + questionScore)
    
    // Move to next question or complete
    if (currentQuestion < getTotalQuestions() - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      completeActivity()
    }
  }

  const getCurrentQuestion = () => {
    if (!activity.content) return null
    
    switch (activity.content.type) {
      case 'fraction_matching':
      case 'multiple_choice':
      case 'history_timeline':
      case 'space_quiz':
      case 'geometry_quiz':
        return activity.content.questions[currentQuestion]
      case 'multiplication_timed':
        return activity.content.questions[currentQuestion]
      case 'algebra_solving':
        return activity.content.equations[currentQuestion]
      case 'chemical_balancing':
        return activity.content.reactions[currentQuestion]
      case 'reading_comprehension':
        return activity.content.questions[currentQuestion]
      case 'vocabulary_matching':
        return activity.content.words[currentQuestion]
      case 'grammar_correction':
        return activity.content.sentences[currentQuestion]
      case 'color_mixing':
        return activity.content.exercises[currentQuestion]
      case 'note_reading':
        return activity.content.notes[currentQuestion]
      case 'fitness_circuit':
      case 'yoga_sequence':
        return activity.content.exercises[currentQuestion]
      case 'probability_calculation':
        return activity.content.problems[currentQuestion]
      case 'body_systems_matching':
        return activity.content.systems[currentQuestion]
      case 'speed_reading':
        return activity.content.passages[currentQuestion]
      case 'poetry_writing':
        return activity.content.forms[currentQuestion]
      case 'timeline_ordering':
        return activity.content.events[currentQuestion]
      case 'drawing_tutorial':
        return activity.content.steps[currentQuestion]
      case 'rhythm_tapping':
        return activity.content.patterns[currentQuestion]
      case 'logic_puzzle':
        return activity.content.puzzles[currentQuestion]
      case 'coding_concepts':
        return activity.content.concepts[currentQuestion]
      default:
        return null
    }
  }

  const getTotalQuestions = (): number => {
    if (!activity.content) return 0
    
    switch (activity.content.type) {
      case 'fraction_matching':
      case 'multiple_choice':
      case 'history_timeline':
      case 'space_quiz':
      case 'geometry_quiz':
        return activity.content.questions.length
      case 'multiplication_timed':
        return activity.content.questions.length
      case 'algebra_solving':
        return activity.content.equations.length
      case 'chemical_balancing':
        return activity.content.reactions.length
      case 'reading_comprehension':
        return activity.content.questions.length
      case 'vocabulary_matching':
        return activity.content.words.length
      case 'grammar_correction':
        return activity.content.sentences.length
      case 'color_mixing':
        return activity.content.exercises.length
      case 'note_reading':
        return activity.content.notes.length
      case 'fitness_circuit':
      case 'yoga_sequence':
        return activity.content.exercises.length
      case 'probability_calculation':
        return activity.content.problems.length
      case 'body_systems_matching':
        return activity.content.systems.length
      case 'speed_reading':
        return activity.content.passages.length
      case 'poetry_writing':
        return activity.content.forms.length
      case 'timeline_ordering':
        return activity.content.events.length
      case 'drawing_tutorial':
        return activity.content.steps.length
      case 'rhythm_tapping':
        return activity.content.patterns.length
      case 'logic_puzzle':
        return activity.content.puzzles.length
      case 'coding_concepts':
        return activity.content.concepts.length
      default:
        return 0
    }
  }

  const completeActivity = async () => {
    if (!user) return
    
    setIsCompleted(true)
    
    const finalScore = Math.round(score / getTotalQuestions())
    
    const progress: UserProgress = {
      id: Date.now().toString(),
      userId: user.id,
      activityId: activity.id,
      completedAt: new Date(),
      score: finalScore,
      timeSpent: Math.round(timeSpent / 60), // Convert to minutes
      answers,
    }
    
    // Record completion in freemium system
    const success = await freemiumSystem.recordActivityCompletion(
      user.id,
      activity.id,
      finalScore,
      Math.round(timeSpent / 60),
      answers
    )
    
    if (success) {
      onComplete(progress)
      setShowResults(true)
    }
  }

  const renderQuestion = () => {
    const question = getCurrentQuestion()
    if (!question) return null
    
    switch (activity.content.type) {
      case 'fraction_matching':
      case 'multiple_choice':
      case 'history_timeline':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{question.question}</h3>
            <div className="grid grid-cols-2 gap-3">
              {question.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )
      
      case 'multiplication_timed':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-center">{question.question}</h3>
            <div className="flex justify-center">
              <input
                type="number"
                className="text-2xl text-center border-b-2 border-gray-300 focus:border-blue-500 outline-none w-24"
                placeholder="?"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAnswer(parseInt(e.currentTarget.value))
                  }
                }}
                autoFocus
              />
            </div>
          </div>
        )
      
      case 'algebra_solving':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Solve: {question.equation}</h3>
            <div className="space-y-2">
              {question.steps.map((step: string, index: number) => (
                <p key={index} className="text-gray-600">Step {index + 1}: {step}</p>
              ))}
            </div>
            <div className="flex justify-center">
              <input
                type="number"
                className="text-xl text-center border-b-2 border-gray-300 focus:border-blue-500 outline-none w-20"
                placeholder="x = ?"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAnswer(parseInt(e.currentTarget.value))
                  }
                }}
                autoFocus
              />
            </div>
          </div>
        )
      
      case 'reading_comprehension':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{activity.content.story}</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{question.question}</h3>
              <div className="space-y-2">
                {question.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'writing_prompt':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Writing Prompt:</h3>
            <p className="text-gray-700">{activity.content.prompt}</p>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Your Story:</label>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none"
                placeholder="Write your story here..."
                maxLength={activity.content.wordLimit * 10} // Rough estimate
              />
            </div>
            <div className="text-sm text-gray-500">
              Word limit: {activity.content.wordLimit} words
            </div>
            <button
              onClick={() => handleAnswer('completed')}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Complete Writing
            </button>
          </div>
        )
      
      case 'fitness_circuit':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{question.name}</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{question.duration}s</div>
              <p className="text-gray-600">Duration</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold">{question.reps}</div>
              <p className="text-gray-600">Repetitions</p>
            </div>
            <button
              onClick={() => handleAnswer('completed')}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Exercise Completed
            </button>
          </div>
        )
      
      case 'yoga_sequence':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{question.name}</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">{question.duration}s</div>
              <p className="text-gray-600">Hold Time</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-700">{question.benefits}</p>
            </div>
            <button
              onClick={() => handleAnswer('completed')}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Pose Completed
            </button>
          </div>
        )
      
      case 'probability_calculation':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{question.question}</h3>
            <div className="flex justify-center">
              <input
                type="text"
                className="text-xl text-center border-b-2 border-gray-300 focus:border-blue-500 outline-none w-32"
                placeholder="Answer"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAnswer(e.currentTarget.value)
                  }
                }}
                autoFocus
              />
            </div>
            <div className="text-sm text-gray-600 mt-2">
              <p>Hint: {question.explanation}</p>
            </div>
          </div>
        )
      
      case 'body_systems_matching':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{question.system} System</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700 mb-2"><strong>Function:</strong> {question.function}</p>
              <p className="text-sm text-blue-700"><strong>Key Organs:</strong> {question.organs.join(', ')}</p>
            </div>
            <button
              onClick={() => handleAnswer('understood')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              I Understand
            </button>
          </div>
        )
      
      case 'speed_reading':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <p className="text-sm text-yellow-800 font-medium">Time Limit: {activity.content.timeLimit} seconds</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{question.text}</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Comprehension Questions:</h3>
              {question.questions.map((q: any, index: number) => (
                <div key={index} className="space-y-2">
                  <p className="text-sm font-medium">{q.question}</p>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Your answer..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAnswer('completed')
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => handleAnswer('completed')}
              className="w-full py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Complete Reading
            </button>
          </div>
        )
      
      case 'poetry_writing':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{question.type} Poetry</h3>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-700 mb-2"><strong>Description:</strong> {question.description}</p>
              <p className="text-sm text-purple-700"><strong>Example:</strong> {question.example}</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Your {question.type}:</label>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none"
                placeholder={`Write your ${question.type.toLowerCase()} here...`}
              />
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Prompt:</strong> {question.prompt}</p>
            </div>
            <button
              onClick={() => handleAnswer('completed')}
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Complete Poem
            </button>
          </div>
        )
      
      case 'timeline_ordering':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Historical Event: {question.year}</h3>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-lg font-medium text-orange-800">{question.event}</p>
              <p className="text-sm text-orange-700 mt-1">{question.description}</p>
            </div>
            <button
              onClick={() => handleAnswer('understood')}
              className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              I Understand This Event
            </button>
          </div>
        )
      
      case 'drawing_tutorial':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step {question.step}: {question.instruction}</h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700"><strong>Tip:</strong> {question.tip}</p>
            </div>
            <button
              onClick={() => handleAnswer('completed')}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Step Completed
            </button>
          </div>
        )
      
      case 'rhythm_tapping':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{question.name}</h3>
            <div className="text-center">
              <div className="text-3xl font-mono text-indigo-600 mb-2">{question.pattern}</div>
              <p className="text-gray-600">{question.description}</p>
            </div>
            <button
              onClick={() => handleAnswer('completed')}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Rhythm Completed
            </button>
          </div>
        )
      
      case 'logic_puzzle':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Logic Puzzle</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{question.scenario}</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Who is telling the truth?</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Your answer..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAnswer(e.currentTarget.value)
                  }
                }}
                autoFocus
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>Think carefully about who always tells the truth and who always lies!</p>
            </div>
          </div>
        )
      
      case 'coding_concepts':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{question.concept}</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">{question.description}</p>
              <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                {question.example}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Practice: {question.practice}</label>
              <textarea
                className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none font-mono text-sm"
                placeholder="Write your code here..."
              />
            </div>
            <button
              onClick={() => handleAnswer('completed')}
              className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
            >
              Complete Practice
            </button>
          </div>
        )
      
      default:
        return (
          <div className="text-center">
            <p className="text-gray-600">Activity type not implemented yet.</p>
            <button
              onClick={() => handleAnswer('completed')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Mark as Complete
            </button>
          </div>
        )
    }
  }

  const renderResults = () => {
    const finalScore = Math.round(score / getTotalQuestions())
    const timeMinutes = Math.round(timeSpent / 60)
    
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-green-600">Activity Completed!</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{finalScore}%</div>
            <p className="text-sm text-gray-600">Score</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{timeMinutes}m</div>
            <p className="text-sm text-gray-600">Time Spent</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-600">Great job completing "{activity.title}"!</p>
          <p className="text-sm text-gray-500">
            You've used {answers.length} of your daily activities.
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue Learning
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!canPerform) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">🔒</div>
        <h2 className="text-xl font-semibold">Daily Limit Reached</h2>
        <p className="text-gray-600">
          You've completed your {FREEMIUM_CONFIG.FREE_TIER.dailyActivityLimit} free activities for today.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">{activity.title}</h1>
          <p className="text-gray-600">{activity.description}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {getTotalQuestions()}</span>
          <span>{Math.round(timeSpent / 60)}m {timeSpent % 60}s</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / getTotalQuestions()) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="min-h-64">
        {showResults ? renderResults() : renderQuestion()}
      </div>
      
      {/* Footer */}
      {!showResults && !isCompleted && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subject: {activity.subject}</span>
            <span>Difficulty: {activity.difficulty}</span>
            <span>Type: {activity.type}</span>
          </div>
        </div>
      )}
    </div>
  )
} 