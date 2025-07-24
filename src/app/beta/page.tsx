'use client'

import React, { useState } from 'react';
import Link from 'next/link';

export default function BetaPage() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll just show success message
    // In production, you'd save this to a database
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">🌟</div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            BrightBuddy Beta
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of personalized learning. Join our exclusive beta and help shape the next generation of educational technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">25+ Learning Activities</h3>
            <p className="text-gray-600">Interactive games, quizzes, and exercises across 10 subjects</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-4">🏅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Achievement System</h3>
            <p className="text-gray-600">Earn badges, level up, and track your learning progress</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Analytics</h3>
            <p className="text-gray-600">Personalized insights and learning recommendations</p>
          </div>
        </div>

        {/* Beta Access */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Get Early Access
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Features */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">What's Included:</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✅</span>
                  <span>3 free activities per day</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✅</span>
                  <span>Access to all 10 subjects</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✅</span>
                  <span>Progress tracking & analytics</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✅</span>
                  <span>Achievement system</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✅</span>
                  <span>Personalized recommendations</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✅</span>
                  <span>Early access to premium features</span>
                </li>
              </ul>
            </div>

            {/* Right Column - Signup */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Join the Beta:</h3>
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                      What are you most excited about? (Optional)
                    </label>
                    <textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us what you're looking forward to..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Join Beta Now
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to BrightBuddy Beta!</h3>
                  <p className="text-gray-600 mb-6">You're now on the list for early access.</p>
                  <Link
                    href="/"
                    className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Try BrightBuddy Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Demo */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Try BrightBuddy?</h2>
          <p className="text-xl mb-6 opacity-90">
            Experience the full beta version right now - no signup required!
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-blue-600 py-3 px-8 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Launch BrightBuddy Beta
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-600">
          <p className="mb-2">Questions? Contact us at beta@brightbuddy.com</p>
          <p className="text-sm">Beta version - Features may change based on user feedback</p>
        </div>
      </div>
    </div>
  );
} 