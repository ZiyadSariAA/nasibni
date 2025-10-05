import React from 'react';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export const welcomeSlides = {
  arabic: [
    {
      id: 1,
      title: 'مرحباً بك في ناسبني',
      description: 'منصة الزواج الأولى المصممة خصيصاً للعرب والمسلمين\nابحث عن شريك حياتك في بيئة آمنة ومحترمة',
      icon: <MaterialIcons name="favorite" size={48} color="#4F2396" />,
      image: require('../../../assets/images/undraw_welcome-aboard_y4e9.png'),
    },
    {
      id: 2,
      title: 'مميزاتنا المميزة',
      description: 'تصفح آمن ومحمي • محادثات محترمة ومهذبة\nخصوصية كاملة • مراقبة مستمرة للحفاظ على الأخلاق',
      icon: <Ionicons name="shield-checkmark" size={48} color="#4F2396" />,
      image: require('../../../assets/images/undraw_text-messages_978a.png'),
    },
    {
      id: 3,
      title: 'ابدأ رحلتك الآن',
      description: 'رحلتك للبحث عن شريك الحياة المثالي تبدأ هنا\nانضم إلى آلاف الأشخاص الذين وجدوا حبهم الحقيقي',
      icon: <MaterialIcons name="rocket-launch" size={48} color="#4F2396" />,
      image: require('../../../assets/images/undraw_product-explainer_b7ft.png'),
    },
  ],
  english: [
    {
      id: 1,
      title: 'Welcome to Nasibni',
      description: 'The leading marriage platform designed specifically\nfor Arabs and Muslims worldwide',
      icon: <MaterialIcons name="favorite" size={48} color="#4F2396" />,
      image: require('../../../assets/images/undraw_welcome-aboard_y4e9.png'),
    },
    {
      id: 2,
      title: 'Our Unique Features',
      description: 'Safe & secure browsing • Respectful conversations\nComplete privacy • Continuous monitoring for values',
      icon: <Ionicons name="shield-checkmark" size={48} color="#4F2396" />,
      image: require('../../../assets/images/undraw_text-messages_978a.png'),
    },
    {
      id: 3,
      title: 'Start Your Journey',
      description: 'Your journey to find your perfect life partner starts here\nJoin thousands who found their true love',
      icon: <MaterialIcons name="rocket-launch" size={48} color="#4F2396" />,
      image: require('../../../assets/images/undraw_product-explainer_b7ft.png'),
    },
  ],
};
