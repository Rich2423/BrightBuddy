'use client'

import React, { useState } from 'react';
import { testAuthSystem } from '../../utils/testAuth';
import { testSupabaseConfig } from '../../utils/testSupabaseConfig';

export default function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runAuthTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addResult('🧪 Starting Authentication Tests...');
    
    try {
      // Override console.log to capture test output
      const originalLog = console.log;
      const originalError = console.error;
      
      console.log = (...args) => {
        originalLog(...args);
        addResult(args.join(' '));
      };
      
      console.error = (...args) => {
        originalError(...args);
        addResult(`❌ ${args.join(' ')}`);
      };
      
      await testAuthSystem.runAllTests();
      
      // Restore console
      console.log = originalLog;
      console.error = originalError;
      
      addResult('✅ Authentication tests completed!');
    } catch (error) {
      addResult(`❌ Test error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runSupabaseConfigTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addResult('🧪 Starting Supabase Configuration Tests...');
    
    try {
      // Override console.log to capture test output
      const originalLog = console.log;
      const originalError = console.error;
      
      console.log = (...args) => {
        originalLog(...args);
        addResult(args.join(' '));
      };
      
      console.error = (...args) => {
        originalError(...args);
        addResult(`❌ ${args.join(' ')}`);
      };
      
      await testSupabaseConfig.runAllTests();
      
      // Restore console
      console.log = originalLog;
      console.error = originalError;
      
      addResult('✅ Supabase configuration tests completed!');
    } catch (error) {
      addResult(`❌ Test error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runFreemiumTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addResult('🧪 Starting Freemium System Tests...');
    
    try {
      // Test freemium system functionality
      const { freemiumSystem } = await import('../../utils/FreemiumSystem');
      
      // Test 1: Check if user can perform activity
      addResult('1. Testing activity permission check...');
      const canPerform = await freemiumSystem.canPerformActivity('test-user');
      addResult(`   Result: ${canPerform.canPerform ? '✅ Can perform' : '❌ Cannot perform'}`);
      
      // Test 2: Record activity completion
      addResult('2. Testing activity completion recording...');
      const recorded = await freemiumSystem.recordActivityCompletion(
        'test-user',
        'test-activity',
        85,
        5
      );
      addResult(`   Result: ${recorded ? '✅ Recorded' : '❌ Failed to record'}`);
      
      // Test 3: Get user subscription
      addResult('3. Testing subscription retrieval...');
      const subscription = await freemiumSystem.getUserSubscription('test-user');
      addResult(`   Result: ${subscription.tier} tier`);
      
      // Test 4: Get today's usage
      addResult('4. Testing daily usage retrieval...');
      const usage = await freemiumSystem.getTodayUsage('test-user');
      addResult(`   Result: ${usage.activitiesCompleted} activities completed today`);
      
      addResult('✅ Freemium tests completed!');
    } catch (error) {
      addResult(`❌ Test error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runActivityTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addResult('🧪 Starting Activity System Tests...');
    
    try {
      const { activityManager } = await import('../../utils/ActivityDatabase');
      
      // Test 1: Get all activities
      addResult('1. Testing activity retrieval...');
      const activities = activityManager.getAllActivities();
      addResult(`   Result: ${activities.length} activities found`);
      
      // Test 2: Get activities by subject
      addResult('2. Testing subject filtering...');
      const mathActivities = activityManager.getActivitiesBySubject('Math');
      addResult(`   Result: ${mathActivities.length} Math activities`);
      
      // Test 3: Get free activities
      addResult('3. Testing free activity filtering...');
      const freeActivities = activityManager.getFreeActivities();
      addResult(`   Result: ${freeActivities.length} free activities`);
      
      // Test 4: Get premium activities
      addResult('4. Testing premium activity filtering...');
      const premiumActivities = activityManager.getPremiumActivities();
      addResult(`   Result: ${premiumActivities.length} premium activities`);
      
      addResult('✅ Activity tests completed!');
    } catch (error) {
      addResult(`❌ Test error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runAchievementTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addResult('🧪 Starting Achievement System Tests...');
    
    try {
      const { achievementSystem } = await import('../../utils/AchievementSystem');
      
      // Test 1: Get user achievements
      addResult('1. Testing achievement retrieval...');
      const achievements = await achievementSystem.getUserAchievements('test-user');
      addResult(`   Result: Level ${achievements.level}, ${achievements.totalPoints} points`);
      
      // Test 2: Check achievements
      addResult('2. Testing achievement checking...');
      const result = await achievementSystem.checkAchievements('test-user', {
        type: 'activity_completed',
        value: 1
      });
      addResult(`   Result: ${result.newlyUnlocked.length} new achievements unlocked`);
      
      addResult('✅ Achievement tests completed!');
    } catch (error) {
      addResult(`❌ Test error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runAnalyticsTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addResult('🧪 Starting Analytics System Tests...');
    
    try {
      const { analyticsSystem } = await import('../../utils/AnalyticsSystem');
      
      // Test 1: Track event
      addResult('1. Testing event tracking...');
      await analyticsSystem.trackEvent('test-user', 'test_event', { test: true });
      addResult('   Result: Event tracked successfully');
      
      // Test 2: Get user analytics
      addResult('2. Testing analytics retrieval...');
      const analytics = await analyticsSystem.getUserAnalytics('test-user');
      addResult(`   Result: ${analytics.activitiesCompleted} activities completed`);
      
      // Test 3: Get learning insights
      addResult('3. Testing insights generation...');
      const insights = await analyticsSystem.getLearningInsights('test-user');
      addResult(`   Result: Best time to learn is ${insights.bestTimeToLearn}`);
      
      addResult('✅ Analytics tests completed!');
    } catch (error) {
      addResult(`❌ Test error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addResult('🚀 Starting All System Tests...');
    
    await runAuthTests();
    await runFreemiumTests();
    await runActivityTests();
    await runAchievementTests();
    await runAnalyticsTests();
    
    addResult('🎉 All tests completed!');
    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          BrightBuddy System Tests
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={runSupabaseConfigTests}
              disabled={isRunning}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              🔧 Test Supabase Config
            </button>
            
            <button
              onClick={runAuthTests}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              🔐 Test Authentication
            </button>
            
            <button
              onClick={runFreemiumTests}
              disabled={isRunning}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              💎 Test Freemium
            </button>
            
            <button
              onClick={runActivityTests}
              disabled={isRunning}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              🎮 Test Activities
            </button>
            
            <button
              onClick={runAchievementTests}
              disabled={isRunning}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
            >
              🏅 Test Achievements
            </button>
            
            <button
              onClick={runAnalyticsTests}
              disabled={isRunning}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              📊 Test Analytics
            </button>
            
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              🚀 Run All Tests
            </button>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Clear Results
            </button>
            
            {isRunning && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Running tests...
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No test results yet. Run a test to see results here.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 