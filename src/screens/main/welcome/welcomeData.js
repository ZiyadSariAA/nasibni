import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export const welcomeSlides = {
  arabic: [
    // SLIDE 1: مرحباً بناسبني (Welcome - FIRST!) 💜
    {
      id: 1,
      title: 'مرحباً بك في ناسبني',
      description: 'منصة إسلامية حديثة تجمع بين الأصالة والتقنية لمساعدتك في العثور على شريك حياتك المثالي',
      icon: <Ionicons name="heart" size={56} color="#4F2396" />,
      image: require('../../../assets/images/pridewomen/A_flat-style_digital_illustration_depicts_a_bride__brand_transparent_768w.png'),
    },
    // SLIDE 2: التفاهم (Understanding - 70% statistic) ✅
    {
      id: 2,
      title: 'التفاهم أساس الزواج الناجح',
      description: '70% من الزيجات الناجحة تبدأ بالتفاهم العميق والتوافق الحقيقي',
      icon: <Ionicons name="people" size={56} color="#4F2396" />,
      image: require('../../../assets/images/undraw_respond_o54z.png'),
    },
    // SLIDE 3: الاختيار الصحيح (Problem - Softened, ORANGE) ⚠️
    {
      id: 3,
      title: 'الاختيار الصحيح يبدأ من هنا',
      description: 'كثير من الزيجات تواجه صعوبات بسبب ضعف التوافق الأولي. نحن نساعدك على اختيار الشريك المناسب من البداية',
      icon: <Ionicons name="alert-circle" size={56} color="#F69554" />,
      image: require('../../../assets/images/undraw_before-dawn_8wuh.png'),
    },
    // SLIDE 4: بيئة آمنة (Safety features) 🛡️
    {
      id: 4,
      title: 'بيئة آمنة ومحترمة',
      description: 'مراقبة مستمرة • محادثات محترمة ومهذبة • خصوصية كاملة',
      icon: <Ionicons name="shield-checkmark" size={56} color="#4F2396" />,
      image: require('../../../assets/images/undraw_mobile-profile_vhpl.png'),
    },
    // SLIDE 5: ابدأ رحلتك (Call to Action - ORANGE rocket) 🚀
    {
      id: 5,
      title: 'ابدأ رحلتك الآن',
      description: 'انضم إلى آلاف الأشخاص الذين وجدوا حبهم الحقيقي. الآن دورك ✨',
      icon: <Ionicons name="rocket" size={56} color="#F69554" />,
      image: require('../../../assets/images/pridewomen/undraw_selfie_1xk7_brand_transparent_1200w.png'),
    },
  ],
  english: [
    // SLIDE 1: Welcome (FIRST!) 💜
    {
      id: 1,
      title: 'Welcome to Nasibni',
      description: 'Modern Islamic platform combining tradition with technology to help you find your perfect life partner',
      icon: <Ionicons name="heart" size={56} color="#4F2396" />,
      image: require('../../../assets/images/pridewomen/A_flat-style_digital_illustration_depicts_a_bride__brand_transparent_768w.png'),
    },
    // SLIDE 2: Understanding (70% statistic) ✅
    {
      id: 2,
      title: 'Understanding is the foundation',
      description: '70% of successful marriages start with deep understanding and genuine compatibility',
      icon: <Ionicons name="people" size={56} color="#4F2396" />,
      image: require('../../../assets/images/undraw_respond_o54z.png'),
    },
    // SLIDE 3: Problem (Softened, ORANGE) ⚠️
    {
      id: 3,
      title: 'The right choice starts here',
      description: 'Many marriages face challenges due to poor initial compatibility. We help you choose the right partner from the start',
      icon: <Ionicons name="alert-circle" size={56} color="#F69554" />,
      image: require('../../../assets/images/undraw_before-dawn_8wuh.png'),
    },
    // SLIDE 4: Safety Features 🛡️
    {
      id: 4,
      title: 'Safe & Respectful Environment',
      description: 'Continuous monitoring • Respectful conversations • Complete privacy',
      icon: <Ionicons name="shield-checkmark" size={56} color="#4F2396" />,
      image: require('../../../assets/images/undraw_mobile-profile_vhpl.png'),
    },
    // SLIDE 5: Call to Action (ORANGE rocket) 🚀
    {
      id: 5,
      title: 'Start Your Journey Now',
      description: 'Join thousands who found their true love. Now it\'s your turn ✨',
      icon: <Ionicons name="rocket" size={56} color="#F69554" />,
      image: require('../../../assets/images/pridewomen/undraw_selfie_1xk7_brand_transparent_1200w.png'),
    },
  ],
};
