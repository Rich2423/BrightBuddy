'use client'

import React, { useState } from 'react';

interface FeedbackWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackWidget({ isOpen, onClose }: FeedbackWidgetProps) {
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general'>('general');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, we'll just show success message
    // In production, you'd send this to your backend
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      setEmail('');
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Beta Feedback</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackType('bug')}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    feedbackType === 'bug'
                      ? 'bg-red-100 text-red-700 border-2 border-red-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🐛 Bug
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('feature')}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    feedbackType === 'feature'
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  💡 Feature
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('general')}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    feedbackType === 'general'
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  💬 General
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={
                  feedbackType === 'bug' 
                    ? 'Describe the issue you encountered...'
                    : feedbackType === 'feature'
                    ? 'What feature would you like to see?'
                    : 'Share your thoughts about BrightBuddy...'
                }
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll only use this to follow up on your feedback
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Thank You!</h3>
            <p className="text-gray-600">
              Your feedback has been submitted. We appreciate your help in making BrightBuddy better!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook to manage feedback widget state
export function useFeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const openFeedback = () => setIsOpen(true);
  const closeFeedback = () => setIsOpen(false);

  return {
    isOpen,
    openFeedback,
    closeFeedback,
  };
} 