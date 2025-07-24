// Test Supabase Configuration
import { supabase } from './supabase';

export const testSupabaseConfig = {
  // Test if environment variables are loaded
  testEnvironmentVariables() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('🔧 Testing Supabase Configuration...');
    console.log('   Supabase URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing');
    console.log('   Supabase Key:', supabaseKey ? '✅ Loaded' : '❌ Missing');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Environment variables are missing!');
      return false;
    }
    
    console.log('✅ Environment variables are properly configured');
    return true;
  },

  // Test basic Supabase connection
  async testConnection() {
    try {
      console.log('🔧 Testing Supabase connection...');
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Supabase connection failed:', error.message);
        return false;
      }
      
      console.log('✅ Supabase connection successful');
      console.log('   Session:', data.session ? 'Active' : 'None');
      return true;
    } catch (error) {
      console.error('❌ Supabase connection error:', error);
      return false;
    }
  },

  // Test email validation with different formats
  async testEmailValidation() {
    const testEmails = [
      'test@example.com',
      'brightbuddy-test@gmail.com',
      'user@domain.co.uk',
      'test+tag@gmail.com',
      'test.user@company.org'
    ];
    
    console.log('🔧 Testing email validation...');
    
    for (const email of testEmails) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: 'testpassword123',
        });
        
        if (error) {
          console.log(`   ${email}: ❌ ${error.message}`);
        } else {
          console.log(`   ${email}: ✅ Valid format`);
        }
      } catch (error) {
        console.log(`   ${email}: ❌ Unexpected error`);
      }
    }
  },

  // Run all configuration tests
  async runAllTests() {
    console.log('🧪 Starting Supabase Configuration Tests...\n');
    
    // Test 1: Environment variables
    const envOk = this.testEnvironmentVariables();
    if (!envOk) {
      console.log('❌ Environment test failed. Stopping tests.');
      return false;
    }
    
    // Test 2: Connection
    const connectionOk = await this.testConnection();
    if (!connectionOk) {
      console.log('❌ Connection test failed. Stopping tests.');
      return false;
    }
    
    // Test 3: Email validation
    await this.testEmailValidation();
    
    console.log('\n✅ Supabase configuration tests completed!');
    return true;
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testSupabaseConfig = testSupabaseConfig;
} 