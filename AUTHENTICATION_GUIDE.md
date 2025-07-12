# BrightBuddy Authentication System Guide

## Overview

BrightBuddy uses Supabase for authentication, providing a secure and scalable authentication system with email/password and Google OAuth support.

## Architecture

### Core Components

1. **AuthContext** (`src/utils/AuthContext.tsx`)
   - Manages authentication state
   - Provides authentication methods
   - Handles session persistence

2. **Supabase Client** (`src/utils/supabase.ts`)
   - Supabase client configuration
   - Authentication helper functions

3. **Protected Routes** (`src/components/ProtectedRoute.tsx`)
   - Route protection component
   - Automatic redirect to login

4. **Authentication Pages**
   - Login (`src/app/auth/login/page.tsx`)
   - Signup (`src/app/auth/signup/page.tsx`)
   - Password Reset (`src/app/auth/reset-password/page.tsx`)
   - OAuth Callback (`src/app/auth/callback/page.tsx`)

## Features

### ✅ Implemented Features

- **Email/Password Authentication**
  - User registration with email verification
  - Secure login with password validation
  - Password reset functionality

- **Google OAuth**
  - One-click Google sign-in
  - Automatic account creation
  - Seamless integration

- **Session Management**
  - Automatic session persistence
  - Real-time authentication state updates
  - Secure session handling

- **Route Protection**
  - Protected routes for authenticated users
  - Automatic redirect to login
  - Loading states during authentication checks

- **User Profile Management**
  - User profile display
  - Email verification status
  - Sign out functionality

### 🔧 Authentication Methods

```typescript
// Available in useAuth() hook
const {
  user,                    // Current user object
  session,                 // Current session
  loading,                 // Authentication loading state
  isEmailVerified,         // Email verification status
  signIn,                  // Email/password sign in
  signUp,                  // Email/password sign up
  signInWithGoogle,        // Google OAuth sign in
  signOut,                 // Sign out
  resetPassword,           // Send password reset email
  updatePassword,          // Update user password
  refreshUser,             // Refresh user data
} = useAuth()
```

## Usage Examples

### Protecting a Route

```typescript
import ProtectedRoute from '../components/ProtectedRoute'

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  )
}
```

### Using Authentication in Components

```typescript
import { useAuth } from '../utils/AuthContext'

export default function MyComponent() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please sign in</div>
  }

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Handling Authentication Errors

```typescript
const handleSignIn = async (email: string, password: string) => {
  const { error } = await signIn(email, password)
  
  if (error) {
    // Handle specific error types
    switch (error.message) {
      case 'Invalid login credentials':
        setError('Invalid email or password')
        break
      case 'Email not confirmed':
        setError('Please verify your email address')
        break
      default:
        setError('An error occurred during sign in')
    }
  } else {
    // Successful sign in
    router.push('/dashboard')
  }
}
```

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Project Setup

1. Create a Supabase project at https://supabase.com
2. Enable authentication in the Supabase dashboard
3. Configure authentication providers:
   - Email/Password (enabled by default)
   - Google OAuth (requires Google Cloud Console setup)

### Google OAuth Setup

1. Create a Google Cloud Console project
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
5. Add credentials to Supabase dashboard

## Security Features

### ✅ Security Implementations

- **Password Requirements**
  - Minimum 6 characters
  - Secure password validation

- **Email Verification**
  - Required email verification for new accounts
  - Verification status tracking

- **Session Security**
  - Secure session tokens
  - Automatic session refresh
  - Secure logout

- **Route Protection**
  - Client-side route protection
  - Automatic redirect for unauthenticated users

### 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use different keys for development and production

2. **Error Handling**
   - Don't expose sensitive error messages
   - Log errors securely
   - Provide user-friendly error messages

3. **Input Validation**
   - Validate all user inputs
   - Sanitize data before processing
   - Use TypeScript for type safety

## Troubleshooting

### Common Issues

1. **Authentication Not Working**
   - Check environment variables
   - Verify Supabase project configuration
   - Check browser console for errors

2. **Google OAuth Issues**
   - Verify Google Cloud Console setup
   - Check redirect URIs configuration
   - Ensure Google+ API is enabled

3. **Email Verification Issues**
   - Check spam folder
   - Verify email address
   - Check Supabase email settings

### Debug Mode

Enable debug logging by adding to your component:

```typescript
const { user, session, loading } = useAuth()

console.log('Auth State:', { user, session, loading })
```

## Future Enhancements

### 🚀 Planned Features

- **Multi-Factor Authentication (MFA)**
  - SMS verification
  - Authenticator app support

- **Social Login Expansion**
  - GitHub OAuth
  - Microsoft OAuth
  - Apple Sign In

- **Advanced Security**
  - Rate limiting
  - IP-based restrictions
  - Device management

- **User Management**
  - Admin panel
  - User roles and permissions
  - Bulk user operations

### 🔧 Technical Improvements

- **Server-Side Protection**
  - API route protection
  - Server-side session validation

- **Performance Optimization**
  - Session caching
  - Lazy loading of auth components

- **Accessibility**
  - Screen reader support
  - Keyboard navigation
  - High contrast mode

## API Reference

### AuthContext Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `signIn` | `email: string, password: string` | `Promise<{data, error}>` | Sign in with email/password |
| `signUp` | `email: string, password: string` | `Promise<{data, error}>` | Create new account |
| `signInWithGoogle` | None | `Promise<{data, error}>` | Sign in with Google |
| `signOut` | None | `Promise<{error}>` | Sign out user |
| `resetPassword` | `email: string` | `Promise<{data, error}>` | Send password reset email |
| `updatePassword` | `password: string` | `Promise<{data, error}>` | Update user password |
| `refreshUser` | None | `Promise<void>` | Refresh user data |

### User Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique user ID |
| `email` | `string` | User email address |
| `email_confirmed_at` | `string \| null` | Email verification timestamp |
| `created_at` | `string` | Account creation timestamp |
| `updated_at` | `string` | Last update timestamp |

## Support

For authentication-related issues:

1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check browser console for errors
4. Verify environment configuration

---

**Note**: This authentication system is designed for educational purposes and follows security best practices. For production use, consider additional security measures and compliance requirements. 