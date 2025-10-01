import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import signinData from '../fakedata/sigingindata.json';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Initialize auth state - Only load completed profiles
  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('currentUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Only set user if profile is completed
          if (userData.profile?.completed) {
            setUser(userData);
          } else {
            // Clear incomplete profile
            await AsyncStorage.removeItem('currentUser');
          }
        }
        setLoading(false);
        setInitializing(false);
      } catch (error) {
        console.error('Error checking existing user:', error);
        setLoading(false);
        setInitializing(false);
      }
    };

    checkExistingUser();
  }, []);

  // Sign in with email and password (using fake data)
  const signInWithEmail = async (email, password) => {
    try {
      setLoading(true);
      console.log('🔐 Starting sign-in process...');

      // Find user in fake data
      const account = signinData.testAccounts.find(
        acc => acc.email === email && acc.password === password
      );

      if (!account) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }

      console.log('✅ User found:', account.displayName);

      // Create user object
      const userData = {
        uid: account.id,
        email: account.email,
        displayName: account.displayName,
        profile: {
          completed: account.profileCompleted,
        },
      };

      // ONLY save to AsyncStorage if profile is completed
      if (account.profileCompleted) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('✅ Saved completed profile to storage');
      } else {
        console.log('⚠️ Profile incomplete - NOT saving to storage');
      }

      // Set user state (in memory only if incomplete)
      setUser(userData);

      console.log('✅ User signed in successfully');
      setLoading(false);

      return userData;
    } catch (error) {
      console.error('❌ Sign-In Error:', error);
      setLoading(false);
      throw error;
    }
  };

  // Update user profile completion status
  const updateProfileCompletion = async (completed = true, profileData = null) => {
    try {
      if (!user) return;

      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          completed,
          ...(profileData && { data: profileData }),
        },
      };

      // ONLY save to AsyncStorage when profile is completed
      if (completed) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
        console.log('✅ Profile completed and saved to storage');
      }

      // Update state
      setUser(updatedUser);

      console.log('✅ Profile completion updated:', completed);
    } catch (error) {
      console.error('Error updating profile completion:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem('currentUser');
      setUser(null);
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is signed in
  const isSignedIn = async () => {
    return user !== null;
  };

  const value = {
    user,
    loading,
    initializing,
    signInWithEmail,
    updateProfileCompletion,
    signOut,
    isSignedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
