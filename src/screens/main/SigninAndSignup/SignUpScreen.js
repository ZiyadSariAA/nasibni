import React, { useState } from 'react';
import { View, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Button, Text, Input, Header } from '../../../components/main';
import { FONTS } from '../../../config/fonts';

export default function SignUpScreen({ navigation }) {
  const { isArabic, isLoading: isLanguageLoading } = useLanguage();
  const { signUpWithEmail } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Don't render until language is loaded
  if (isLanguageLoading) {
    return null;
  }

  const handleSignUp = async () => {
    setIsSigningUp(true);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields'
      );
      setIsSigningUp(false);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'
      );
      setIsSigningUp(false);
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters'
      );
      setIsSigningUp(false);
      return;
    }

    try {
      const user = await signUpWithEmail(email, password, name);

      if (user) {
        console.log('✅ Account created:', user.email);
        Alert.alert(
          isArabic ? 'نجح!' : 'Success!',
          isArabic ? 'تم إنشاء حسابك بنجاح' : 'Your account has been created successfully',
          [{ text: isArabic ? 'حسناً' : 'OK' }]
        );
        // Navigation handled automatically by AppNavigator (will go to onboarding)
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      Alert.alert(
        isArabic ? 'خطأ في إنشاء الحساب' : 'Sign-up Error',
        error.message || (isArabic ? 'حدث خطأ أثناء إنشاء الحساب' : 'Failed to create account')
      );
    } finally {
      setIsSigningUp(false);
    }
  };

  const logoText = isArabic ? 'ناسبني' : 'Nasibni';
  const nameLabel = isArabic ? 'الاسم' : 'Name';
  const namePlaceholder = isArabic ? 'أدخل اسمك' : 'Enter your name';
  const emailLabel = isArabic ? 'البريد الإلكتروني' : 'Email';
  const emailPlaceholder = isArabic ? 'example@email.com' : 'example@email.com';
  const passwordLabel = isArabic ? 'كلمة المرور' : 'Password';
  const passwordPlaceholder = isArabic ? '••••••••' : '••••••••';
  const confirmPasswordLabel = isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password';
  const signUpButton = isArabic ? 'إنشاء حساب' : 'Sign Up';
  const haveAccount = isArabic ? 'لديك حساب؟' : 'Already have an account?';
  const signIn = isArabic ? 'تسجيل الدخول' : 'Sign In';

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header
        title={logoText}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
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
              width: 160,
              height: 160,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Form */}
        <View className="w-full">
          {/* Name Input */}
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
              {nameLabel}
            </Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder={namePlaceholder}
              autoCapitalize="words"
              style={{ marginBottom: 0 }}
              inputStyle={{
                fontFamily: FONTS.regular,
                fontSize: 16,
                color: '#1F2937',
                textAlign: isArabic ? 'right' : 'left',
              }}
            />
          </View>

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

          {/* Confirm Password Input */}
          <View className="mb-8">
            <Text
              style={{
                fontSize: 14,
                color: '#4F2396',
                marginBottom: 10,
                fontFamily: FONTS.semibold,
                textAlign: isArabic ? 'right' : 'left',
              }}
            >
              {confirmPasswordLabel}
            </Text>
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={passwordPlaceholder}
              secureTextEntry
              autoCapitalize="none"
              style={{ marginBottom: 0 }}
              inputStyle={{
                fontFamily: FONTS.regular,
                fontSize: 16,
                color: '#1F2937',
                textAlign: isArabic ? 'right' : 'left',
              }}
            />
          </View>

          {/* Sign Up Button */}
          <Button
            title={signUpButton}
            variant="primary"
            size="large"
            onPress={handleSignUp}
            loading={isSigningUp}
            disabled={isSigningUp}
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

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center">
            <Text
              style={{
                fontSize: 15,
                color: '#6B7280',
                fontFamily: FONTS.regular,
              }}
            >
              {haveAccount}{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text
                style={{
                  fontSize: 15,
                  color: '#4F2396',
                  fontFamily: FONTS.bold,
                }}
              >
                {signIn}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
