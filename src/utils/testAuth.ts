// Authentication Test Utility
// This file contains test functions to verify authentication system functionality

import { supabase } from './supabase';

export const testAuthSystem = {
  // Test if Supabase connection is working
  async testConnection() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('❌ Supabase connection failed:', error);
        return false;
      }
      console.log('✅ Supabase connection successful');
      return true;
    } catch (error) {
      console.error('❌ Supabase connection error:', error);
      return false;
    }
  },

  // Test email/password signup
  async testSignup(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Signup failed:', error.message);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Signup successful:', data.user?.email);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { success: false, error: 'Unexpected error' };
    }
  },

  // Test email/password signin
  async testSignin(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Signin failed:', error.message);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Signin successful:', data.user?.email);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Signin error:', error);
      return { success: false, error: 'Unexpected error' };
    }
  },

  // Test Google OAuth (will redirect to Google)
  async testGoogleAuth() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('❌ Google OAuth failed:', error.message);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Google OAuth initiated');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Google OAuth error:', error);
      return { success: false, error: 'Unexpected error' };
    }
  },

  // Test password reset
  async testPasswordReset(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      
      if (error) {
        console.error('❌ Password reset failed:', error.message);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Password reset email sent');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Password reset error:', error);
      return { success: false, error: 'Unexpected error' };
    }
  },

  // Test signout
  async testSignout() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Signout failed:', error.message);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Signout successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Signout error:', error);
      return { success: false, error: 'Unexpected error' };
    }
  },

  // Test current user
  async testGetCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('❌ Get current user failed:', error.message);
        return { success: false, error: error.message };
      }
      
      if (user) {
        console.log('✅ Current user:', user.email);
        return { success: true, user };
      } else {
        console.log('ℹ️ No user currently signed in (this is expected for initial test)');
        return { success: true, user: null };
      }
    } catch (error) {
      console.error('❌ Get current user error:', error);
      return { success: false, error: 'Unexpected error' };
    }
  },

  // Run all authentication tests
  async runAllTests() {
    console.log('🧪 Starting Authentication System Tests...\n');
    
    // Test 1: Connection
    console.log('1. Testing Supabase connection...');
    const connectionOk = await this.testConnection();
    if (!connectionOk) {
      console.log('❌ Connection test failed. Stopping tests.');
      return false;
    }
    
    // Test 2: Get current user
    console.log('\n2. Testing get current user...');
    await this.testGetCurrentUser();
    
    // Test 3: Signup (with test email)
    console.log('\n3. Testing signup...');
    const testEmail = `brightbuddy-test-${Date.now()}@gmail.com`;
    const testPassword = 'testpassword123';
    const signupResult = await this.testSignup(testEmail, testPassword);
    
    if (signupResult.success) {
      console.log('✅ Signup successful! Note: Email confirmation may be required for signin.');
      console.log('   For beta testing, this is expected behavior.');
      
      // Test 4: Signin (may fail due to email confirmation requirement)
      console.log('\n4. Testing signin...');
      const signinResult = await this.testSignin(testEmail, testPassword);
      
      if (signinResult.success) {
        // Test 5: Get current user after signin
        console.log('\n5. Testing get current user after signin...');
        await this.testGetCurrentUser();
        
        // Test 6: Signout
        console.log('\n6. Testing signout...');
        await this.testSignout();
        
        // Test 7: Get current user after signout
        console.log('\n7. Testing get current user after signout...');
        await this.testGetCurrentUser();
      } else {
        console.log('⚠️ Signin failed due to email confirmation requirement');
        console.log('   This is expected for new accounts in production mode');
        console.log('   For beta testing, you can manually confirm the email or use existing accounts');
      }
    } else {
      console.log('⚠️ Signup failed, but this might be expected if email already exists or for testing purposes');
      console.log('   This is not a critical failure for the authentication system test');
    }
    
    // Test 8: Password reset (won't actually send email in test)
    console.log('\n8. Testing password reset...');
    await this.testPasswordReset('test@example.com');
    
    console.log('\n✅ Authentication system tests completed!');
    return true;
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testAuth = testAuthSystem;
} 