import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

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

  // Initialize auth state - Listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('🔐 Firebase user detected:', firebaseUser.email);

          // Get user profile from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          const userDocData = userDoc.data();
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userDocData?.displayName || '',
            profile: {
              completed: userDocData?.profileCompleted || false,
              data: userDocData?.profileData || null,
            },
          };

          // Only persist completed profiles
          if (userData.profile.completed) {
            await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
            console.log('✅ Saved completed profile to storage');
          }

          setUser(userData);
        } else {
          // No user signed in
          await AsyncStorage.removeItem('currentUser');
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Sign in with email and password (Firebase)
  const signInWithEmail = async (email, password) => {
    try {
      setLoading(true);
      console.log('🔐 Starting Firebase sign-in...');

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log('✅ Firebase sign-in successful:', firebaseUser.email);

      // Get user profile from Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      const userDocData = userDoc.data();
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || userDocData?.displayName || '',
        profile: {
          completed: userDocData?.profileCompleted || false,
          data: userDocData?.profileData || null,
        },
      };

      // ONLY save to AsyncStorage if profile is completed
      if (userData.profile.completed) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('✅ Saved completed profile to storage');
      } else {
        console.log('⚠️ Profile incomplete - NOT saving to storage');
      }

      setUser(userData);
      setLoading(false);

      return userData;
    } catch (error) {
      console.error('❌ Sign-In Error:', error);
      setLoading(false);

      // Handle Firebase errors with user-friendly messages
      let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';

      if (error.code === 'auth/invalid-email') {
        errorMessage = 'البريد الإلكتروني غير صالح';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'تم تعطيل هذا الحساب';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'المستخدم غير موجود';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'كلمة المرور غير صحيحة';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      }

      throw new Error(errorMessage);
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email, password, displayName = '') => {
    try {
      setLoading(true);
      console.log('📝 Starting Firebase sign-up...');

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log('✅ Firebase account created:', firebaseUser.email);

      // Create user profile in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        email: firebaseUser.email,
        displayName: displayName,
        profileCompleted: false,
        createdAt: new Date().toISOString(),
      });

      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: displayName,
        profile: {
          completed: false,
          data: null,
        },
      };

      setUser(userData);
      setLoading(false);

      return userData;
    } catch (error) {
      console.error('❌ Sign-Up Error:', error);
      setLoading(false);

      let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'البريد الإلكتروني غير صالح';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'كلمة المرور ضعيفة. يجب أن تكون 6 أحرف على الأقل';
      }

      throw new Error(errorMessage);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent');
    } catch (error) {
      console.error('❌ Reset Password Error:', error);

      let errorMessage = 'حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور';

      if (error.code === 'auth/invalid-email') {
        errorMessage = 'البريد الإلكتروني غير صالح';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'المستخدم غير موجود';
      }

      throw new Error(errorMessage);
    }
  };

  // Update user profile completion status
  const updateProfileCompletion = async (completed = true, profileData = null) => {
    try {
      if (!user) return;

      // Update Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        profileCompleted: completed,
        ...(profileData && { profileData }),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

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

      console.log('✅ Profile completion updated in Firestore:', completed);
    } catch (error) {
      console.error('Error updating profile completion:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
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
    signUpWithEmail,
    resetPassword,
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