import React, { useState } from 'react';
import { View, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, StatusBar } from 'react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Button, Text, Input, Header } from '../../../components/main';
import { FONTS, APP_NAME_STYLE } from '../../../config/fonts';

export default function SignInScreen({ navigation }) {
  const { isArabic, isLoading } = useLanguage();
  const { signInWithEmail, resetPassword } = useAuth();

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
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      >
        {/* Image */}
        <View className="items-center mb-6 mt-4">
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
              borderRadius: 12,
              height: 56,
              marginBottom: 24,
              shadowColor: '#4F2396',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
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

