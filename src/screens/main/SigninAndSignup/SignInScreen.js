import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, StatusBar } from 'react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Button, Text, Input, Header } from '../../../components/main';
import { FONTS, APP_NAME_STYLE } from '../../../config/fonts';

export default function SignInScreen({ navigation }) {
  const { isArabic, isLoading } = useLanguage();
  const { signInWithEmail, resetPassword } = useAuth();
  const backgroundMusicRef = useRef(null);

  // Continue music from Welcome/Transition and fade out after 10 seconds
  useEffect(() => {
    const handleContinuousMusic = async () => {
      try {
        // Check if music is playing from Welcome screen
        if (global.splashBackgroundMusic) {
          const sound = global.splashBackgroundMusic;
          backgroundMusicRef.current = sound;

          console.log('🎵 Music continuing from Welcome (seamless!)');

          // Fade out after 10 seconds on SignIn screen
          setTimeout(async () => {
            if (sound) {
              console.log('🔉 Starting gradual fade-out over 5 seconds...');
              // VERY gradual fade out over 5 seconds (20 steps)
              for (let i = 20; i >= 0; i--) {
                try {
                  const volume = 0.3 * (i / 20);
                  await sound.setVolumeAsync(volume);
                  console.log(`  Volume: ${Math.round(volume * 100)}%`);
                  await new Promise(resolve => setTimeout(resolve, 250));
                } catch (err) {
                  console.log('  Fade interrupted');
                  break;
                }
              }
              await sound.stopAsync();
              await sound.unloadAsync();
              global.splashBackgroundMusic = null;
              backgroundMusicRef.current = null;
              console.log('✅ Music faded out completely');
            }
          }, 10000); // 10 seconds

        } else {
          console.log('⚠️ No continuous music from Welcome');
        }

      } catch (error) {
        console.error('❌ Error handling continuous music:', error);
      }
    };

    handleContinuousMusic();

    // Cleanup on unmount
    return () => {
      if (backgroundMusicRef.current) {
        console.log('🧹 Cleaning up SignIn music');
        backgroundMusicRef.current.stopAsync().then(() => {
          backgroundMusicRef.current.unloadAsync().catch(() => {});
        }).catch(() => {});
      }
    };
  }, []);

  // Don't render until language is loaded
  if (isLoading) {
    return null;
  }
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);

    // Validation
    if (!email || !password) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password'
      );
      setIsSigningIn(false);
      return;
    }

    try {
      const user = await signInWithEmail(email, password);

      if (user) {
        console.log('✅ Signed in:', user.email);
        console.log('Profile completed:', user.profile.completed);
        // Navigation handled automatically by AppNavigator
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      Alert.alert(
        isArabic ? 'خطأ في تسجيل الدخول' : 'Sign-in Error',
        error.message || (isArabic ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password')
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert(
        isArabic ? 'تنبيه' : 'Notice',
        isArabic ? 'يرجى إدخال بريدك الإلكتروني أولاً' : 'Please enter your email address first'
      );
      return;
    }

    try {
      await resetPassword(email);
      Alert.alert(
        isArabic ? 'تم الإرسال' : 'Email Sent',
        isArabic
          ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
          : 'Password reset link has been sent to your email'
      );
    } catch (error) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        error.message || (isArabic ? 'حدث خطأ أثناء إرسال البريد' : 'Failed to send reset email')
      );
    }
  };

  const logoText = isArabic ? 'ناسبني' : 'Nasibni';
  const taglineText = isArabic ? 'اعثر على شريك حياتك' : 'Find your life partner';
  const emailLabel = isArabic ? 'البريد الإلكتروني' : 'Email';
  const emailPlaceholder = isArabic ? 'example@email.com' : 'example@email.com';
  const passwordLabel = isArabic ? 'كلمة المرور' : 'Password';
  const passwordPlaceholder = isArabic ? '••••••••' : '••••••••';
  const signInButton = isArabic ? 'تسجيل الدخول' : 'Sign In';
  const forgotPassword = isArabic ? 'نسيت كلمة المرور؟' : 'Forgot Password?';
  const noAccount = isArabic ? 'ليس لديك حساب؟' : "Don't have an account?";
  const signUp = isArabic ? 'إنشاء حساب' : 'Sign Up';

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header
        title={logoText}
        showBackButton={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}
      >
        {/* Image */}
        <View className="items-center mt-6 mb-8">
          <Image
            source={require('../../../assets/images/newphoto.png')}
            style={{
              width: 180,
              height: 180,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Form */}
        <View className="w-full">
          {/* Email Input */}
          <View className="mb-6">
            <Text
              style={{
                fontSize: 14,
                color: '#4F2396',
                marginBottom: 10,
                fontFamily: FONTS.semibold,
                textAlign: isArabic ? 'right' : 'left',
              }}
            >
              {emailLabel}
            </Text>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder={emailPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={{ marginBottom: 0 }}
              inputStyle={{
                fontFamily: FONTS.regular,
                fontSize: 16,
                color: '#1F2937',
                textAlign: isArabic ? 'right' : 'left',
              }}
            />
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text
              style={{
                fontSize: 14,
                color: '#4F2396',
                marginBottom: 10,
                fontFamily: FONTS.semibold,
                textAlign: isArabic ? 'right' : 'left',
              }}
            >
              {passwordLabel}
            </Text>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder={passwordPlaceholder}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              style={{ marginBottom: 0 }}
              inputStyle={{
                fontFamily: FONTS.regular,
                fontSize: 16,
                color: '#1F2937',
                textAlign: isArabic ? 'right' : 'left',
              }}
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            className={`mb-8 ${isArabic ? 'items-start' : 'items-end'}`}
            onPress={handleForgotPassword}
          >
            <Text
              style={{
                fontSize: 14,
                color: '#4F2396',
                fontFamily: FONTS.semibold,
                textAlign: isArabic ? 'right' : 'left',
              }}
            >
              {forgotPassword}
            </Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <Button
            title={signInButton}
            variant="primary"
            size="large"
            onPress={handleSignIn}
            loading={isSigningIn}
            disabled={isSigningIn}
            style={{
              backgroundColor: '#4F2396',
              borderRadius: 16,
              height: 56,
              marginBottom: 32,
              shadowColor: '#4F2396',
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 10,
            }}
            textStyle={{
              fontFamily: FONTS.bold,
              color: '#FFFFFF',
              fontSize: 18,
            }}
          />

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center">
            <Text
              style={{
                fontSize: 15,
                color: '#6B7280',
                fontFamily: FONTS.regular,
              }}
            >
              {noAccount}{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text
                style={{
                  fontSize: 15,
                  color: '#4F2396',
                  fontFamily: FONTS.bold,
                }}
              >
                {signUp}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

