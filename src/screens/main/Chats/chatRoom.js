import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, FlatList, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { doc, getDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { MessageBubble, ChatInput } from '../../../components/main/chatComponents';
import { SmartStatusBar, LoadingState, Text } from '../../../components/main';
import ConversationService from '../../../services/ConversationService';

// Default avatars
const DEFAULT_AVATARS = {
  male: require('../../../assets/AvatorsInages/manAvator.png'),
  female: require('../../../assets/AvatorsInages/womanAvator.png')
};

/**
 * ChatRoom - Message thread screen
 */
export default function ChatRoom({ route }) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { isArabic } = useLanguage();
  const flatListRef = useRef(null);

  const { conversationId, conversation: passedConversation, otherUser: passedOtherUser } = route.params;

  const [conversation, setConversation] = useState(passedConversation || null);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(passedOtherUser || null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messagesLeft, setMessagesLeft] = useState(null);

  // Get other user ID
  const otherUserId = conversation?.participants?.find(id => id !== user?.uid);

  useEffect(() => {
    console.log('🎬 ChatRoom mounted with conversationId:', conversationId);
    
    if (!conversationId) {
      console.error('❌ No conversationId, going back');
      navigation.goBack();
      return;
    }

    console.log('📥 Loading conversation data...');
    loadConversation();
    
    const unsubscribe = subscribeToMessages();

    // Mark as read when opening
    if (user?.uid) {
      ConversationService.markConversationAsRead(conversationId, user.uid);
    }
    
    // Cleanup subscription on unmount
    return () => {
      console.log('🧹 ChatRoom unmounting, cleaning up subscription');
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [conversationId]);

  const loadConversation = async () => {
    try {
      console.log('📄 loadConversation: Starting...');
      
      if (passedConversation) {
        console.log('✅ Using passed conversation data');
        setConversation(passedConversation);
        checkMessageLimit(passedConversation);
        
        // Use passed other user data if available, otherwise load from Firebase
        if (passedOtherUser) {
          console.log('✅ Using passed other user data:', passedOtherUser.displayName);
          setOtherUser(passedOtherUser);
        } else {
          // Load other user after conversation is set
          const otherId = passedConversation.participants?.find(id => id !== user?.uid);
          if (otherId) {
            loadOtherUserById(otherId);
          }
        }
        return;
      }

      console.log('📡 Fetching conversation from Firestore...');
      const convDoc = await getDoc(doc(db, 'conversations', conversationId));
      
      if (convDoc.exists()) {
        console.log('✅ Conversation loaded');
        const convData = { id: convDoc.id, ...convDoc.data() };
        setConversation(convData);
        checkMessageLimit(convData);
        
        // Load other user after conversation is set
        const otherId = convData.participants?.find(id => id !== user?.uid);
        console.log('🔍 Other user ID from conversation:', otherId);
        if (otherId) {
          loadOtherUserById(otherId);
        }
      } else {
        console.error('❌ Conversation not found!');
        Alert.alert(
          isArabic ? 'خطأ' : 'Error',
          isArabic ? 'المحادثة غير موجودة' : 'Conversation not found'
        );
        navigation.goBack();
      }
    } catch (error) {
      console.error('❌ Error loading conversation:', error);
      setLoading(false);
    }
  };

  const checkMessageLimit = (conv) => {
    if (!user?.uid || !conv) return;

    const userData = conv.participantsMap?.[user.uid];
    if (userData && !userData.hasAccepted && conv.status !== 'active') {
      setMessagesLeft(userData.messagesAllowed || 0);
    } else {
      setMessagesLeft(null); // Unlimited
    }
  };

  const loadOtherUserById = async (otherId) => {
    try {
      console.log('👤 loadOtherUserById: Starting... otherUserId:', otherId);
      
      if (!otherId) {
        console.warn('⚠️ otherUserId is undefined');
        return;
      }

      console.log('📡 Fetching other user from Firestore...');
      const userDoc = await getDoc(doc(db, 'users', otherId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('✅ Other user loaded:', userData.profileData?.displayName || userData.displayName);
        setOtherUser({
          id: userDoc.id,
          displayName: userData.profileData?.displayName || userData.displayName || 'Unknown',
          gender: userData.profileData?.gender || 'male'
        });
      } else {
        console.error('❌ Other user not found!');
      }
    } catch (error) {
      console.error('❌ Error loading other user:', error);
    }
  };

  const subscribeToMessages = () => {
    try {
      console.log('📡 subscribeToMessages: Starting subscription...');
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log('📨 Messages snapshot received! Count:', snapshot.size);
        const loadedMessages = [];
        snapshot.forEach((doc) => {
          loadedMessages.push({
            id: doc.id,
            ...doc.data()
          });
        });

        console.log('✅ Messages loaded:', loadedMessages.length);
        setMessages(loadedMessages);
        setLoading(false);
        console.log('✅ Loading state set to false');

        // Scroll to bottom on new message
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, (error) => {
        console.error('❌ Snapshot error:', error);
        setLoading(false);
      });

      console.log('✅ Subscription created successfully');
      return unsubscribe;
    } catch (error) {
      console.error('❌ Error subscribing to messages:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || sending) return;

    // Check message limit
    if (messagesLeft !== null && messagesLeft <= 0) {
      Alert.alert(
        isArabic ? 'تم الوصول للحد الأقصى' : 'Limit Reached',
        isArabic
          ? 'وصلت للحد الأقصى من الرسائل. انتظر الطرف الآخر لقبول المحادثة.'
          : 'You\'ve reached the message limit. Wait for the other person to accept the conversation.'
      );
      return;
    }

    try {
      setSending(true);

      const result = await ConversationService.sendMessage(conversationId, user.uid, text);

      if (result.success) {
        console.log(' Message sent');

        // Update messages left count
        if (messagesLeft !== null && messagesLeft > 0) {
          setMessagesLeft(messagesLeft - 1);
        }
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        error.message || (isArabic ? 'فشل إرسال الرسالة' : 'Failed to send message')
      );
    } finally {
      setSending(false);
    }
  };

  const handleAcceptConversation = async () => {
    try {
      const result = await ConversationService.acceptConversation(conversationId, user.uid);

      if (result.success) {
        Alert.alert(
          isArabic ? 'تم القبول' : 'Accepted',
          isArabic ? 'تم قبول المحادثة بنجاح' : 'Conversation accepted successfully'
        );
        setMessagesLeft(null); // Unlimited now
        loadConversation(); // Reload to get updated status
      }
    } catch (error) {
      console.error('Error accepting conversation:', error);
    }
  };

  const handleDeclineConversation = async () => {
    Alert.alert(
      isArabic ? 'رفض المحادثة' : 'Decline Conversation',
      isArabic
        ? 'هل أنت متأكد من رفض هذه المحادثة؟'
        : 'Are you sure you want to decline this conversation?',
      [
        {
          text: isArabic ? 'إلغاء' : 'Cancel',
          style: 'cancel'
        },
        {
          text: isArabic ? 'رفض' : 'Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await ConversationService.declineConversation(conversationId, user.uid);

              if (result.success) {
                navigation.goBack();
              }
            } catch (error) {
              console.error('Error declining conversation:', error);
            }
          }
        }
      ]
    );
  };

  const handleAvatarPress = useCallback(() => {
    console.log('🖼️ Avatar pressed, navigating to profile');
    console.log('  - Other User ID:', otherUserId);
    console.log('  - Other User:', otherUser);

    if (!otherUserId) {
      console.error('❌ Other user ID not available');
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'معرف المستخدم غير متوفر' : 'User ID not available'
      );
      return;
    }

    console.log('✅ Navigating to DetailedUser...');
    // Use parent navigation (same pattern as HomeScreen/PeopleScreen)
    const parentNav = navigation.getParent();
    if (parentNav) {
      console.log('✅ Using parent navigator');
      parentNav.navigate('DetailedUser', {
        profileId: otherUserId,
        profileData: null // DetailedUserScreen will fetch full profile
      });
    } else {
      // Fallback to direct navigation
      console.log('⚠️ No parent navigator, using direct navigation');
      navigation.navigate('DetailedUser', {
        profileId: otherUserId,
        profileData: null
      });
    }
  }, [otherUserId, otherUser, navigation, isArabic]);

  const renderMessage = useCallback(({ item }) => {
    const isCurrentUser = item.senderId === user?.uid;
    return (
      <MessageBubble
        message={item}
        isCurrentUser={isCurrentUser}
        isSystemMessage={item.isSystemMessage}
      />
    );
  }, [user?.uid]);

  if (loading) {
    return <LoadingState message={isArabic ? 'جاري التحميل...' : 'Loading...'} />;
  }

  // Check if other user sent messages but current user hasn't accepted yet
  const hasUnacceptedMessages = conversation?.status === 'pending' &&
    !conversation?.participantsMap?.[user?.uid]?.hasAccepted &&
    messages.some(msg => msg.senderId === otherUserId && !msg.isSystemMessage);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F8F8FB' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <SmartStatusBar backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={{
        paddingTop: 48,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E7E5EA',
        flexDirection: isArabic ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}>
        {/* Back Arrow - Always on the left */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#F8F8FB',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>

        <View style={{ 
          flexDirection: isArabic ? 'row-reverse' : 'row', 
          alignItems: 'center', 
          gap: 12, 
          flex: 1 
        }}>
          {/* Avatar - Clickable to view full profile */}
          {otherUser && (
            <TouchableOpacity
              onPress={handleAvatarPress}
              activeOpacity={0.7}
            >
              <Image
                source={otherUser.firstPhoto ? { uri: otherUser.firstPhoto } : (otherUser.gender === 'female' ? DEFAULT_AVATARS.female : DEFAULT_AVATARS.male)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18
                }}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            </TouchableOpacity>
          )}

          <Text variant="h4" weight="semibold" style={{ 
            color: '#1A1A1A', 
            flex: 1,
            textAlign: isArabic ? 'right' : 'left'
          }} numberOfLines={1}>
            {otherUser?.displayName || (isArabic ? 'جاري التحميل...' : 'Loading...')}
          </Text>
        </View>

      </View>

      {/* Accept/Decline Banner */}
      {hasUnacceptedMessages && (
        <View style={{
          backgroundColor: '#FFD8C2',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#F69554'
        }}>
          <Text variant="caption" style={{ color: '#D97F45', marginBottom: 8, textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'لديك طلب محادثة جديد' : 'You have a new chat request'}
          </Text>
          <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={handleAcceptConversation}
              style={{
                flex: 1,
                backgroundColor: '#16A34A',
                paddingVertical: 8,
                borderRadius: 8,
                alignItems: 'center'
              }}
            >
              <Text variant="body" weight="semibold" style={{ color: '#ffffff' }}>
                {isArabic ? 'قبول' : 'Accept'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeclineConversation}
              style={{
                flex: 1,
                backgroundColor: '#DC2626',
                paddingVertical: 8,
                borderRadius: 8,
                alignItems: 'center'
              }}
            >
              <Text variant="body" weight="semibold" style={{ color: '#ffffff' }}>
                {isArabic ? 'رفض' : 'Decline'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        scrollEventThrottle={16}
        bounces={true}
        overScrollMode="auto"
        contentContainerStyle={{
          paddingVertical: 16,
          flexGrow: 1
        }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Chat Input */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={sending || (messagesLeft !== null && messagesLeft <= 0)}
        messagesLeft={messagesLeft}
      />
    </KeyboardAvoidingView>
  );
}
